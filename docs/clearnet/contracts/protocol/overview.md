---
title: "Protocol Overview"
description: "Architecture, contracts, and how they fit together."
sidebar_position: 1
displayed_sidebar: buildSidebar
---

# Protocol Overview

Yellow Network is a decentralised clearing and settlement infrastructure that operates as a Layer-3 overlay on top of existing blockchains. It enables businesses — brokers, exchanges, and application developers — to move digital assets across multiple blockchain networks through a unified peer-to-peer ledger, without relying on a centralised intermediary.

The YELLOW token is only intended to provide access to the goods and services supplied by Layer3 Fintech Ltd. within the Yellow Network. Node operators post YELLOW as a mandatory functional security deposit to operate clearnode infrastructure. App builders post YELLOW as a service quality guarantee on the AppRegistry. The Treasury holds Foundation assets used to fund continued research, development, and delivery of the goods and services accessible through YELLOW.

## Architecture

The Yellow Network operates as a three-layer architecture:

- **Layer 1 (EVM Settlement)** — Smart contracts deployed on each supported chain (Ethereum, Base, Arbitrum, Linea, BNB, and Polygon) provide on-chain asset custody, the NodeRegistry for node operator registration and collateral management, the AppRegistry for application registration, and collateral slashing enforcement.
- **Layer 2 (Ledger Layer — Yellow Clearnet)** — A distributed peer-to-peer ledger that operates off-chain. Independent node operators form a decentralised network where each user account is guarded by a group of nodes using threshold cryptographic signatures. No single node can unilaterally move funds.
- **Layer 3 (Application Layer)** — Applications built on top of the Ledger Layer, including the Yellow App Store, SDK-built applications, and dispute adjudication through independent arbitration forums.

### On-Chain Contract Layout

```
Node operators post YELLOW ──► NodeRegistry (collateral + parameter admin)
                                                                    │
App builders post YELLOW ─────► AppRegistry (collateral + slashing) │
                                                                    │
Foundation ───────────────────► Treasury (Foundation assets)         │
                                                                    │
                     YellowGovernor ──► TimelockController ─────────┘
                     (parameter proposals)  (delayed execution)
```

## Contracts

| Contract | Purpose | Key Interface |
|---|---|---|
| **YellowToken** | ERC-20 utility token, fixed 10B supply, EIP-2612 permit | `IERC20`, `IERC20Permit` |
| **Locker** | Abstract single-asset vault with time-locked withdrawals | `ILock` |
| **NodeRegistry** | Node operator collateral with protocol parameter administration | `ILock`, `IVotes` |
| **AppRegistry** | App builder collateral with adjudicator slashing | `ILock`, `ISlash`, `AccessControl` |
| **YellowGovernor** | Protocol parameter proposals and operator consensus | `IGovernor` |
| **TimelockController** | Delayed execution of parameter changes | OZ `TimelockController` |
| **Treasury** | Foundation vault for ETH and ERC-20 assets | `Ownable2Step` |
| **Faucet** | Testnet token dispenser (Sepolia only) | — |

## Token

- **Fixed supply:** 10,000,000,000 YELLOW (10 billion) — no new tokens can ever be created
- **No mint/burn:** supply is fixed at deployment
- **Permit:** EIP-2612 gasless approvals
- **Utility:** only intended to provide access to Yellow Network services supplied by Layer3 Fintech Ltd.

## Access Control Summary

| Role | Held By | Can Do |
|---|---|---|
| NodeRegistry — no roles | Open | Anyone can lock/unlock |
| AppRegistry `DEFAULT_ADMIN_ROLE` | TimelockController | Grant/revoke adjudicators, set slash cooldown |
| AppRegistry `ADJUDICATOR_ROLE` | Adjudicator address(es) | Slash misbehaving app builders |
| Governor proposer | Any active node operator with sufficient collateral | Create parameter change proposals |
| Governor proposal guardian | Foundation multisig | Cancel any proposal (emergency) |
| TimelockController executor | Open (anyone) | Execute queued proposals after delay |
| Treasury owner | Foundation or TimelockController | Transfer funds out |

## Security Model

- **Value-at-Risk collateral** — the protocol dynamically ensures that total collateral posted by nodes guarding any account exceeds the value of assets held, making fraud economically irrational
- **Timelock delay** — all parameter changes are delayed (default 2 days), giving participants time to respond
- **Quorum floor** — absolute minimum quorum prevents parameter capture when total locked supply is low
- **Late quorum protection** — deadline extends if quorum is reached late, preventing last-second manipulation
- **Proposal guardian** — Foundation can emergency-cancel proposals; removable via parameter administration
- **Slash cooldown** — rate-limits slashing to prevent batch-draining by a rogue adjudicator
- **Unlock period** — 14-day withdrawal delay prevents flash-loan attacks on the collateral system
- **Ownable2Step** — Treasury ownership transfer requires explicit acceptance
