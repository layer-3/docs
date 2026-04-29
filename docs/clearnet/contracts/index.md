---
title: "Deployed Addresses"
description: "Mainnet and testnet contract addresses for Yellow Network."
sidebar_position: 1
displayed_sidebar: buildSidebar
---


# Deployed Addresses

## Ethereum Mainnet (Chain ID: 1)

| Contract | Address |
|---|---|
| YellowToken | [`0x236eB848C95b231299B4AA9f56c73D6893462720`](https://etherscan.io/address/0x236eB848C95b231299B4AA9f56c73D6893462720) |
| NodeRegistry | [`0xB0C7aA4ca9ffF4A48B184d8425eb5B6Fa772d820`](https://etherscan.io/address/0xB0C7aA4ca9ffF4A48B184d8425eb5B6Fa772d820) |
| AppRegistry | [`0x5A70029B843eE272A2392acE21DA392693eef1c6`](https://etherscan.io/address/0x5A70029B843eE272A2392acE21DA392693eef1c6) |
| YellowGovernor | [`0x7Ce0AE21E11dFEDA2F6e4D8bF2749E4061119512`](https://etherscan.io/address/0x7Ce0AE21E11dFEDA2F6e4D8bF2749E4061119512) |
| TimelockController | [`0x9530896F9622b925c37dF5Cfa271cc9deBB226b7`](https://etherscan.io/address/0x9530896F9622b925c37dF5Cfa271cc9deBB226b7) |
| Treasury | — |
| Faucet | — |

## Sepolia Testnet (Chain ID: 11155111)

| Contract | Address |
|---|---|
| YellowToken | [`0x236eB848C95b231299B4AA9f56c73D6893462720`](https://sepolia.etherscan.io/address/0x236eB848C95b231299B4AA9f56c73D6893462720) |
| NodeRegistry | — |
| AppRegistry | — |
| YellowGovernor | — |
| TimelockController | — |
| Treasury | — |
| Faucet | [`0x914abaDC0e36e03f29e4F1516951125c774dBAc8`](https://sepolia.etherscan.io/address/0x914abaDC0e36e03f29e4F1516951125c774dBAc8) |

## Using in Code

```ts
import { addresses } from "@yellow-org/contracts";

// Mainnet
addresses[1].yellowToken;

// Sepolia
addresses[11155111].faucet;
```
