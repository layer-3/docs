---
sidebar_position: 2
title: Prerequisites & Environment
description: Set up your development environment for building Yellow Apps
keywords: [prerequisites, setup, development, environment, Node.js, viem]
---

# Prerequisites & Environment

In this guide, you will set up a complete development environment for building applications on Yellow Network.

**Goal**: Have a working local environment ready for Yellow App development.

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Node.js** | 18.x | 20.x or later |
| **npm/yarn/pnpm** | Latest stable | Latest stable |
| **Operating System** | macOS, Linux, Windows | macOS, Linux |

---

## Required Knowledge

Before building on Yellow Network, you should be comfortable with:

| Topic | Why It Matters |
|-------|----------------|
| **JavaScript/TypeScript** | SDK and examples are in TypeScript |
| **Async/await patterns** | All network operations are asynchronous |
| **Basic Web3 concepts** | Wallets, transactions, signatures |
| **ERC-20 tokens** | Fund management involves token operations |

:::tip New to Web3?
If you're new to blockchain development, start with the [Ethereum Developer Documentation](https://ethereum.org/developers) to understand wallets, transactions, and smart contract basics.
:::

---

## Step 1: Install Node.js

### macOS (using Homebrew)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Windows

Download and run the installer from [nodejs.org](https://nodejs.org/).

---

## Step 2: Install Core Dependencies

Create a new project and install the required packages:

```bash
# Create project directory
mkdir yellow-app && cd yellow-app

# Initialize project
npm init -y

# Install core dependencies
npm install @erc7824/nitrolite viem

# Install development dependencies
npm install -D typescript @types/node tsx
```

### Package Overview

| Package | Purpose |
|---------|---------|
| `@erc7824/nitrolite` | Yellow Network SDK for state channel operations |
| `viem` | Modern Ethereum library for wallet and contract interactions |
| `typescript` | Type safety and better developer experience |
| `tsx` | Run TypeScript files directly |

---

## Step 3: Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Update `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## Step 4: Set Up Environment Variables

Create `.env` for sensitive configuration:

```bash
# .env - Never commit this file!

# Your wallet private key (for development only)
PRIVATE_KEY=0x...

# RPC endpoints
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
BASE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# Clearnode WebSocket endpoint
CLEARNODE_WS_URL=wss://clearnode.yellow.com/ws

# Contract addresses (get from Yellow Network docs)
CUSTODY_ADDRESS=0x...
ADJUDICATOR_ADDRESS=0x...
```

Add to `.gitignore`:

```bash
# .gitignore
.env
.env.local
node_modules/
dist/
```

Install dotenv for loading environment variables:

```bash
npm install dotenv
```

---

## Step 5: Wallet Setup

### Development Wallet

For development, create a dedicated wallet:

```typescript
// scripts/create-wallet.ts
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log('New Development Wallet');
console.log('----------------------');
console.log('Address:', account.address);
console.log('Private Key:', privateKey);
console.log('\n⚠️  Save this private key securely and add to .env');
```

Run it:

```bash
npx tsx scripts/create-wallet.ts
```

### Get Test Tokens

For testnet development, you need test tokens:

| Network | Faucet |
|---------|--------|
| Sepolia | [sepoliafaucet.com](https://sepoliafaucet.com) |
| Base Sepolia | [base.org/faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) |

:::warning Development Only
Never use your main wallet or real funds for development. Always create a separate development wallet with test tokens.
:::

---

## Step 6: Verify Setup

Create `src/index.ts` to verify everything works:

```typescript
import 'dotenv/config';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

async function main() {
  // Verify environment variables
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY not set in .env');
  }

  // Create account from private key
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log('✓ Wallet loaded:', account.address);

  // Create public client
  const client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  // Check connection
  const blockNumber = await client.getBlockNumber();
  console.log('✓ Connected to Sepolia, block:', blockNumber);

  // Check balance
  const balance = await client.getBalance({ address: account.address });
  console.log('✓ ETH balance:', balance.toString(), 'wei');

  console.log('\n🎉 Environment setup complete!');
}

main().catch(console.error);
```

Run the verification:

```bash
npm run dev
```

Expected output:

```
✓ Wallet loaded: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
✓ Connected to Sepolia, block: 12345678
✓ ETH balance: 100000000000000000 wei

🎉 Environment setup complete!
```

---

## Project Structure

Recommended folder structure for Yellow Apps:

```
yellow-app/
├── src/
│   ├── index.ts          # Entry point
│   ├── config.ts         # Configuration
│   ├── client.ts         # Nitrolite client setup
│   ├── auth.ts           # Authentication logic
│   └── channels/
│       ├── create.ts     # Channel creation
│       ├── transfer.ts   # Transfer operations
│       └── close.ts      # Channel closure
├── scripts/
│   └── create-wallet.ts  # Utility scripts
├── .env                  # Environment variables (git-ignored)
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Supported Networks

Yellow Network currently supports these EVM-compatible chains:

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum Mainnet | 1 | Production |
| Polygon | 137 | Production |
| Arbitrum One | 42161 | Production |
| Optimism | 10 | Production |
| Base | 8453 | Production |
| Sepolia (testnet) | 11155111 | Testing |

---

## Next Steps

Your environment is ready! Continue to:

- **[Key Terms & Mental Models](./key-terms)** — Understand the core concepts
- **[Quickstart](./quickstart)** — Build your first Yellow App
- **[State Channels vs L1/L2](../core-concepts/state-channels-vs-l1-l2)** — Deep dive into state channels

---

## Common Issues

### "Module not found" errors
Ensure you have `"type": "module"` in `package.json` and are using ESM imports.

### "Cannot find module 'viem'"
Run `npm install` to ensure all dependencies are installed.

### RPC rate limiting
Use a dedicated RPC provider (Infura, Alchemy) instead of public endpoints for production.

### TypeScript errors with viem
Ensure your `tsconfig.json` has `"moduleResolution": "bundler"` or `"node16"`.


