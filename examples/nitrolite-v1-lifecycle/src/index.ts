import 'dotenv/config';

import { Decimal } from 'decimal.js';
import { isAddress, type Address, type Hex } from 'viem';
import {
  AppSessionWalletSignerV1,
  AppStateUpdateIntent,
  Client,
  EthereumMsgSigner,
  createSigners,
  packAppStateUpdateV1,
  packCreateAppSessionRequestV1,
  withBlockchainRPC,
  type AppDefinitionV1,
  type AppSessionInfoV1,
  type AppStateUpdateV1,
  type State,
} from '@yellow-org/sdk';

type LifecycleConfig = {
  userPrivateKey: Hex;
  appPrivateKey: Hex;
  wsURL: string;
  rpcURL: string;
  chainId: bigint;
  asset: string;
  channelDepositAmount: Decimal;
  appDepositAmount: Decimal;
  operateAmount: Decimal;
  withdrawAmount: Decimal;
  closeHomeChannel: boolean;
};

type Clients = {
  user: Client;
  app: Client;
};

type WalletClientWithWriteContract = {
  account?: unknown;
  writeContract?: (request: Record<string, unknown>) => Promise<Hex>;
};

type EVMClientFactoryResult = {
  walletClient?: WalletClientWithWriteContract | null;
};

type ClientWithEVMFactory = {
  createEVMClients?: (chainId: bigint, rpcURL: string) => EVMClientFactoryResult;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

function privateKeyEnv(name: string): Hex {
  const value = requireEnv(name);
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(`${name} must be a 32-byte hex private key with 0x prefix`);
  }
  return value as Hex;
}

function decimalEnv(name: string, fallback: string): Decimal {
  const value = optionalEnv(name, fallback);
  const amount = new Decimal(value);
  if (!amount.isFinite() || amount.isNegative()) {
    throw new Error(`${name} must be a non-negative decimal amount`);
  }
  return amount;
}

function loadConfig(): LifecycleConfig {
  const userPrivateKey = privateKeyEnv('USER_PRIVATE_KEY');
  const appPrivateKey = privateKeyEnv('APP_PRIVATE_KEY');

  if (userPrivateKey.toLowerCase() === appPrivateKey.toLowerCase()) {
    throw new Error('USER_PRIVATE_KEY and APP_PRIVATE_KEY must be different wallets');
  }

  const chainId = BigInt(requireEnv('CHAIN_ID'));
  const asset = requireEnv('ASSET').toLowerCase();
  const appDepositAmount = decimalEnv('APP_DEPOSIT_AMOUNT', '0.005');
  const operateAmount = decimalEnv('OPERATE_AMOUNT', '0.001');
  const withdrawAmount = decimalEnv('WITHDRAW_AMOUNT', '0.002');

  if (!appDepositAmount.isPositive()) {
    throw new Error('APP_DEPOSIT_AMOUNT must be greater than zero');
  }
  if (operateAmount.plus(withdrawAmount).greaterThan(appDepositAmount)) {
    throw new Error('OPERATE_AMOUNT + WITHDRAW_AMOUNT must be <= APP_DEPOSIT_AMOUNT');
  }

  return {
    userPrivateKey,
    appPrivateKey,
    wsURL: requireEnv('NITRONODE_WS_URL'),
    rpcURL: requireEnv('RPC_URL'),
    chainId,
    asset,
    channelDepositAmount: decimalEnv('CHANNEL_DEPOSIT_AMOUNT', '0.01'),
    appDepositAmount,
    operateAmount,
    withdrawAmount,
    closeHomeChannel: optionalEnv('CLOSE_HOME_CHANNEL', 'false').toLowerCase() === 'true',
  };
}

function stage(title: string): void {
  console.log(`\n== ${title} ==`);
}

function logState(label: string, state: State): void {
  console.log(
    `${label}: version=${state.version.toString()} transition=${state.transition.type} ` +
      `homeBalance=${state.homeLedger.userBalance.toFixed()} homeChannel=${state.homeChannelId ?? 'none'}`
  );
}

function logSession(label: string, session: AppSessionInfoV1, userAddress: Address, appAddress: Address, asset: string): void {
  const userAllocation = allocationFor(session, userAddress, asset);
  const appAllocation = allocationFor(session, appAddress, asset);
  console.log(
    `${label}: version=${session.version.toString()} closed=${session.isClosed} ` +
      `user=${userAllocation.toFixed()} app=${appAllocation.toFixed()}`
  );
}

function maxDecimal(left: Decimal, right: Decimal): Decimal {
  return left.greaterThan(right) ? left : right;
}

function isAllowanceError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /allowance|approval|approve|insufficient.*allow/i.test(message);
}

async function getLatestStateOrNull(client: Client, wallet: Address, asset: string, onlySigned: boolean): Promise<State | null> {
  try {
    return await client.getLatestState(wallet, asset, onlySigned);
  } catch {
    return null;
  }
}

async function checkpointWithApproval(client: Client, config: LifecycleConfig): Promise<string | null> {
  try {
    return await client.checkpoint(config.asset);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes('does not require a blockchain operation')) {
      return null;
    }
    if (!isAllowanceError(error)) {
      throw error;
    }

    console.log(`checkpoint needs token approval; approving ${config.channelDepositAmount.toFixed()} ${config.asset}`);
    await client.approveToken(config.chainId, config.asset, config.channelDepositAmount);
    return await client.checkpoint(config.asset);
  }
}

async function connectClients(config: LifecycleConfig): Promise<Clients> {
  const userSigners = createSigners(config.userPrivateKey);
  const appSigners = createSigners(config.appPrivateKey);

  const user = await Client.create(
    config.wsURL,
    userSigners.stateSigner,
    userSigners.txSigner,
    withBlockchainRPC(config.chainId, config.rpcURL)
  );

  const app = await Client.create(
    config.wsURL,
    appSigners.stateSigner,
    appSigners.txSigner,
    withBlockchainRPC(config.chainId, config.rpcURL)
  );

  enableNodeLocalAccountTransactions(user);
  enableNodeLocalAccountTransactions(app);

  return { user, app };
}

function enableNodeLocalAccountTransactions(client: Client): void {
  const sdkClient = client as unknown as ClientWithEVMFactory;
  const originalFactory = sdkClient.createEVMClients?.bind(client);
  if (!originalFactory) {
    return;
  }

  sdkClient.createEVMClients = (chainId: bigint, rpcURL: string): EVMClientFactoryResult => {
    const result = originalFactory(chainId, rpcURL);
    const walletClient = result.walletClient;
    if (!walletClient?.account || !walletClient.writeContract) {
      return result;
    }

    // Node.js public RPCs need the LocalAccount object when viem sends writes.
    // Keep using SDK methods, but preserve the local account after simulation.
    const localAccount = walletClient.account;
    const originalWriteContract = walletClient.writeContract.bind(walletClient);
    walletClient.writeContract = (request: Record<string, unknown>): Promise<Hex> => {
      return originalWriteContract({ ...request, account: localAccount });
    };

    return result;
  };
}

async function inspectNode(client: Client, config: LifecycleConfig): Promise<void> {
  const nodeConfig = await client.getConfig();
  console.log(`node=${nodeConfig.nodeAddress} version=${nodeConfig.nodeVersion}`);

  const blockchains = await client.getBlockchains();
  const selectedChain = blockchains.find((chain) => chain.id === config.chainId);
  if (!selectedChain) {
    throw new Error(`Nitronode does not list configured CHAIN_ID ${config.chainId.toString()}`);
  }
  console.log(`chain=${selectedChain.name} id=${selectedChain.id.toString()}`);

  const assets = await client.getAssets(config.chainId);
  const selectedAsset = assets.find((asset) => asset.symbol.toLowerCase() === config.asset);
  if (!selectedAsset) {
    throw new Error(`Nitronode does not list asset ${config.asset} on chain ${config.chainId.toString()}`);
  }
  console.log(`asset=${selectedAsset.symbol} decimals=${selectedAsset.decimals}`);
}

async function setHomeBlockchain(client: Client, asset: string, chainId: bigint): Promise<void> {
  try {
    await client.setHomeBlockchain(asset, chainId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('home blockchain is already set')) {
      throw error;
    }
  }
}

async function prepareHomeChannel(client: Client, config: LifecycleConfig): Promise<State> {
  const wallet = client.getUserAddress();
  await setHomeBlockchain(client, config.asset, config.chainId);

  const signedBefore = await getLatestStateOrNull(client, wallet, config.asset, true);
  const latestBefore = await getLatestStateOrNull(client, wallet, config.asset, false);

  if (signedBefore) {
    logState('signed state before prepare', signedBefore);
  }
  if (latestBefore && (!signedBefore || latestBefore.id !== signedBefore.id || latestBefore.version !== signedBefore.version)) {
    logState('pending state before prepare', latestBefore);
  }

  if (latestBefore && latestBefore.homeLedger.userBalance.isPositive() && !latestBefore.userSig) {
    console.log(`acknowledging pending ${config.asset} channel state`);
    try {
      await client.acknowledge(config.asset);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.toLowerCase().includes('already acknowledged')) {
        throw error;
      }
    }
    const txHash = await checkpointWithApproval(client, config);
    console.log(txHash ? `ack checkpoint tx=${txHash}` : 'acknowledged without on-chain checkpoint');
  }

  const signedAfterAck = await getLatestStateOrNull(client, wallet, config.asset, true);
  const existingBalance = signedAfterAck?.homeLedger.userBalance ?? new Decimal(0);
  if (signedAfterAck && existingBalance.greaterThanOrEqualTo(config.appDepositAmount)) {
    logState('home channel ready', signedAfterAck);
    return signedAfterAck;
  }

  const deficit = config.appDepositAmount.minus(existingBalance);
  const depositAmount = maxDecimal(config.channelDepositAmount, deficit);
  const onChainBalance = await client.getOnChainBalance(config.chainId, config.asset, wallet);
  console.log(`on-chain ${config.asset} balance=${onChainBalance.toFixed()}`);

  if (onChainBalance.lessThan(depositAmount)) {
    throw new Error(
      `Wallet ${wallet} needs at least ${depositAmount.toFixed()} ${config.asset} on chain ${config.chainId.toString()}`
    );
  }

  console.log(`approving ${depositAmount.toFixed()} ${config.asset}`);
  await client.approveToken(config.chainId, config.asset, depositAmount);

  console.log(`depositing ${depositAmount.toFixed()} ${config.asset} into the home channel`);
  const depositState = await client.deposit(config.chainId, config.asset, depositAmount);
  logState('deposit state', depositState);

  const txHash = await checkpointWithApproval(client, config);
  console.log(txHash ? `deposit checkpoint tx=${txHash}` : 'deposit did not require an on-chain checkpoint');

  const ready = await getLatestStateOrNull(client, wallet, config.asset, true);
  if (!ready || ready.homeLedger.userBalance.lessThan(config.appDepositAmount)) {
    throw new Error(`Home channel did not reach ${config.appDepositAmount.toFixed()} ${config.asset}`);
  }

  logState('home channel ready', ready);
  return ready;
}

function makeAppID(): string {
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `docs-v1-lifecycle-${suffix}`;
}

function appSessionSigner(privateKey: Hex): AppSessionWalletSignerV1 {
  return new AppSessionWalletSignerV1(new EthereumMsgSigner(privateKey));
}

async function getSession(client: Client, appSessionId: string): Promise<AppSessionInfoV1> {
  const { sessions } = await client.getAppSessions({ appSessionId });
  const session = sessions[0];
  if (!session) {
    throw new Error(`App session ${appSessionId} was not returned by Nitronode`);
  }
  return session;
}

function allocationFor(session: AppSessionInfoV1, participant: Address, asset: string): Decimal {
  const allocation = session.allocations.find(
    (entry) => entry.participant.toLowerCase() === participant.toLowerCase() && entry.asset.toLowerCase() === asset
  );
  return allocation?.amount ?? new Decimal(0);
}

function nextVersion(session: AppSessionInfoV1): bigint {
  return session.version + 1n;
}

async function signUpdate(
  update: AppStateUpdateV1,
  userSessionSigner: AppSessionWalletSignerV1,
  appSessionSignerValue: AppSessionWalletSignerV1
): Promise<[Hex, Hex]> {
  const payload = packAppStateUpdateV1(update);
  const userSig = await userSessionSigner.signMessage(payload);
  const appSig = await appSessionSignerValue.signMessage(payload);
  return [userSig, appSig];
}

async function runAppSessionLifecycle(clients: Clients, config: LifecycleConfig): Promise<string> {
  const userAddress = clients.user.getUserAddress();
  const appAddress = clients.app.getUserAddress();
  const userSessionSigner = appSessionSigner(config.userPrivateKey);
  const appSessionSignerValue = appSessionSigner(config.appPrivateKey);

  if (!isAddress(userAddress) || !isAddress(appAddress)) {
    throw new Error('SDK returned an invalid signer address');
  }

  const appID = makeAppID();
  console.log(`registering app=${appID} owner=${appAddress}`);
  try {
    await clients.app.registerApp(appID, JSON.stringify({ name: 'Docs v1 lifecycle example' }), true);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('apps.v1 group is disabled')) {
      throw error;
    }
    console.log('app registry is disabled on this node; continuing with app-session creation');
  }

  const sessionData = JSON.stringify({ intent: 'init', source: 'yellow-docs' });
  const definition: AppDefinitionV1 = {
    applicationId: appID,
    participants: [
      { walletAddress: userAddress, signatureWeight: 1 },
      { walletAddress: appAddress, signatureWeight: 1 },
    ],
    quorum: 2,
    nonce: BigInt(Date.now()) * 1_000_000n + BigInt(Math.floor(Math.random() * 1_000_000)),
  };

  const createPayload = packCreateAppSessionRequestV1(definition, sessionData);
  const createUserSig = await userSessionSigner.signMessage(createPayload);
  const createAppSig = await appSessionSignerValue.signMessage(createPayload);
  const created = await clients.user.createAppSession(definition, sessionData, [createUserSig, createAppSig]);
  console.log(`created app session=${created.appSessionId} version=${created.version} status=${created.status}`);

  let session = await getSession(clients.user, created.appSessionId);
  logSession('after create', session, userAddress, appAddress, config.asset);

  const depositUpdate: AppStateUpdateV1 = {
    appSessionId: created.appSessionId,
    intent: AppStateUpdateIntent.Deposit,
    version: nextVersion(session),
    allocations: [
      { participant: userAddress, asset: config.asset, amount: config.appDepositAmount },
      { participant: appAddress, asset: config.asset, amount: new Decimal(0) },
    ],
    sessionData: JSON.stringify({ intent: 'user_deposit', amount: config.appDepositAmount.toFixed() }),
  };
  const depositSigs = await signUpdate(depositUpdate, userSessionSigner, appSessionSignerValue);
  const nodeSig = await clients.user.submitAppSessionDeposit(
    depositUpdate,
    depositSigs,
    config.asset,
    config.appDepositAmount
  );
  console.log(`app-session deposit nodeSig=${nodeSig}`);

  session = await getSession(clients.user, created.appSessionId);
  logSession('after app deposit', session, userAddress, appAddress, config.asset);

  const userAfterDeposit = allocationFor(session, userAddress, config.asset);
  const appAfterDeposit = allocationFor(session, appAddress, config.asset);
  if (userAfterDeposit.lessThan(config.operateAmount)) {
    throw new Error('OPERATE_AMOUNT exceeds the user app-session allocation');
  }

  const operateUpdate: AppStateUpdateV1 = {
    appSessionId: created.appSessionId,
    intent: AppStateUpdateIntent.Operate,
    version: nextVersion(session),
    allocations: [
      { participant: userAddress, asset: config.asset, amount: userAfterDeposit.minus(config.operateAmount) },
      { participant: appAddress, asset: config.asset, amount: appAfterDeposit.plus(config.operateAmount) },
    ],
    sessionData: JSON.stringify({ intent: 'purchase', amount: config.operateAmount.toFixed() }),
  };
  const operateSigs = await signUpdate(operateUpdate, userSessionSigner, appSessionSignerValue);
  await clients.user.submitAppState(operateUpdate, operateSigs);

  session = await getSession(clients.user, created.appSessionId);
  logSession('after operate', session, userAddress, appAddress, config.asset);

  const userAfterOperate = allocationFor(session, userAddress, config.asset);
  const appAfterOperate = allocationFor(session, appAddress, config.asset);
  if (userAfterOperate.lessThan(config.withdrawAmount)) {
    throw new Error('WITHDRAW_AMOUNT exceeds the user app-session allocation');
  }

  const withdrawUpdate: AppStateUpdateV1 = {
    appSessionId: created.appSessionId,
    intent: AppStateUpdateIntent.Withdraw,
    version: nextVersion(session),
    allocations: [
      { participant: userAddress, asset: config.asset, amount: userAfterOperate.minus(config.withdrawAmount) },
      { participant: appAddress, asset: config.asset, amount: appAfterOperate },
    ],
    sessionData: JSON.stringify({ intent: 'user_withdraw', amount: config.withdrawAmount.toFixed() }),
  };
  const withdrawSigs = await signUpdate(withdrawUpdate, userSessionSigner, appSessionSignerValue);
  await clients.user.submitAppState(withdrawUpdate, withdrawSigs);

  session = await getSession(clients.user, created.appSessionId);
  logSession('after withdraw', session, userAddress, appAddress, config.asset);

  const closeUpdate: AppStateUpdateV1 = {
    appSessionId: created.appSessionId,
    intent: AppStateUpdateIntent.Close,
    version: nextVersion(session),
    allocations: [
      { participant: userAddress, asset: config.asset, amount: allocationFor(session, userAddress, config.asset) },
      { participant: appAddress, asset: config.asset, amount: allocationFor(session, appAddress, config.asset) },
    ],
    sessionData: JSON.stringify({ intent: 'close' }),
  };
  const closeSigs = await signUpdate(closeUpdate, userSessionSigner, appSessionSignerValue);
  await clients.user.submitAppState(closeUpdate, closeSigs);

  session = await getSession(clients.user, created.appSessionId);
  logSession('after close', session, userAddress, appAddress, config.asset);

  return created.appSessionId;
}

async function maybeCloseHomeChannel(client: Client, config: LifecycleConfig): Promise<void> {
  if (!config.closeHomeChannel) {
    console.log('home-channel close skipped; set CLOSE_HOME_CHANNEL=true to run cleanup');
    return;
  }

  const closeState = await client.closeHomeChannel(config.asset);
  logState('home-channel close state', closeState);
  const txHash = await checkpointWithApproval(client, config);
  console.log(txHash ? `home-channel close checkpoint tx=${txHash}` : 'home-channel close did not require checkpoint');
}

async function main(): Promise<void> {
  const config = loadConfig();
  let clients: Clients | null = null;

  try {
    stage('Connect clients');
    clients = await connectClients(config);
    console.log(`user=${clients.user.getUserAddress()}`);
    console.log(`app=${clients.app.getUserAddress()}`);

    stage('Inspect Nitronode config and set home blockchain');
    await inspectNode(clients.user, config);
    await setHomeBlockchain(clients.app, config.asset, config.chainId);

    stage('Prepare user home channel');
    await prepareHomeChannel(clients.user, config);

    stage('Run app-session lifecycle');
    const appSessionId = await runAppSessionLifecycle(clients, config);

    stage('Final queries');
    const finalState = await getLatestStateOrNull(clients.user, clients.user.getUserAddress(), config.asset, true);
    if (finalState) {
      logState('final signed channel state', finalState);
    }
    const finalSession = await getSession(clients.user, appSessionId);
    logSession('final app session', finalSession, clients.user.getUserAddress(), clients.app.getUserAddress(), config.asset);

    stage('Optional cleanup');
    await maybeCloseHomeChannel(clients.user, config);

    console.log('\nLifecycle complete.');
  } finally {
    if (clients) {
      await Promise.allSettled([clients.user.close(), clients.app.close()]);
    }
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nLifecycle failed.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
