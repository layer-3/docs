---
title: "FAQ"
description: "Frequently asked questions about Yellow Network smart contracts."
sidebar_position: 7
displayed_sidebar: buildSidebar
---

# Frequently Asked Questions

## General

### What is Yellow Network?

Yellow Network is a decentralised clearing and settlement infrastructure that operates as a Layer-3 overlay on top of existing blockchains. It enables businesses — brokers, exchanges, and application developers — to move digital assets across multiple blockchain networks (Ethereum, Base, Arbitrum, Linea, BNB, and Polygon) through a unified peer-to-peer ledger, without relying on a centralised intermediary. All goods and services are supplied by Layer3 Fintech Ltd.

### What is YELLOW?

YELLOW is the native utility token of the Yellow Network, only intended to provide access to the goods and services supplied by Layer3 Fintech Ltd. — including clearing network access, SDK and developer tools, broker registration, node operation, AppRegistry, and dispute resolution.

### What contracts are involved?

| Contract | Role |
|---|---|
| **YellowToken** | ERC-20 token (fixed 10B supply, no mint/burn) |
| **NodeRegistry** | Node operators post YELLOW as a mandatory functional security deposit |
| **AppRegistry** | App builders post YELLOW as a service quality guarantee, subject to slashing |
| **YellowGovernor** | Protocol parameter administration by active node operators |
| **TimelockController** | Enforces a delay before parameter changes execute |
| **Treasury** | Holds Layer3 Foundation assets (ETH and ERC-20s) |

---

## NodeRegistry (Node Operators)

### How do I register as a node operator?

1. Approve the NodeRegistry to spend your YELLOW tokens.
2. Call `lock(yourAddress, amount)` on the NodeRegistry.

This posts YELLOW as a mandatory functional security deposit required to operate a clearnode on the Yellow Network using Layer3 Fintech Ltd.'s open-source software.

### Can I add more tokens to my security deposit?

Yes. Call `lock(yourAddress, amount)` again while in the **Locked** state. You cannot top up while in the **Unlocking** state.

### Can I delegate my collateral weight?

Yes. Call `delegate(theirAddress)` on the NodeRegistry. This delegates your collateral weight for the purpose of protocol parameter administration. You can change your delegate at any time.

### How do I withdraw my security deposit?

Two-step process:

```
unlock()   →  wait 14 days  →  withdraw(destination)
```

1. Call `unlock()` to start the countdown.
2. After the period elapses, call `withdraw(destination)` to receive your full balance.

Your collateral weight is removed from parameter administration the moment you call `unlock()`.

### Can I cancel an unlock?

Yes. Call `relock()` before withdrawing. Your tokens stay locked and collateral weight is restored.

---

## AppRegistry (App Builders)

### How does it differ from NodeRegistry?

Same lock/unlock/withdraw state machine, but **no parameter administration weight**. AppRegistry is purely for collateral management and slashing. App builders post YELLOW as a service quality guarantee for applications registered on the Yellow Network.

### What is slashing?

If an app builder violates protocol rules, an address with `ADJUDICATOR_ROLE` can call `slash(user, amount, recipient, decision)` to confiscate part or all of their locked collateral. Slashed tokens are transferred to the specified recipient.

### Can I be slashed while unlocking?

Yes. Slashing applies in both **Locked** and **Unlocking** states. If your entire balance is slashed, your state resets to **Idle**.

### What is the slash cooldown?

A global rate-limit on slashing. When set (via parameter administration), only one slash can occur per cooldown window. This prevents a rogue adjudicator from draining all users in a single transaction, giving active node operators time to revoke the role.

---

## Protocol Parameter Administration

### Who can create a parameter change proposal?

Any active node operator with at least **10 million YELLOW** in collateral weight (the default proposal threshold). Holding YELLOW alone does not grant this ability — it requires actively operating clearnode infrastructure.

### What does the proposal lifecycle look like?

```
Propose → Delay (~1 day) → Operator Consensus (~1 week) → Queue → Timelock (~2 days) → Execute
```

### How do operators signal support?

Call `castVote(proposalId, support)` on the Governor:

- `0` = Against
- `1` = For
- `2` = Abstain

### What is quorum?

The minimum collateral weight required for a proposal to be valid. Calculated as `max(4% of total locked collateral, 100M YELLOW)`. The floor prevents proposals from passing with very few participants when total locked collateral is low.

### Can a proposal be cancelled?

- The **proposer** can cancel while the proposal is Pending.
- The **proposal guardian** (Foundation multisig) can cancel any proposal as an emergency brake.

---

## Treasury

### What can the Treasury hold?

ETH and any ERC-20 token.

### How are funds transferred from the Treasury?

Call `transfer(token, to, amount)` where `token` is `address(0)` for ETH or an ERC-20 address.

If the Treasury is owned by the TimelockController, this requires a parameter administration proposal. If owned directly by the Foundation, the owner can call it directly.

---

## Parameters

| Parameter | Default | Changeable via |
|---|---|---|
| Total YELLOW supply | 10,000,000,000 | Fixed (no mint/burn) |
| Proposal threshold | 10,000,000 YELLOW | Parameter administration |
| Proposal delay | ~1 day (7,200 blocks) | Parameter administration |
| Consensus period | ~1 week (50,400 blocks) | Parameter administration |
| Quorum | 4% of locked collateral | Parameter administration |
| Quorum floor | 100,000,000 YELLOW | Parameter administration |
| Deadline extension | ~2 days (14,400 blocks) | Parameter administration |
| NodeRegistry unlock period | 14 days | Immutable (set at deploy) |
| AppRegistry unlock period | 14 days | Immutable (set at deploy) |
| Timelock delay | 2 days | Parameter administration |
| Slash cooldown | 0 (disabled) | Parameter administration |
