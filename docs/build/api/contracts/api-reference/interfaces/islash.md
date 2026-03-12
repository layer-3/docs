---
title: "ISlash"
description: "Slashing interface."
sidebar_position: 2
displayed_sidebar: buildSidebar
---

# ISlash
[Git Source](https://github.com/layer-3/yellow/blob/11ed85c3dabaaddeee431052032791a80eaf2a0e/src/interfaces/ISlash.sol)

**Title:**
ISlash

Slashing interface for registries whose participants can be penalised
by an authorised adjudicator.


## Functions
### slash

Reduces a user's locked balance and transfers the slashed tokens
to the specified recipient. Callable only by an authorised adjudicator.


```solidity
function slash(address user, uint256 amount, address recipient, bytes calldata decision) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|     The user to slash.|
|`amount`|`uint256`|   The amount of tokens to slash.|
|`recipient`|`address`|The address that receives the slashed tokens (cannot be the caller).|
|`decision`|`bytes`| Off-chain reference to the dispute decision.|


## Events
### Slashed

```solidity
event Slashed(address indexed user, uint256 amount, address indexed recipient, bytes decision);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|     The user whose balance was slashed.|
|`amount`|`uint256`|   The amount of tokens slashed.|
|`recipient`|`address`|The address that received the slashed tokens.|
|`decision`|`bytes`| Off-chain reference to the dispute decision.|

## Errors
### InsufficientBalance
The user does not have enough balance to cover the slash.


```solidity
error InsufficientBalance();
```

### RecipientIsAdjudicator
The recipient cannot be the adjudicator calling slash.


```solidity
error RecipientIsAdjudicator();
```

### RecipientIsUser
The recipient cannot be the slashed user.


```solidity
error RecipientIsUser();
```

### SlashAmountTooLow
The slash amount is below the minimum and does not equal the full balance.


```solidity
error SlashAmountTooLow();
```

