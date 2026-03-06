---
title: "NodeRegistry"
description: "Node operator registry with voting power."
sidebar_position: 3
displayed_sidebar: buildSidebar
---

# NodeRegistry
[Git Source](https://github.com/layer-3/yellow/blob/f97fcc52ddfdc5918cb91b2af5538abb0060ee27/src/NodeRegistry.sol)

**Inherits:**
[Locker](/src/Locker.sol/abstract.Locker.md), Votes

**Title:**
NodeRegistry

Node operator registry. Operators post YELLOW tokens as a mandatory
functional security deposit to operate clearnode infrastructure.
Extends OZ Votes to provide collateral-weight accounting for
protocol parameter administration by active node operators.
Auto-self-delegates on first lock so collateral weight is immediately active.

Collateral weight units are granted on lock and removed on unlock/relock via hooks.


## Functions
### constructor


```solidity
constructor(address asset_, uint256 unlockPeriod_) Locker(asset_, unlockPeriod_) EIP712(NAME, VERSION);
```

### _afterLock


```solidity
function _afterLock(address target, uint256 amount) internal override;
```

### _afterUnlock


```solidity
function _afterUnlock(address account, uint256 balance) internal override;
```

### _afterRelock


```solidity
function _afterRelock(address account, uint256 balance) internal override;
```

### _getVotingUnits

Returns the locked collateral as weight units for the OZ Votes system.


```solidity
function _getVotingUnits(address account) internal view override returns (uint256);
```

