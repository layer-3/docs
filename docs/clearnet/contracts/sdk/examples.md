---
title: "Examples"
description: "Code samples for viem, ethers.js, and wagmi."
sidebar_position: 3
displayed_sidebar: buildSidebar
---

# SDK — Examples

Practical code samples for common operations using `@yellow-org/contracts`.

## Setup (viem)

All examples below use this shared setup:

```ts
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {
  YellowTokenAbi,
  NodeRegistryAbi,
  AppRegistryAbi,
  YellowGovernorAbi,
  TreasuryAbi,
  FaucetAbi,
  addresses,
} from "@yellow-org/contracts";

const addr = addresses[1]; // or addresses[11155111] for Sepolia

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: mainnet,
  transport: http(),
  account: privateKeyToAccount("0x..."),
});
```

---

## Token

### Check balance and approve

```ts
const balance = await publicClient.readContract({
  address: addr.yellowToken!,
  abi: YellowTokenAbi,
  functionName: "balanceOf",
  args: [walletClient.account.address],
});

// Approve NodeRegistry to spend tokens for collateral deposit
await walletClient.writeContract({
  address: addr.yellowToken!,
  abi: YellowTokenAbi,
  functionName: "approve",
  args: [addr.nodeRegistry!, parseEther("1000")],
});
```

---

## Node Operator Collateral (NodeRegistry)

### Post security deposit

```ts
// Post YELLOW as a mandatory functional security deposit to operate a clearnode
await walletClient.writeContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "lock",
  args: [walletClient.account.address, parseEther("1000")],
});
```

### Read lock state

```ts
const state = await publicClient.readContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "lockStateOf",
  args: [userAddress],
});
// 0 = Idle, 1 = Locked, 2 = Unlocking

const locked = await publicClient.readContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "balanceOf",
  args: [userAddress],
});

const unlockAt = await publicClient.readContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "unlockTimestampOf",
  args: [userAddress],
});
```

### Unlock, relock, withdraw

```ts
// Start unlock countdown
await walletClient.writeContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "unlock",
});

// Cancel unlock
await walletClient.writeContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "relock",
});

// Withdraw after period elapses
await walletClient.writeContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "withdraw",
  args: [walletClient.account.address], // destination
});
```

### Delegate collateral weight

```ts
// Delegate collateral weight for protocol parameter administration
await walletClient.writeContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "delegate",
  args: [delegateeAddress],
});

// Check collateral weight
const weight = await publicClient.readContract({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "getVotes",
  args: [userAddress],
});
```

---

## Protocol Parameter Administration

### Create a proposal

```ts
import { encodeFunctionData, keccak256, toBytes } from "viem";

// Example: transfer 1000 YELLOW from Treasury to a grants recipient
const calldata = encodeFunctionData({
  abi: TreasuryAbi,
  functionName: "transfer",
  args: [addr.yellowToken!, recipientAddress, parseEther("1000")],
});

const description = "Transfer 1000 YELLOW to grants recipient";

await walletClient.writeContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "propose",
  args: [
    [addr.treasury!],      // targets
    [0n],                   // values
    [calldata],             // calldatas
    description,
  ],
});
```

### Signal support on a proposal

```ts
// support: 0 = Against, 1 = For, 2 = Abstain
await walletClient.writeContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "castVote",
  args: [proposalId, 1], // For
});

// With reason
await walletClient.writeContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "castVoteWithReason",
  args: [proposalId, 1, "Necessary parameter update for network scaling"],
});
```

### Queue and execute

```ts
const descriptionHash = keccak256(toBytes(description));

// Queue (after operator consensus is reached)
await walletClient.writeContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "queue",
  args: [[addr.treasury!], [0n], [calldata], descriptionHash],
});

// Execute (after timelock delay)
await walletClient.writeContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "execute",
  args: [[addr.treasury!], [0n], [calldata], descriptionHash],
});
```

### Read proposal state

```ts
const state = await publicClient.readContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "state",
  args: [proposalId],
});
// 0=Pending, 1=Active, 2=Canceled, 3=Defeated,
// 4=Succeeded, 5=Queued, 6=Expired, 7=Executed

const [againstWeight, forWeight, abstainWeight] = await publicClient.readContract({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  functionName: "proposalVotes",
  args: [proposalId],
});
```

---

## Slashing (AppRegistry — adjudicator)

```ts
// Slash an app builder's service quality guarantee for protocol violation
await walletClient.writeContract({
  address: addr.appRegistry!,
  abi: AppRegistryAbi,
  functionName: "slash",
  args: [
    userAddress,
    parseEther("500"),
    treasuryAddress,         // recipient
    "0x1234abcd",            // decision reference
  ],
});
```

---

## Listening to Events

```ts
// Watch for new collateral deposits on NodeRegistry
publicClient.watchContractEvent({
  address: addr.nodeRegistry!,
  abi: NodeRegistryAbi,
  eventName: "Locked",
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(`${log.args.user} posted ${log.args.deposited} collateral`);
    }
  },
});

// Watch for new parameter proposals
publicClient.watchContractEvent({
  address: addr.governor!,
  abi: YellowGovernorAbi,
  eventName: "ProposalCreated",
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(`Proposal ${log.args.proposalId} by ${log.args.proposer}`);
    }
  },
});
```

---

## Faucet (Sepolia)

```ts
import { sepolia } from "viem/chains";

const sepoliaAddr = addresses[11155111];

await walletClient.writeContract({
  address: sepoliaAddr.faucet!,
  abi: FaucetAbi,
  functionName: "drip",
});
```
