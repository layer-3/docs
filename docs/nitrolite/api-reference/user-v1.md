---
title: user.v1
description: Nitrolite v1 user RPC methods sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 6
---

# user.v1

User methods read balances, transaction history, and action allowances. Send requests with the compact envelope described in [Interaction Model](../protocol/interaction-model): `[1, requestId, method, payload, timestamp]`.

## get_balances

Retrieve the balances of the user in YN.

SDK wrapper: `Client.getBalances(wallet)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet` | `string` | required | User wallet address. |

| Response field | Type | Description |
| --- | --- | --- |
| `balances` | `array<balance_entry>` | List of asset balances. |

Errors: `account_not_found`. See [Errors](./errors).

```json
[1, 4001, "user.v1.get_balances", { "wallet": "0xUser" }, 1741344819012]
```

## get_transactions

Retrieve ledger transaction history with optional filtering.

SDK wrapper: `Client.getTransactions(wallet, options)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet` | `string` | required | User wallet address. |
| `asset` | `string` | optional | Filter by asset symbol. |
| `tx_type` | [`transaction_type`](./types#transaction_type) | optional | Filter by transaction type. |
| `pagination` | [`pagination_params`](./types#pagination_params) | optional | Pagination parameters. |
| `from_time` | `integer` | optional | Start timestamp filter. |
| `to_time` | `integer` | optional | End timestamp filter. |

| Response field | Type | Description |
| --- | --- | --- |
| `transactions` | `array<transaction>` | Ledger transactions. |
| `metadata` | [`pagination_metadata`](./types#pagination_metadata) | Pagination information. |

Errors: none declared in `docs/api.yaml`.

```json
[1, 4002, "user.v1.get_transactions", { "wallet": "0xUser", "asset": "usdc", "pagination": { "offset": 0, "limit": 20 } }, 1741344819012]
```

## get_action_allowances

Retrieve action allowances for a user based on their staking level.

SDK wrapper: `Client.getActionAllowances(wallet)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet` | `string` | required | User wallet address. |

| Response field | Type | Description |
| --- | --- | --- |
| `allowances` | `array<action_allowance>` | Action allowances. |

Errors: `wallet_required`, `retrieval_failed`. See [Errors](./errors).

```json
[1, 4003, "user.v1.get_action_allowances", { "wallet": "0xUser" }, 1741344819012]
```
