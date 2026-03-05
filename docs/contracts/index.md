---
title: "Smart Contracts"
description: "Overview of Yellow Network smart contracts, governance, and on-chain infrastructure."
sidebar_position: 1
displayed_sidebar: contractsSidebar
---

# What Is Yellow Network?

A plain-language guide to Yellow Network, the YELLOW token, and how the system works.

---

## The Problem

Today's crypto ecosystem is fragmented. Assets live on dozens of separate blockchains — Ethereum, Arbitrum, Base, Polygon, BNB Chain, Linea, and more. If you want to move value between them, you typically rely on bridges (slow, often hacked) or centralised exchanges (single points of failure). Developers building apps face the same issue: they have to pick one chain and lose access to users and liquidity on every other chain.

There is no shared infrastructure that lets brokers, exchanges, and applications transact across all of these networks in real time — the way internet service providers share a common routing layer to move data.

## The Solution

Yellow Network is that shared infrastructure. It is a **clearing and settlement layer** that sits on top of existing blockchains (a "Layer 3") and lets participants move digital assets across multiple chains through a single, unified system — without trusting a central intermediary.

Think of it like the interbank clearing system (SWIFT, ACH) but for crypto: independent operators run the network, transactions clear in sub-second time off-chain, and final settlement is anchored to the security of public blockchains.

All of the software, tools, and services that make up Yellow Network are developed, maintained, and supplied by **Layer3 Fintech Ltd.**

---

## How It Works — The Three Layers

Yellow Network has a three-layer architecture. Each layer has a distinct role:

### Layer 1 — The Blockchain Foundation

This is the base: public blockchains like Ethereum, Base, Arbitrum, Linea, BNB Chain, and Polygon. Yellow deploys smart contracts on each of these chains to handle:

- **Asset custody** — when you deposit assets into Yellow Network, they are held in audited smart contracts on the blockchain, not by a company or individual.
- **Node registration** — node operators register on-chain by posting YELLOW tokens as a security deposit.
- **Dispute enforcement** — if someone cheats, the blockchain is the final court. Fraud proofs are submitted on-chain, and the cheater's collateral is automatically seized.

You can think of Layer 1 as the vault and the judge — it holds the real assets and enforces the rules.

### Layer 2 — The Clearnet (Off-Chain Ledger)

This is where the speed comes from. Instead of recording every transaction on a blockchain (which is slow and expensive), Yellow Network runs an off-chain peer-to-peer ledger called the **Yellow Clearnet**.

Here's how it works:

1. **Independent node operators** run open-source software (called a "clearnode") on their own servers. There is no central server — the network is formed by these independent operators.

2. **Every user account is guarded by a group of nodes**, not a single one. These nodes are selected algorithmically based on proximity in a shared address space (using a system called Kademlia, the same technology behind BitTorrent). The group collectively manages the account using **threshold cryptography** — meaning a supermajority of the group must agree before any balance can change. No single node can steal funds.

3. **Security scales with value.** A small account might be guarded by 3 nodes. A high-value account could be guarded by up to 256. The protocol automatically ensures that the total collateral posted by the nodes guarding an account always exceeds the value in that account — so cheating always costs more than it gains.

4. **A separate ring of watcher nodes** independently verifies every transaction. If the primary group tries to process a fraudulent transaction, the watchers catch it, produce a cryptographic fraud proof, and submit it to the blockchain. The cheating nodes lose their collateral automatically.

The result: transactions clear in sub-second time (compared to minutes or hours on-chain), while retaining the security guarantees of the underlying blockchains.

### Layer 3 — Applications

On top of the Clearnet, developers build applications using the **Yellow SDK**. This is the user-facing layer:

- **Yellow App Store** — a registry of applications built on the network.
- **Developer tools** — the SDK abstracts away the complexity of state channels, multi-chain settlement, and cryptographic signing. A developer can build an app that works across six blockchains without dealing with any of that directly.
- **Dispute resolution** — if there is a disagreement between a user and an application, independent arbitration forums can adjudicate the dispute, with outcomes enforced on-chain.

---

## What Actually Happens When You Use It

Here is a concrete example of a cross-chain transfer:

1. **Alice** has 100 USDC on Ethereum deposited into Yellow Network.
2. She wants to send 50 USDC to **Bob**, who uses Base.
3. Alice's node cluster debits her account and produces a signed certificate.
4. The certificate is routed through the peer-to-peer network to Bob's node cluster.
5. Bob's cluster verifies the certificate and credits Bob's account.
6. Bob can now withdraw 50 USDC on Base (or any other supported chain).

This entire process takes less than a second. No bridge. No centralised exchange. No on-chain gas fees for the transfer itself. The blockchains are only used for deposits, withdrawals, and dispute resolution.

---

## The YELLOW Token

YELLOW is the utility token that provides access to the goods and services supplied by Layer3 Fintech Ltd. within the Yellow Network. It has three specific functions:

### 1. Mandatory Security Deposit for Node Operators

Every node operator must post YELLOW tokens as collateral to register on the network. This is not optional — it is the mechanism that makes the network secure.

- **Prevents spam attacks** — you cannot cheaply flood the network with malicious nodes because each one requires real collateral.
- **Deters fraud** — if a node participates in a fraudulent transaction, its collateral is automatically seized ("slashed") through on-chain fraud proofs.
- **Scales with responsibility** — as a node guards higher-value accounts, the protocol requires more collateral at risk.

The minimum collateral starts at 10,000 YELLOW and scales up to 125,000 YELLOW as the network grows.

### 2. Service Access Fee

All network services — clearing, settlement, data delivery, app subscriptions — require the consumption of YELLOW as a service access fee. Users who hold YELLOW pay fees directly at a discounted rate. For users who do not yet hold YELLOW, an optional convenience mechanism allows payment in other assets (like ETH or USDT); independent third-party liquidity providers convert the payment into YELLOW before the protocol consumes it.

Protocol fees from clearing and trading operations are locked into the collateral of the nodes that processed them — increasing those operators' slashing exposure. This strengthens network security over time. There is no fee distribution to passive token holders.

### 3. Dispute Resolution Access

App builders who register applications on the network post YELLOW as a service quality guarantee. Users who have disputes with an application pay a processing fee in YELLOW to access independent arbitration. If the dispute is upheld, the app builder's collateral can be slashed.

### What YELLOW Is Not

- It does not represent ownership in Layer3 Fintech Ltd. or any affiliated entity.
- It does not entitle holders to dividends, profit-sharing, or any form of financial return.
- It is not designed to maintain a stable value — there is no peg, no reserve backing, and no stabilisation mechanism.
- Holding YELLOW alone does not grant participation in protocol parameter administration — that requires actively operating a node.

The total supply is fixed at **10 billion YELLOW**. No new tokens can ever be created, and there is no burn mechanism.

---

## Who Runs the Network?

Yellow Network is operated by **independent node operators** who run the open-source clearnode software on their own infrastructure. Layer3 Fintech Ltd. develops and maintains the software — but it does not operate the network itself. This is similar to how a software company distributes server software that thousands of independent hosting providers run on their own hardware.

The protocol's on-chain smart contracts contain configurable parameters (security thresholds, fee levels, supported chains) that need to be updated as the network evolves. These parameters are administered by active node operators through a distributed multi-signature process — replacing what would otherwise be a single administrator key (a security risk). This parameter administration is an operational duty of running a node, not a right that comes with holding the token.

---

## Key Numbers

| Metric | Value |
|---|---|
| Total YELLOW supply | 10,000,000,000 (fixed) |
| Supported blockchains | Ethereum, Base, Arbitrum, Linea, BNB Chain, Polygon |
| Minimum node collateral | 10,000 YELLOW (scales to 125,000) |
| Max nodes per account | 256 |
| Min nodes per account | 3 |
| Collateral unlock period | 14 days |
| Transaction speed | Sub-second (off-chain clearing) |
| Fee range | 0.1% — 0.4% (dynamic) |

## Token Allocation

| Allocation | Percentage | Purpose |
|---|---|---|
| Founders | 10% | Subject to 6-month cliff and 60-month linear vesting |
| Token Sales | 12.5% | Distributed to participants who require YELLOW for service access |
| Community Treasury | 30% | Grants for app builders who consume YELLOW for services |
| Foundation Treasury | 20% | Funds ongoing R&D and delivery of Yellow Network services |
| Network Growth Incentives | 25% | Distributed automatically based on network scale |
| Ecosystem Accessibility Reserve | 2.5% | Ensures YELLOW remains accessible for its intended utility |

The Foundation controls 50% of total supply (Community Treasury + Foundation Treasury), subject to linear vesting with quarterly reporting on all movements.

---

## Security and Audits

Yellow Network's smart contracts have been independently audited:

- **Hacken (2024)** — Security assessment of the Ethereum smart contracts. No critical issues found. [Full report](https://hacken.io/audits/openware-yellow-network/sca-yellow-network-vault-sept-2024/)
- **GuardianAudits (ongoing)** — Auditing the decentralised ledger (Yellow Clearnet). [Reports](https://github.com/GuardianAudits/Audits/tree/main/Yellow%20Network/)

The core state channel technology builds on academic research from statechannels.org and the VirtualApp framework, developed in collaboration with Consensys and other open-source contributors.

---

## Where to Learn More

- **Website:** [yellow.org](https://yellow.org/)
- **Developer docs:** [docs.yellow.org](https://docs.yellow.org/)
- **Protocol source code:** [github.com/layer-3/clearnet](https://github.com/layer-3/clearnet)
- **Documentation source:** [github.com/layer-3/docs](https://github.com/layer-3/docs)

---

## Legal Entity

Yellow Network's goods and services are supplied by **Layer3 Fintech Ltd.**, a company registered in the British Virgin Islands (Registration: 2092094), with its parent entity **Layer3 Foundation** based in the Cayman Islands. The sole director is Paul Parker. The applicable law and competent court for the token offering is Ireland.

YELLOW is classified as a **utility token** under EU Regulation 2023/1114 (MiCA), Article 3(1)(9) — a token that is only intended to provide access to a good or a service supplied by its issuer. It is not a financial instrument, not an asset-referenced token, not an e-money token, and not a security.
