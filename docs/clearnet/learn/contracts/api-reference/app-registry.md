---
title: "AppRegistry"
description: "App builder registry with slashing."
sidebar_position: 4
displayed_sidebar: clearnetSidebar
---

# AppRegistry
[Git Source](https://github.com/layer-3/yellow/blob/11ed85c3dabaaddeee431052032791a80eaf2a0e/src/AppRegistry.sol)

**Inherits:**
[Locker](/src/Locker.sol/abstract.Locker.md), [ISlash](/src/interfaces/ISlash.sol/interface.ISlash.md), AccessControl

**Title:**
AppRegistry

Registry for app builders who post YELLOW as a service quality guarantee.
Authorised adjudicators can slash a participant's balance as penalty for misbehaviour.

Access control:
- `DEFAULT_ADMIN_ROLE` is held by the TimelockController (parameter administration) and
can grant or revoke `ADJUDICATOR_ROLE` to multiple addresses.
- `ADJUDICATOR_ROLE` holders can call `slash`.
No collateral weight for parameter administration — this registry is purely for
collateral management and slashing. See NodeRegistry for the parameter-administration-enabled
variant used by node operators.
Slashing can occur in both Locked and Unlocking states.
Adjudicators are not economically incentivised by slash outcomes by design.
Dispute initiators pay the adjudicator's handling fee off-chain (similar to
arbitration forums / ODRP). This avoids creating perverse incentives around
decision outcomes.


## State Variables
### ADJUDICATOR_ROLE

```solidity
bytes32 public constant ADJUDICATOR_ROLE = keccak256("ADJUDICATOR_ROLE")
```


### slashCooldown
Minimum time (seconds) that must elapse between consecutive slashes by the same adjudicator.


```solidity
uint256 public slashCooldown
```


### lastSlashTimestamp
Timestamp of the last successful slash per adjudicator.


```solidity
mapping(address => uint256) public lastSlashTimestamp
```


### minSlashAmount
Minimum slash amount. Slashes below this are rejected unless `amount == balance`
(full-balance slash). Prevents zero-amount or dust slashes from resetting the cooldown.


```solidity
uint256 public minSlashAmount
```


## Functions
### constructor


```solidity
constructor(address asset_, uint256 unlockPeriod_, address admin_) Locker(asset_, unlockPeriod_);
```

### setSlashCooldown

Sets the per-adjudicator cooldown between slash calls.


```solidity
function setSlashCooldown(uint256 newCooldown) external onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newCooldown`|`uint256`|The new cooldown in seconds (0 disables the cooldown).|


### setMinSlashAmount

Sets the minimum slash amount.


```solidity
function setMinSlashAmount(uint256 newAmount) external onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newAmount`|`uint256`|The new minimum amount (0 disables the minimum).|


### slash

Reduces a user's locked balance and transfers the slashed tokens
to the specified recipient. Callable only by an authorised adjudicator.


```solidity
function slash(address user, uint256 amount, address recipient, bytes calldata decision)
    external
    onlyRole(ADJUDICATOR_ROLE)
    nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|     The user to slash.|
|`amount`|`uint256`|   The amount of tokens to slash.|
|`recipient`|`address`|The address that receives the slashed tokens (cannot be the caller).|
|`decision`|`bytes`| Off-chain reference to the dispute decision.|


## Events
### SlashCooldownUpdated

```solidity
event SlashCooldownUpdated(uint256 oldCooldown, uint256 newCooldown);
```

### MinSlashAmountUpdated

```solidity
event MinSlashAmountUpdated(uint256 oldAmount, uint256 newAmount);
```

## Errors
### SlashCooldownActive

```solidity
error SlashCooldownActive(uint256 availableAt);
```

