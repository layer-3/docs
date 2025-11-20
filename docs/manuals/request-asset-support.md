---
title: Requesting Asset Support
description: Guide for requesting asset and token support in Clearnode Sandbox or Production environments
sidebar_label: Request Asset Support
keywords: [clearnode, asset, token, configuration, ERC20, production, sandbox]
---

# Requesting Asset Support

This guide is primarily for **project teams, token issuers, and integration partners** who need to add support for new assets or tokens in the Clearnode infrastructure. Following this process will enable Clearnode to recognize and process transfers of your asset across supported blockchain networks.

## What Happens When Support is Added

Once an asset is supported in Clearnode:

- Users can deposit and withdraw the asset through Clearnode's state channels
- The asset becomes available for instant, off-chain transfers via the Nitrolite protocol
- The asset can be used in cross-chain operations (deposit on one chain, withdraw on another) for blockchains it was configured on
- Applications built on Yellow Network can integrate the asset for payments and settlements
- The asset's unified balance is tracked across all supported blockchains

:::info ERC20 Compatibility
Adding support for ERC20 tokens is straightforward and requires only configuration changes. Non-standard token implementations may require additional development work and testing.
:::

:::warning Liquidity Requirements for Withdrawals
For a token to be immediately withdrawable on a specific blockchain, Clearnode must be provided with sufficient liquidity on that chain. Without liquidity, users can deposit tokens but cannot withdraw them until liquidity is available. Please contact our Business team to arrange liquidity provision before requesting asset support.
:::

## Understanding Environments

Clearnode operates in two distinct environments with separate asset configurations:

| Environment | Purpose | Typical Assets |
|-------------|---------|----------------|
| **Sandbox** | Development, testing, and experimentation | Testnet tokens (Sepolia USDC, Amoy ETH, test tokens, etc.) |
| **Production** | Live operations with real assets | Mainnet tokens (USDC, USDT, DAI, etc.) |

**Configuration file location:** `clearnode/chart/config/<sandbox_or_prod>/assets.yaml`

**Important Considerations:**

- **Production will not support test network tokens** - mainnet tokens only
- **Sandbox will not support mainnet tokens** - testnet tokens only
- You must decide which environment needs the asset support based on your use case
- If you need support in both environments (e.g., testnet token for development, mainnet token for production), you must submit configuration changes to both files

## How to Request Support

Asset support is requested by creating or modifying a configuration file in the [nitrolite](https://github.com/erc7824/nitrolite) repository:

1. **Fork the repository**: `https://github.com/erc7824/nitrolite`
2. **Navigate to the appropriate configuration file**:
   - For Sandbox: `clearnode/chart/config/sandbox/assets.yaml`
   - For Production: `clearnode/chart/config/prod/assets.yaml`
3. **Add your asset configuration** at the end of the list (see next section for structure)
4. **Submit a Pull Request** with a clear description of the asset being added
5. **Wait for review** by the development team

The next section provides detailed guidance on the configuration structure and whether you need to add a new asset or just a token.

## Asset Configuration Structure

### Understanding Assets vs Tokens

In Clearnode's configuration model:

- An **asset** represents a logical currency or token type (e.g., "USDC", "ETH")
- A **token** is a specific implementation of that asset on a particular blockchain

**Example:** USDC is an asset that has different token implementations:

- USDC on Polygon at address `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
- USDC on Base at address `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDC on Ethereum at address `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`

### Before You Start: Check if the Asset Exists

Before adding a new asset, check if Clearnode already supports the asset on other blockchains. If the asset exists but your target blockchain is not listed, you only need to add a **token entry** to the existing asset. If the asset doesn't exist at all, you need to add both the **asset** and its **token(s)**.

#### Scenario 1: Asset exists, add a token to a new blockchain

```yaml
assets:
  - name: "USD Coin"
    symbol: "usdc"
    tokens:
      - blockchain_id: 137
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
        decimals: 6
      # Add your new token here
      - blockchain_id: 8453  # Base
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        decimals: 6
```

#### Scenario 2: New asset, add both asset and token(s)

```yaml
assets:
  - name: "My New Token"
    symbol: "mnt"
    tokens:
      - blockchain_id: 137
        address: "0xYourTokenAddressOnPolygon"
        decimals: 18
```

### Configuration Fields

#### Asset Level

Each asset entry requires the following fields:

```yaml
assets:
  - name: "USD Coin"    # Human-readable name
    symbol: "usdc"      # Ticker symbol (lowercase)
    disabled: false     # If set to `true`, then it is not loaded into configuration
    tokens: [...]       # Array of token implementations
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Human-readable name of the asset (e.g., "USD Coin"). If omitted, defaults to the symbol. |
| `symbol` | **Yes** | Ticker symbol for the asset (must be lowercase, e.g., "usdc", "eth") |
| `disabled` | No | Set to `true` to temporarily disable processing this asset (default: `false`) |
| `tokens` | **Yes** | Array of blockchain-specific token implementations |

#### Token Level

Each token within an asset requires the following fields:

```yaml
tokens:
  - name: "USD Coin on Polygon"      # Token-specific name
    symbol: "usdc"                   # Token-specific symbol
    blockchain_id: 137               # Chain ID
    disabled: false                  # Skip processing (default: false)
    address: "0x3c499c542cEF..."     # Contract address
    decimals: 6                      # Token decimals
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Token name on this blockchain (inherits from asset if not specified) |
| `symbol` | No | Token symbol on this blockchain (inherits from asset if not specified) |
| `blockchain_id` | **Yes** | Chain ID where this token is deployed (must match a supported blockchain) |
| `disabled` | No | Set to `true` to temporarily disable this token (default: `false`) |
| `address` | **Yes** | Token's smart contract address (must be a valid address on the specified chain) |
| `decimals` | **Yes** | Number of decimal places the token uses (e.g., 6 for USDC, 18 for ETH) |

### Prerequisites for Adding Assets

Before submitting your configuration:

1. **Blockchain Support**: Ensure the blockchain (by `blockchain_id`) is already supported in `blockchains.yaml`
2. **Token Deployment**: The token contract must be deployed and verified on the target blockchain
3. **ERC20 Compliance**: Token should follow the standard ERC20 interface for seamless integration
4. **Correct Decimals**: Verify the token's decimal places (commonly 6 or 18, but varies by token)
5. **Valid Address**: Double-check the contract address is correct and matches the intended blockchain

:::warning Blockchain Must Be Supported First
You cannot add a token on a blockchain that is not yet supported in Clearnode. If your target blockchain is not in the `blockchains.yaml` configuration, you must first follow the [Request Blockchain Support](./request-blockchain-support.md) guide before requesting asset support.
:::

## Need Help?

If you have questions about asset support requests, encounter issues during configuration, or need clarification on any part of this process, please don't hesitate to contact the development team.
