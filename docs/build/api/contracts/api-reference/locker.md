---
title: "Locker"
description: "Abstract lock/unlock/withdraw state machine."
sidebar_position: 2
displayed_sidebar: buildSidebar
---

# Locker
[Git Source](https://github.com/layer-3/yellow/blob/dcd9928fb0cdf7b35bc4cae06401284b2529d311/src/Locker.sol)

**Inherits:**
[ILock](/src/interfaces/ILock.sol/interface.ILock.md), ReentrancyGuard

**Title:**
Locker

Abstract single-asset vault with a time-locked withdrawal mechanism.
Subcontracts define the unlock period and may add parameter administration or slashing logic.

ASSET is immutably set to YellowToken, a standard ERC-20 with a fixed supply
and no mint, burn, fee-on-transfer, or rebasing mechanics.
Workflow:
1. lock(amount)  — deposit tokens; can top-up while in Locked state.
2. unlock()      — start the countdown.
3. withdraw()    — after the period elapses, receive the full balance.


## State Variables
### ASSET

```solidity
address public immutable ASSET
```


### UNLOCK_PERIOD

```solidity
uint256 public immutable UNLOCK_PERIOD
```


### _balances

```solidity
mapping(address user => uint256 balance) internal _balances
```


### _unlockTimestamps

```solidity
mapping(address user => uint256 unlockTimestamp) internal _unlockTimestamps
```


## Functions
### constructor


```solidity
constructor(address asset_, uint256 unlockPeriod_) ;
```

### asset

The address of the single ERC-20 token this vault accepts.


```solidity
function asset() external view returns (address);
```

### lockStateOf

Returns the current lock state for a user.


```solidity
function lockStateOf(address user) public view returns (LockState);
```

### balanceOf

Returns the locked balance for a user.


```solidity
function balanceOf(address user) external view returns (uint256);
```

### unlockTimestampOf

Returns the timestamp when withdraw() becomes callable (0 if not unlocking).


```solidity
function unlockTimestampOf(address user) external view returns (uint256);
```

### lock

Transfers `amount` tokens from the caller into the vault, crediting `target`.
Can be called multiple times to add to an existing Locked balance.
Reverts with AlreadyUnlocking if `target` is in the Unlocking state.


```solidity
function lock(address target, uint256 amount) external nonReentrant;
```

### unlock

Starts the waiting period for the caller's full balance.
Reverts with NotLocked if the caller has no balance.
Reverts with AlreadyUnlocking if unlock() was already called.


```solidity
function unlock() external;
```

### relock

Cancels an in-progress unlock and returns to Locked state.
Restores collateral weight. Reverts with NotUnlocking if not unlocking.


```solidity
function relock() external;
```

### withdraw

Transfers the caller's full balance to `destination`.
Reverts with NotUnlocking if unlock() was not called.
Reverts with UnlockPeriodNotElapsed if the waiting period has not elapsed.


```solidity
function withdraw(address destination) external nonReentrant;
```

### _afterLock

Hook called after tokens are locked. Override to add custom logic (e.g. collateral weight).


```solidity
function _afterLock(address target, uint256 amount) internal virtual;
```

### _afterUnlock

Hook called after unlock is initiated. Override to add custom logic.


```solidity
function _afterUnlock(address account, uint256 balance) internal virtual;
```

### _afterRelock

Hook called after relock. Override to add custom logic.


```solidity
function _afterRelock(address account, uint256 balance) internal virtual;
```

