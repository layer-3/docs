---
title: "Treasury"
description: "Secure vault for Foundation assets."
sidebar_position: 6
displayed_sidebar: buildSidebar
---

# Treasury
[Git Source](https://github.com/layer-3/yellow/blob/dcd9928fb0cdf7b35bc4cae06401284b2529d311/src/Treasury.sol)

**Inherits:**
Ownable2Step, ReentrancyGuard

**Title:**
Treasury

Secure vault for Layer-3 Foundation assets.


## State Variables
### name
Human-readable label for this treasury (e.g. "Grants", "Operations").


```solidity
string public name
```


## Functions
### constructor


```solidity
constructor(address initialOwner, string memory name_) Ownable(initialOwner);
```

### transfer

Moves funds out of the treasury.


```solidity
function transfer(address token, address to, uint256 amount) external onlyOwner nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`address`|Use address(0) for ETH, otherwise ERC20 address.|
|`to`|`address`|Destination address.|
|`amount`|`uint256`|Amount to transfer (for ERC20 fee-on-transfer tokens, the event emits the actual amount received by `to`).|


### renounceOwnership

Prevent accidental ownership renouncement which would permanently lock funds.


```solidity
function renounceOwnership() public pure override;
```

### receive


```solidity
receive() external payable;
```

## Events
### Transferred

```solidity
event Transferred(address indexed token, address indexed to, uint256 amount);
```

