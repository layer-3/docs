---
title: Requesting Blockchain Support
description: Guide for requesting blockchain network support in Clearnode Sandbox or Production environments
sidebar_label: Request Blockchain Support
keywords: [clearnode, blockchain, configuration, EVM, production, sandbox]
---

# Requesting Blockchain Support

This guide is primarily for **blockchain integrators, infrastructure teams, and project partners** who need to add support for new blockchain networks in the Clearnode infrastructure. Following this process will enable Clearnode to connect to your blockchain and provide off-chain clearing and settlement services.

## What Happens When Support is Added

Once a blockchain is supported in Clearnode:

- Clearnode can establish RPC connections to the specified blockchain network
- The Nitrolite protocol smart contracts (custody, adjudicator, and balance checker) will be monitored on that chain
- Users can deposit and withdraw assets on that blockchain through Clearnode
- State channels can leverage that blockchain for on-chain settlement when needed
- Assets deployed on the supported blockchain become available for cross-chain clearing

:::warning Non-EVM and Limited Infrastructure Support
If your blockchain support request concerns a **non-EVM blockchain** or a blockchain with **limited infrastructure support** (e.g., scarce RPC providers, incomplete tooling, experimental networks), **you must contact the development team before proceeding** with this guide. These cases require custom development and cannot be handled through standard configuration.

Contact the dev team via [GitHub Issues](https://github.com/layer-3/nitrolite/issues).
:::

## Understanding Environments

Clearnode operates in two distinct environments with separate configurations:

| Environment | Purpose | Typical Networks |
|-------------|---------|------------------|
| **Sandbox** | Development, testing, and experimentation | Testnets (Sepolia, Polygon Amoy, etc.) |
| **Production** | Live operations with real assets | Mainnets (Ethereum, Polygon, Base, Linea, etc.) |

**Configuration file location:** `clearnode/chart/config/<sandbox_or_prod>/blockchains.yaml`

**Important Considerations:**

- **Production will not support test networks** - mainnet blockchains only
- **Sandbox will not support mainnet networks** - testnet blockchains only
- You must decide which environment needs the blockchain support based on your use case
- If you need support in both environments (e.g., testnet for development, mainnet for production), you must submit configuration changes to both files

## How to Request Support

Blockchain support is requested by creating or modifying a configuration file in the [nitrolite](https://github.com/erc7824/nitrolite) repository:

1. **Fork the repository**: `https://github.com/erc7824/nitrolite`
2. **Navigate to the appropriate configuration file**:
   - For Sandbox: `clearnode/chart/config/sandbox/blockchains.yaml`
   - For Production: `clearnode/chart/config/prod/blockchains.yaml`
3. **Add your blockchain configuration** at the end of the `blockchains` list (see next section for structure)
4. **Submit a Pull Request** with a clear description of the blockchain being added
5. **Wait for review** by the development team

The next section provides detailed guidance on the configuration structure.

## Blockchain Configuration Structure

### Overview

The `blockchains.yaml` file contains two main sections:

- `default_contract_addresses`: Default smart contract addresses applied to all blockchains (unless overridden)
- `blockchains`: Array of blockchain configurations

### Configuration Fields

Each blockchain entry requires the following fields:

```yaml
blockchains:
  - name: polygon                 # Blockchain name (lowercase, underscores allowed)
    id: 137                       # Chain ID for validation
    disabled: false               # Whether to disable (default: false)
    block_step: 10000             # Block range for scanning (default: 10000)
    contract_addresses:           # Override default contract addresses
      custody: "0x..."
      adjudicator: "0x..."
      balance_checker: "0x..."
```

**Field Descriptions:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | **Yes** | Unique identifier for the blockchain (lowercase, underscores allowed, e.g., `polygon`, `base`, `arbitrum_one`) |
| `id` | **Yes** | Chain ID used for validation (must match the blockchain's official chain ID) |
| `disabled` | No | Set to `true` to disable or `false` to enable (default: `false`) |
| `block_step` | No | Number of blocks to scan per query when monitoring events (default: `10000`). Adjust based on blockchain or RPC provider performance. |
| `contract_addresses` | No | Override default contract addresses for this specific blockchain |

### Contract Deployment

When requesting the addition of a new blockchain, addresses of the infrastructure smart contracts must be provided:

- **Custody Contract**: Manages user deposits and withdrawals
- **Adjudicator Contract**: Handles dispute resolution for state channels
- **Balance Checker Contract**: Provides efficient balance queries

:::info Smart contract deployment
For now, you don't need to deploy these contracts yourself. The development team will handle contract deployment on the new blockchain as part of the support process.

You can submit your request with smart contract addresses set to placeholder values (e.g., `0x0000000000000000000000000000000000000000`). The team will replace them with the actual deployed addresses during integration.
:::

:::info Coming Soon: Cross-Chain Contract Deployment Tool
We are developing a tool to simplify the deployment of Nitrolite protocol smart contracts across multiple blockchains with deterministic addresses. This will enable deploying contracts to the same address on different chains, making configuration management significantly easier.
:::

Read on to learn how to specify contract addresses in the configuration.

You have two options for providing contract addresses:

#### Option 1: Using Default Contract Addresses

If you deploy contracts at the addresses specified in the `default_contract_addresses`, you don't need to specify `contract_addresses` in each blockchain entry.

```yaml
default_contract_addresses:
  custody: "0x490fb189DdE3a01B00be9BA5F41e3447FbC838b6"
  adjudicator: "0xcbbc03a873c11beeFA8D99477E830be48d8Ae6D7"
  balance_checker: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4"

blockchains:
  - name: polygon
    id: 137
    enabled: true
  - name: base
    id: 8453
    enabled: true
```

This approach is cleaner when contracts are deployed at identical addresses.

#### Option 2: Blockchain-Specific Contract Addresses

If contract addresses differ on your blockchain, specify them individually:

```yaml
blockchains:
  - name: polygon
    id: 137
    enabled: true
    contract_addresses:
      custody: "0xPolygonCustodyAddress..."
      adjudicator: "0xPolygonAdjudicatorAddress..."
      balance_checker: "0xPolygonBalanceCheckerAddress..."
  - name: base
    id: 8453
    enabled: true
    contract_addresses:
      custody: "0xBaseCustodyAddress..."
      adjudicator: "0xBaseAdjudicatorAddress..."
      balance_checker: "0xBaseBalanceCheckerAddress..."
```

:::warning Contract Address Requirements
Each blockchain **must have all three contract addresses configured** either through `default_contract_addresses` or blockchain-specific `contract_addresses`. If defaults are not provided, every blockchain must explicitly define all three addresses. Missing contract addresses will cause Clearnode to fail on startup.
:::

## Need Help?

If you have questions about blockchain support requests, encounter issues during integration, or need clarification on any part of this process, please don't hesitate to contact the development team.
