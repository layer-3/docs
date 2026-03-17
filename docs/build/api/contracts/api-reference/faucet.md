---
title: "Faucet"
description: "Testnet token faucet."
sidebar_position: 7
displayed_sidebar: buildSidebar
---

# Faucet
[Git Source](https://github.com/layer-3/yellow/blob/11ed85c3dabaaddeee431052032791a80eaf2a0e/src/Faucet.sol)

**Title:**
Faucet — YELLOW testnet token faucet

Dispenses a fixed amount of YELLOW per call with a per-address cooldown.


## State Variables
### TOKEN

```solidity
IERC20 public immutable TOKEN
```


### owner

```solidity
address public owner
```


### dripAmount

```solidity
uint256 public dripAmount
```


### cooldown

```solidity
uint256 public cooldown
```


### lastDrip

```solidity
mapping(address => uint256) public lastDrip
```


## Functions
### onlyOwner


```solidity
modifier onlyOwner() ;
```

### _onlyOwner


```solidity
function _onlyOwner() internal view;
```

### constructor


```solidity
constructor(IERC20 _token, uint256 _dripAmount, uint256 _cooldown) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_token`|`IERC20`|     YELLOW token address|
|`_dripAmount`|`uint256`|Amount dispensed per drip (in wei)|
|`_cooldown`|`uint256`|  Seconds between drips per address|


### drip

Drip YELLOW to msg.sender.


```solidity
function drip() external;
```

### dripTo

Drip YELLOW to a specified address (for batch use).


```solidity
function dripTo(address recipient) external;
```

### _dripTo


```solidity
function _dripTo(address recipient) internal;
```

### setDripAmount

Owner can update the drip amount.


```solidity
function setDripAmount(uint256 _dripAmount) external onlyOwner;
```

### setCooldown

Owner can update the cooldown period.


```solidity
function setCooldown(uint256 _cooldown) external onlyOwner;
```

### setOwner

Owner can transfer ownership.


```solidity
function setOwner(address _owner) external onlyOwner;
```

### withdraw

Owner can withdraw remaining tokens.


```solidity
function withdraw(uint256 amount) external onlyOwner;
```

## Events
### Dripped

```solidity
event Dripped(address indexed recipient, uint256 amount);
```

### DripAmountUpdated

```solidity
event DripAmountUpdated(uint256 newAmount);
```

### CooldownUpdated

```solidity
event CooldownUpdated(uint256 newCooldown);
```

### OwnerUpdated

```solidity
event OwnerUpdated(address indexed newOwner);
```

