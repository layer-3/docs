---
title: "YellowGovernor"
description: "OpenZeppelin Governor for protocol parameters."
sidebar_position: 5
displayed_sidebar: buildSidebar
---

# YellowGovernor
[Git Source](https://github.com/layer-3/yellow/blob/dcd9928fb0cdf7b35bc4cae06401284b2529d311/src/Governor.sol)

**Inherits:**
Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl, GovernorPreventLateQuorum, GovernorProposalGuardian

**Title:**
YellowGovernor

Protocol parameter administration for the Yellow Network.
Collateral weight is derived from YELLOW tokens posted as security
deposits in the NodeRegistry by active node operators.
Proposals are queued through a TimelockController before execution.
Enforces a minimum quorum floor so quorum never drops below a
meaningful absolute value even if total locked collateral shrinks.
Includes late-quorum protection to prevent last-minute manipulation
of outcomes without giving other operators time to react.
A proposal guardian (Foundation multisig) can cancel any proposal
as an emergency brake; removable via parameter administration.


## State Variables
### _quorumFloorHistory

```solidity
Checkpoints.Trace208 private _quorumFloorHistory
```


## Functions
### constructor


```solidity
constructor(
    IVotes locker_,
    TimelockController timelock_,
    uint48 votingDelay_,
    uint32 votingPeriod_,
    uint256 proposalThreshold_,
    uint256 quorumNumerator_,
    uint256 quorumFloor_,
    uint48 voteExtension_,
    address proposalGuardian_
)
    Governor("YellowGovernor")
    GovernorSettings(votingDelay_, votingPeriod_, proposalThreshold_)
    GovernorVotes(locker_)
    GovernorVotesQuorumFraction(quorumNumerator_)
    GovernorTimelockControl(timelock_)
    GovernorPreventLateQuorum(voteExtension_);
```

### quorumFloor

Returns the current minimum absolute quorum.


```solidity
function quorumFloor() public view returns (uint256);
```

### quorumFloor

Returns the quorum floor at a specific timepoint (snapshotted).


```solidity
function quorumFloor(uint256 timepoint) public view returns (uint256);
```

### setQuorumFloor

Update the quorum floor. Only callable via parameter administration.

Reverts if newFloor exceeds the current total collateral weight supply.


```solidity
function setQuorumFloor(uint256 newFloor) public onlyGovernance;
```

### _updateQuorumFloor


```solidity
function _updateQuorumFloor(uint256 newFloor) internal;
```

### votingDelay


```solidity
function votingDelay() public view override(Governor, GovernorSettings) returns (uint256);
```

### votingPeriod


```solidity
function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256);
```

### proposalThreshold


```solidity
function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256);
```

### quorum


```solidity
function quorum(uint256 blockNumber) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256);
```

### state


```solidity
function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState);
```

### proposalDeadline


```solidity
function proposalDeadline(uint256 proposalId)
    public
    view
    override(Governor, GovernorPreventLateQuorum)
    returns (uint256);
```

### proposalNeedsQueuing


```solidity
function proposalNeedsQueuing(uint256 proposalId)
    public
    view
    override(Governor, GovernorTimelockControl)
    returns (bool);
```

### _queueOperations


```solidity
function _queueOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockControl) returns (uint48);
```

### _executeOperations


```solidity
function _executeOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockControl);
```

### _cancel


```solidity
function _cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockControl) returns (uint256);
```

### _executor


```solidity
function _executor() internal view override(Governor, GovernorTimelockControl) returns (address);
```

### clock


```solidity
function clock() public view override(Governor, GovernorVotes) returns (uint48);
```

### CLOCK_MODE

forge-lint: disable-next-line(mixed-case-function)


```solidity
function CLOCK_MODE() public view override(Governor, GovernorVotes) returns (string memory);
```

### _tallyUpdated


```solidity
function _tallyUpdated(uint256 proposalId) internal override(Governor, GovernorPreventLateQuorum);
```

### _validateCancel


```solidity
function _validateCancel(uint256 proposalId, address caller)
    internal
    view
    override(Governor, GovernorProposalGuardian)
    returns (bool);
```

### _getVotes


```solidity
function _getVotes(address account, uint256 timepoint, bytes memory params)
    internal
    view
    override(Governor, GovernorVotes)
    returns (uint256);
```

## Events
### QuorumFloorUpdated

```solidity
event QuorumFloorUpdated(uint256 oldFloor, uint256 newFloor);
```

## Errors
### QuorumFloorExceedsTotalSupply

```solidity
error QuorumFloorExceedsTotalSupply(uint256 newFloor, uint256 totalSupply);
```

