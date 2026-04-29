---
title: "UI Specification"
description: "Frontend implementation guide."
sidebar_position: 3
displayed_sidebar: buildSidebar
---

# UI Specification

Frontend implementation guide for the Yellow Network dApp. All contracts use Solidity 0.8.34 on Ethereum.

## Recommended Stack

- **Wallet connection:** wagmi + viem
- **ABIs & addresses:** `@yellow-org/contracts` SDK
- **React hooks:** `useReadContract`, `useWriteContract`, `useWatchContractEvent`

## Pages

### 1. Token / Wallet

- Display connected address, ETH balance, YELLOW balance
- Network switcher (Mainnet / Sepolia)
- On Sepolia: show Faucet drip button with cooldown timer

**Approval flow:** Before any `lock()`, check `allowance()` and prompt `approve()` (or `permit()` for gasless UX).

### 2. Collateral

Both registries share the same ILock state machine. Use a toggle or tabs for Node Operator / App Builder.

**Idle state:**
- Lock form: amount input + "Post Collateral" button
- Prompt token approval if needed

**Locked state:**
- Show locked balance (security deposit amount)
- "Top Up" button (calls `lock()` again)
- "Unlock" button (starts countdown)
- NodeRegistry: show collateral weight and delegation

**Unlocking state:**
- Locked balance + countdown timer (`unlockTimestamp - now`)
- "Relock" button (cancel unlock)
- "Withdraw" button (disabled until countdown = 0)
- Destination address input (default: connected wallet)

**NodeRegistry-specific:**
- Show "Delegated to: \{address\}" with option to change
- Warning before `unlock()`: "This will remove your collateral weight from parameter administration"
- Display current collateral weight

### 3. Protocol Parameter Administration

**Proposal list:**
- Fetch via `ProposalCreated` events
- Show state badge (Pending/Active/Succeeded/Queued/Executed/Defeated/Canceled)
- For Active proposals: support tallies with progress bars, quorum progress

**Create proposal:**
- Pre-check: user's collateral weight >= proposalThreshold
- Template selector for common actions (treasury transfer, role grant, etc.)
- Custom action builder: target, function, params, value

**Proposal detail:**
- State-dependent action buttons: Signal Support (Active), Queue (Succeeded), Execute (Queued)
- Support buttons: For / Against / Abstain
- Show "Already signalled" if `hasVoted() == true`
- Timelock countdown when Queued

### 4. Treasury (admin)

- Show ETH and YELLOW balances
- If owned by TimelockController: "Create Proposal" shortcut
- If owned directly: transfer form (token, to, amount)

### 5. Adjudicator Panel (admin)

- Slash form: user, amount, recipient, decision
- Cooldown status: time remaining until next slash allowed
- Role check: only show if connected wallet has ADJUDICATOR_ROLE

## State Reads Summary

| Data | Contract | Function |
|---|---|---|
| YELLOW balance | YellowToken | `balanceOf(address)` |
| Lock state | NodeRegistry/AppRegistry | `lockStateOf(address)` |
| Locked amount | NodeRegistry/AppRegistry | `balanceOf(address)` |
| Unlock countdown | NodeRegistry/AppRegistry | `unlockTimestampOf(address)` |
| Collateral weight | NodeRegistry | `getVotes(address)` |
| Delegate | NodeRegistry | `delegates(address)` |
| Proposal state | YellowGovernor | `state(proposalId)` |
| Support tallies | YellowGovernor | `proposalVotes(proposalId)` |
| Quorum needed | YellowGovernor | `quorum(blockNumber)` |
| Has signalled | YellowGovernor | `hasVoted(proposalId, address)` |
| Treasury owner | Treasury | `owner()` |
| Slash cooldown | AppRegistry | `slashCooldown()`, `lastSlashTimestamp()` |
