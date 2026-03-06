---
title: "Slashing"
description: "Adjudicator slashing and cooldown mechanism."
sidebar_position: 4
displayed_sidebar: contractsSidebar
---

# Slashing

The AppRegistry allows authorized adjudicators to slash misbehaving app builders' locked collateral. Slashing transfers tokens from the user's balance to a specified recipient. This mechanism enforces service quality guarantees for applications registered on the Yellow Network.

## How It Works

1. An address with `ADJUDICATOR_ROLE` calls `slash(user, amount, recipient, decision)`
2. The user's locked balance is reduced by `amount`
3. `amount` tokens are transferred to `recipient`
4. If the full balance is slashed, the user's state resets to Idle

## Slash Function

```solidity
function slash(
    address user,       // The user to slash
    uint256 amount,     // Amount to slash
    address recipient,  // Where slashed tokens go (cannot be the adjudicator)
    bytes decision      // Off-chain reference to the dispute decision
) external onlyRole(ADJUDICATOR_ROLE) nonReentrant;
```

### Rules

- Only callable by addresses with `ADJUDICATOR_ROLE`
- `recipient` cannot be the calling adjudicator (prevents self-enrichment)
- Slashing works in both **Locked** and **Unlocking** states
- Full slash (entire balance) resets the user to Idle
- Partial slash preserves the current state (Locked stays Locked, Unlocking stays Unlocking)

## Slash Cooldown

A global cooldown can be set to rate-limit slashing. This prevents a rogue adjudicator from batch-draining all users in a single transaction.

```solidity
function setSlashCooldown(uint256 newCooldown) external onlyRole(DEFAULT_ADMIN_ROLE);
```

- **Default:** 0 (disabled)
- When set, only one slash can occur per cooldown window globally
- The first slash after deployment (or after cooldown is enabled) is always allowed
- `setSlashCooldown(0)` disables the cooldown

### The Attack It Prevents

Without cooldown, a rogue adjudicator can:

```
slash(userA, ...) + slash(userB, ...) + slash(userC, ...)  // all in one tx
```

This drains every user before the admin can revoke the role.

With cooldown (e.g. 1 hour), only one slash per hour is possible, giving active node operators time to revoke the rogue adjudicator through parameter administration.

## Role Management

| Role | Held By | Purpose |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | TimelockController (parameter administration) | Grant/revoke adjudicators, set cooldown |
| `ADJUDICATOR_ROLE` | Authorized adjudicator(s) | Call `slash()` |

Roles are managed via parameter administration proposals that execute through the TimelockController:

- **Grant:** `appRegistry.grantRole(ADJUDICATOR_ROLE, newAdjudicator)`
- **Revoke:** `appRegistry.revokeRole(ADJUDICATOR_ROLE, rogueAdjudicator)`
- **Set cooldown:** `appRegistry.setSlashCooldown(3600)` (1 hour)

## Events

| Event | Parameters | When |
|---|---|---|
| `Slashed` | `user`, `amount`, `recipient`, `decision` | User was slashed |
| `SlashCooldownUpdated` | `oldCooldown`, `newCooldown` | Cooldown changed |
| `RoleGranted` | `role`, `account`, `sender` | Adjudicator added |
| `RoleRevoked` | `role`, `account`, `sender` | Adjudicator removed |
