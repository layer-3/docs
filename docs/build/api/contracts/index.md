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
| NodeRegistry | — |
| AppRegistry | — |
| YellowGovernor | — |
| TimelockController | — |
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
