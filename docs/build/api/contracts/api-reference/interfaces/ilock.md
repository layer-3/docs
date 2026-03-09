---
title: "ILock"
description: "Lock/unlock/withdraw interface."
sidebar_position: 1
displayed_sidebar: buildSidebar
---

# ILock
[Git Source](https://github.com/layer-3/yellow/blob/dcd9928fb0cdf7b35bc4cae06401284b2529d311/src/interfaces/ILock.sol)

**Title:**
ILock

Single-asset vault with a time-locked withdrawal mechanism.
Users lock tokens, initiate an unlock, and withdraw after the waiting period.
State machine per user:
lock(amount)            unlock()             withdraw()
Idle ─────────────► Locked ─────────────► Unlocking ──────────► Idle
│                      │
lock(amount) adds to balance,    relock()
stays Locked              returns to Locked


## Functions
### asset

The address of the single ERC-20 token this vault accepts.


```solidity
function asset() external view returns (address);
```

### lockStateOf

Returns the current lock state for a user.


```solidity
function lockStateOf(address user) external view returns (LockState);
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
function lock(address target, uint256 amount) external;
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
function withdraw(address destination) external;
```

## Events
### Locked

```solidity
event Locked(address indexed user, uint256 deposited, uint256 newBalance);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The user that locked tokens.|
|`deposited`|`uint256`|The amount of tokens deposited in this call.|
|`newBalance`|`uint256`|The cumulative locked balance after this call.|

### UnlockInitiated

```solidity
event UnlockInitiated(address indexed user, uint256 balance, uint256 availableAt);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The user that initiated unlock.|
|`balance`|`uint256`| The full balance queued for withdrawal.|
|`availableAt`|`uint256`|Timestamp when withdraw() becomes callable.|

### Relocked

```solidity
event Relocked(address indexed user, uint256 balance);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The user that cancelled an unlock and relocked.|
|`balance`|`uint256`|The balance that was relocked.|

### Withdrawn

```solidity
event Withdrawn(address indexed user, address indexed destination, uint256 balance);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The user that withdrew.|
|`destination`|`address`|The address that received the tokens.|
|`balance`|`uint256`|The amount withdrawn.|

## Errors
### InvalidAddress
The address supplied is the zero address.


```solidity
error InvalidAddress();
```

### InvalidAmount
Amount must be greater than zero.


```solidity
error InvalidAmount();
```

### InvalidPeriod
Unlock period must be greater than zero.


```solidity
error InvalidPeriod();
```

### NotLocked
Caller has no locked balance.


```solidity
error NotLocked();
```

### NotUnlocking
unlock() was not called before withdraw(), or waiting period has not elapsed.


```solidity
error NotUnlocking();
```

### AlreadyUnlocking
Caller is already in the Unlocking state.


```solidity
error AlreadyUnlocking();
```

### UnlockPeriodNotElapsed
Waiting period has not elapsed yet.


```solidity
error UnlockPeriodNotElapsed(uint256 availableAt);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`availableAt`|`uint256`|Timestamp when withdraw() becomes callable.|

## Enums
### LockState

```solidity
enum LockState {
    Idle,
    Locked,
    Unlocking
}
```

