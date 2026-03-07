---
title: "Governance"
description: "On-chain parameter administration via YellowGovernor."
sidebar_position: 2
displayed_sidebar: buildSidebar
---

# Protocol Parameter Administration

The Yellow Network's on-chain smart contracts contain configurable parameters — security thresholds, fee levels, blockchain confirmation requirements — that must be updated as the network evolves. Without a parameter administration mechanism, these contracts would require a centralised administrator key, which is a critical single point of failure.

Node operator parameter administration replaces this centralised key with distributed multi-signature execution. Parameter changes require collective agreement from multiple independent operators. This is a protocol security mechanism that removes a centralisation risk from the network's infrastructure.

**Parameter administration is restricted to active node operators** — entities that run clearnode software, maintain collateral above the protocol minimum, and actively process transactions on the network. Holding YELLOW tokens alone does not grant parameter administration participation. A token holder who does not operate network infrastructure has no ability to propose or approve parameter changes, regardless of the quantity of tokens held.

Parameter administration scope is strictly limited to protocol-level service parameters: security thresholds, fee parameters, supported blockchain integrations, confirmation requirements, and protocol upgrade activation. It does not extend to token supply decisions, treasury allocation, or issuer corporate matters, which remain the responsibility of Layer3 Foundation and Layer3 Fintech Ltd.

## How It Works On-Chain

Node operators post YELLOW tokens into the **NodeRegistry** as a mandatory functional security deposit. The NodeRegistry extends OpenZeppelin's `Votes`, which provides the on-chain accounting used to determine whether an operator meets the collateral threshold required to propose parameter changes.

- **Auto-self-delegation** — on first lock, the operator is automatically set up so their collateral is counted immediately
- **Unlock removes participation** — calling `unlock()` zeroes out the operator's participation weight immediately, even before the unlock period elapses
- **Relock restores participation** — cancelling an unlock via `relock()` restores full participation weight
- **Delegation** — operators can delegate their collateral weight to another address via `delegate(address)` for the purpose of parameter administration

## Proposal Lifecycle

```
Propose ──► [delay] ──► Operator Consensus ──► [consensus period] ──► Queue ──► [timelock delay] ──► Execute
```

### States

| State | Value | Description |
|---|---|---|
| Pending | 0 | Proposal created, waiting for delay period |
| Active | 1 | Operator consensus period is open |
| Canceled | 2 | Proposal was canceled |
| Defeated | 3 | Consensus not reached (quorum not met or more Against) |
| Succeeded | 4 | Consensus reached, ready to queue |
| Queued | 5 | In timelock, waiting for delay |
| Expired | 6 | Queued but not executed in time |
| Executed | 7 | Successfully executed |

## Governor Extensions

| Extension | Purpose |
|---|---|
| `GovernorSettings` | Configurable delay, consensus period, and proposal threshold |
| `GovernorCountingSimple` | For / Against / Abstain signalling |
| `GovernorVotes` | Reads collateral weight from the NodeRegistry |
| `GovernorVotesQuorumFraction` | Quorum as percentage of total locked collateral |
| `GovernorTimelockControl` | Routes execution through TimelockController |
| `GovernorPreventLateQuorum` | Extends deadline if quorum reached late |
| `GovernorProposalGuardian` | Foundation emergency cancel |

## Quorum

Quorum is calculated as `max(fractionalQuorum, quorumFloor)`:

- **Fractional quorum** — percentage of total locked collateral (default 4%)
- **Quorum floor** — absolute minimum (default 100M YELLOW) so quorum doesn't collapse if most collateral is withdrawn

The quorum floor is checkpointed and can be updated via parameter administration (`setQuorumFloor`).

## Default Parameters

| Parameter | Default | Description |
|---|---|---|
| Proposal delay | 7,200 blocks (~1 day) | Time before consensus period starts |
| Consensus period | 50,400 blocks (~1 week) | How long operators can signal support |
| Proposal threshold | 10,000,000 YELLOW | Minimum collateral to create a proposal |
| Quorum numerator | 4% | Percentage of locked collateral required |
| Quorum floor | 100,000,000 YELLOW | Absolute minimum quorum |
| Deadline extension | 14,400 blocks (~2 days) | Extended deadline on late quorum |
| Timelock delay | 172,800 seconds (2 days) | Delay before execution |

## Access Control Flow

```
NodeRegistry (collateral weight) ──► YellowGovernor (proposals) ──► TimelockController (delayed execution)
                                                                              │
                                                                   AppRegistry (admin role)
                                                                   Treasury (if owned by timelock)
```

The TimelockController is the actual executor — it holds `DEFAULT_ADMIN_ROLE` on the AppRegistry and can own Treasuries. The Governor is the only proposer/canceller on the timelock. After deployment, the deployer renounces all admin roles, leaving parameter administration fully in the hands of active node operators.

## Common Parameter Administration Actions

| Action | Target | Function |
|---|---|---|
| Transfer ETH from Treasury | Treasury | `transfer(address(0), recipient, amount)` |
| Transfer YELLOW from Treasury | Treasury | `transfer(tokenAddr, recipient, amount)` |
| Grant adjudicator role | AppRegistry | `grantRole(ADJUDICATOR_ROLE, address)` |
| Revoke adjudicator role | AppRegistry | `revokeRole(ADJUDICATOR_ROLE, address)` |
| Set slash cooldown | AppRegistry | `setSlashCooldown(seconds)` |
| Update quorum floor | Governor | `setQuorumFloor(newFloor)` |
| Update parameters | Governor | `setVotingDelay`, `setVotingPeriod`, `setProposalThreshold` |
| Set/remove proposal guardian | Governor | `setProposalGuardian(address)` |
