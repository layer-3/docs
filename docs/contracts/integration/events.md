---
title: "Events"
description: "Contract events for real-time subscriptions."
sidebar_position: 2
displayed_sidebar: contractsSidebar
---

# Events

Contract events for real-time UI subscriptions. Use `watchContractEvent` (viem) or `contract.on` (ethers) to listen.

## Staking Events

Emitted by both NodeRegistry and AppRegistry (inherited from Locker).

| Event | Parameters | Indexed |
|---|---|---|
| `Locked` | `user` (address), `deposited` (uint256), `newBalance` (uint256) | `user` |
| `Relocked` | `user` (address), `balance` (uint256) | `user` |
| `UnlockInitiated` | `user` (address), `balance` (uint256), `availableAt` (uint256) | `user` |
| `Withdrawn` | `user` (address), `balance` (uint256) | `user` |

## Voting Events

Emitted by NodeRegistry only (inherited from OZ Votes).

| Event | Parameters | Indexed |
|---|---|---|
| `DelegateChanged` | `delegator` (address), `fromDelegate` (address), `toDelegate` (address) | `delegator`, `fromDelegate`, `toDelegate` |
| `DelegateVotesChanged` | `delegate` (address), `previousVotes` (uint256), `newVotes` (uint256) | `delegate` |
| `EIP712DomainChanged` |  | — |

## Slashing Events

Emitted by AppRegistry only.

| Event | Parameters | Indexed |
|---|---|---|
| `RoleAdminChanged` | `role` (bytes32), `previousAdminRole` (bytes32), `newAdminRole` (bytes32) | `role`, `previousAdminRole`, `newAdminRole` |
| `RoleGranted` | `role` (bytes32), `account` (address), `sender` (address) | `role`, `account`, `sender` |
| `RoleRevoked` | `role` (bytes32), `account` (address), `sender` (address) | `role`, `account`, `sender` |
| `SlashCooldownUpdated` | `oldCooldown` (uint256), `newCooldown` (uint256) | — |

## Governance Events

Emitted by YellowGovernor.

| Event | Parameters | Indexed |
|---|---|---|
| `LateQuorumVoteExtensionSet` | `oldVoteExtension` (uint64), `newVoteExtension` (uint64) | — |
| `ProposalCanceled` | `proposalId` (uint256) | — |
| `ProposalCreated` | `proposalId` (uint256), `proposer` (address), `targets` (address[]), `values` (uint256[]), `signatures` (string[]), `calldatas` (bytes[]), `voteStart` (uint256), `voteEnd` (uint256), `description` (string) | — |
| `ProposalExecuted` | `proposalId` (uint256) | — |
| `ProposalExtended` | `proposalId` (uint256), `extendedDeadline` (uint64) | `proposalId` |
| `ProposalGuardianSet` | `oldProposalGuardian` (address), `newProposalGuardian` (address) | — |
| `ProposalQueued` | `proposalId` (uint256), `etaSeconds` (uint256) | — |
| `ProposalThresholdSet` | `oldProposalThreshold` (uint256), `newProposalThreshold` (uint256) | — |
| `QuorumFloorUpdated` | `oldFloor` (uint256), `newFloor` (uint256) | — |
| `QuorumNumeratorUpdated` | `oldQuorumNumerator` (uint256), `newQuorumNumerator` (uint256) | — |
| `TimelockChange` | `oldTimelock` (address), `newTimelock` (address) | — |
| `VoteCast` | `voter` (address), `proposalId` (uint256), `support` (uint8), `weight` (uint256), `reason` (string) | `voter` |
| `VoteCastWithParams` | `voter` (address), `proposalId` (uint256), `support` (uint8), `weight` (uint256), `reason` (string), `params` (bytes) | `voter` |
| `VotingDelaySet` | `oldVotingDelay` (uint256), `newVotingDelay` (uint256) | — |
| `VotingPeriodSet` | `oldVotingPeriod` (uint256), `newVotingPeriod` (uint256) | — |

## Treasury Events

Emitted by Treasury.

| Event | Parameters | Indexed |
|---|---|---|
| `OwnershipTransferStarted` | `previousOwner` (address), `newOwner` (address) | `previousOwner`, `newOwner` |
| `OwnershipTransferred` | `previousOwner` (address), `newOwner` (address) | `previousOwner`, `newOwner` |
| `Transferred` | `token` (address), `to` (address), `amount` (uint256) | `token`, `to` |

## Faucet Events

Emitted by Faucet (Sepolia only).

| Event | Parameters | Indexed |
|---|---|---|
| `CooldownUpdated` | `newCooldown` (uint256) | — |
| `DripAmountUpdated` | `newAmount` (uint256) | — |
| `Dripped` | `recipient` (address), `amount` (uint256) | `recipient` |
| `OwnerUpdated` | `newOwner` (address) | `newOwner` |

## Subscribing with the SDK

```ts
import { NodeRegistryAbi, YellowGovernorAbi, addresses } from "@yellow-org/contracts";

// Watch locks
publicClient.watchContractEvent({
  address: addresses[1].nodeRegistry!,
  abi: NodeRegistryAbi,
  eventName: "Locked",
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(`${log.args.user} locked ${log.args.deposited}`);
    }
  },
});

// Watch proposals
publicClient.watchContractEvent({
  address: addresses[1].governor!,
  abi: YellowGovernorAbi,
  eventName: "ProposalCreated",
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(`New proposal: ${log.args.proposalId}`);
    }
  },
});
```
