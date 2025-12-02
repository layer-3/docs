---
sidebar_position: 1
title: "Quickstart: Your First Channel"
description: Create your first state channel and perform an off-chain transfer in minutes
keywords: [quickstart, tutorial, state channel, Nitrolite, getting started]
---

# Quickstart: Your First Channel

In this guide, you will create a state channel, perform an off-chain transfer, and verify the transaction—all in under 10 minutes.

**Goal**: Experience the full Yellow Network flow from authentication to transfer.

---

## Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- A Web3 wallet (MetaMask, Rabby, or similar)
- Test tokens from the Yellow Network Sandbox faucet

:::tip Get Test Tokens
Request test tokens directly to your unified balance:

```bash
curl -XPOST https://clearnet-sandbox.yellow.com/faucet/requestTokens \
  -H "Content-Type: application/json" \
  -d '{"userAddress":"<your_wallet_address>"}'
```

Tokens are credited immediately—no on-chain operations needed! For complete setup instructions, see [Prerequisites](./prerequisites#get-test-tokens).
:::

---

## Step 1: Install the SDK

Create a new project and install the Nitrolite SDK:

```bash
# Create project directory
mkdir my-yellow-app && cd my-yellow-app

# Initialize package.json
npm init -y

# Install dependencies
npm install @erc7824/nitrolite viem
```

---

## Step 2: Initialize the Client

Create a file `index.js` and set up the Nitrolite client:

```javascript
import { NitroliteClient } from '@erc7824/nitrolite';
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Your wallet private key (use environment variables in production!)
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY');

// Create viem clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(),
  account,
});

// Initialize Nitrolite client
const client = new NitroliteClient({
  publicClient,
  walletClient,
  // State signer function for off-chain operations
  stateSigner: async (state) => {
    const signature = await walletClient.signMessage({
      message: { raw: state },
    });
    return signature;
  },
  // Contract addresses (get these from Yellow Network documentation)
  addresses: {
    custody: '0xCUSTODY_CONTRACT_ADDRESS',
    adjudicator: '0xADJUDICATOR_CONTRACT_ADDRESS',
  },
  chainId: sepolia.id,
  challengeDuration: 3600n, // 1 hour challenge period
});

console.log('✓ Client initialized');
```

---

## Step 3: Authenticate with Clearnode

Establish a session with the Clearnode using the 3-step authentication flow.

:::tip Clearnode Endpoints
- **Production**: `wss://clearnet.yellow.com/ws`
- **Sandbox**: `wss://clearnet-sandbox.yellow.com/ws` (recommended for testing)
:::

```javascript
// Connect to Clearnode WebSocket (using sandbox for testing)
const ws = new WebSocket('wss://clearnet-sandbox.yellow.com/ws');

// Step 1: Generate session keypair locally
const sessionPrivateKey = generatePrivateKey(); // Your crypto library
const sessionAddress = privateKeyToAddress(sessionPrivateKey);

// Step 2: Send auth_request (no signature required)
const authRequest = {
  req: [
    1, // requestId
    'auth_request',
    {
      address: account.address,           // Your main wallet address
      session_key: sessionAddress,        // Session key you generated
      allowances: [{ asset: 'usdc', amount: '100.0' }], // Spending limit
      expires_at: Date.now() + 24 * 60 * 60 * 1000,    // 24 hours
    },
    Date.now(),
  ],
  sig: [], // No signature needed for auth_request
};

ws.send(JSON.stringify(authRequest));

// Step 3: Sign the challenge with your MAIN wallet (EIP-712)
ws.onmessage = async (event) => {
  const response = JSON.parse(event.data);
  
  if (response.res[1] === 'auth_challenge') {
    const challenge = response.res[2].challenge_message;
    
    // Create EIP-712 typed data signature with main wallet
    const signature = await signTypedData(/* EIP-712 Policy structure */);
    
    // Send auth_verify
    const verifyRequest = {
      req: [2, 'auth_verify', { challenge }, Date.now()],
      sig: [signature],
    };
    ws.send(JSON.stringify(verifyRequest));
  }
  
  if (response.res[1] === 'auth_verify') {
    console.log('✓ Authenticated successfully');
    console.log('  Session key:', response.res[2].session_key);
    console.log('  JWT token received');
  }
};
```

:::info Session Key Security
Your session key private key **never leaves your device**. The main wallet only signs once during authentication. All subsequent operations use the session key.
:::

---

## Step 4: Create a Channel

Request channel creation from the Clearnode:

```javascript
// Request channel creation
const createChannelRequest = {
  req: [
    3,
    'create_channel',
    {
      chain_id: 11155111, // Sepolia
      token: '0xUSDA_TOKEN_ADDRESS', // USDC on Sepolia
    },
    Date.now(),
  ],
  sig: [sessionKeySignature], // Sign with session key
};

ws.send(JSON.stringify(createChannelRequest));

// Handle response
ws.onmessage = async (event) => {
  const response = JSON.parse(event.data);
  
  if (response.res[1] === 'create_channel') {
    const { channel_id, channel, state, server_signature } = response.res[2];
    
    console.log('✓ Channel prepared:', channel_id);
    
    // Sign the state with your participant key
    const userSignature = await signPackedState(channel_id, state);
    
    // Submit to blockchain
    const txHash = await client.createChannel({
      channel,
      state,
      signatures: [userSignature, server_signature],
    });
    
    console.log('✓ Channel created on-chain:', txHash);
  }
};
```

---

## Step 5: Fund Your Channel

Resize the channel to add funds:

```javascript
// Request channel resize (add funds)
const resizeRequest = {
  req: [
    4,
    'resize_channel',
    {
      channel_id: '0xYOUR_CHANNEL_ID',
      allocations: [
        { participant: account.address, asset: 'usdc', amount: '50.0' },
        { participant: clearnodeAddress, asset: 'usdc', amount: '0.0' },
      ],
    },
    Date.now(),
  ],
  sig: [sessionKeySignature],
};

ws.send(JSON.stringify(resizeRequest));

// Complete the on-chain resize after receiving server signature
// ... (similar pattern to channel creation)

console.log('✓ Channel funded with 50 USDC');
```

---

## Step 6: Make an Off-Chain Transfer

Transfer funds instantly without any blockchain transaction:

```javascript
// Transfer 10 USDC to another user
const transferRequest = {
  req: [
    5,
    'transfer',
    {
      destination: '0xRECIPIENT_ADDRESS',
      allocations: [{ asset: 'usdc', amount: '10.0' }],
    },
    Date.now(),
  ],
  sig: [sessionKeySignature],
};

ws.send(JSON.stringify(transferRequest));

// Handle confirmation
ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  
  if (response.res[1] === 'transfer') {
    console.log('✓ Transfer complete!');
    console.log('  Amount: 10 USDC');
    console.log('  Time: < 1 second');
    console.log('  Gas cost: $0.00');
  }
};
```

---

## Step 7: Verify Your Balance

Query your updated unified balance:

```javascript
const balanceRequest = {
  req: [
    6,
    'get_ledger_balances',
    {},
    Date.now(),
  ],
  sig: [sessionKeySignature],
};

ws.send(JSON.stringify(balanceRequest));

// Response shows updated balance
// Original: 50 USDC
// After transfer: 40 USDC
```

---

## What You Accomplished

You just completed the core Yellow Network workflow:

| Step | What Happened | Gas Cost |
|------|---------------|----------|
| Authentication | Established secure session with Clearnode | None |
| Create Channel | Locked funds in on-chain contract | ~$2-5 |
| Fund Channel | Added USDC to your unified balance | ~$2-5 |
| Transfer | Sent 10 USDC instantly | **$0** |
| Query Balance | Verified updated balance | None |

The transfer completed in under 1 second with zero gas fees.

---

## Next Steps

Now that you've completed the basics:

- **[Prerequisites & Environment](./prerequisites)** — Set up a complete development environment
- **[Key Terms & Mental Models](./key-terms)** — Understand core concepts in depth
- **[State Channels vs L1/L2](../core-concepts/state-channels-vs-l1-l2)** — Learn why state channels are different

For production applications, see the **[Build](/docs/build/quick-start)** section for complete implementation guides.

---

## Troubleshooting

### "Insufficient balance" error
Ensure you have deposited funds into the Custody Contract before creating a channel.

### "Signature verification failed"
Check that you're signing with the correct key:
- `auth_verify`: Main wallet (EIP-712)
- All other requests: Session key

### "Challenge period" errors
The minimum challenge period is 1 hour. Ensure your `challengeDuration` is at least 3600 seconds.

### Connection issues
Verify WebSocket URL and that you're connected to the correct network (testnet vs mainnet).


