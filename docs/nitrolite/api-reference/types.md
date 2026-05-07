---
title: Types
description: Shared Nitrolite v1 RPC types sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 2
---

# Types

These field tables mirror the `types:` section of `docs/api.yaml`. Optional fields are marked in the presence column.

## channel

Represents an on-chain channel.

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `channel_id` | `string` | required | Unique identifier for the channel. |
| `user_wallet` | `string` | required | User wallet address. |
| `type` | `string` | required | Type of the channel: `home` or `escrow`. |
| `blockchain_id` | `string` | required | Unique identifier for the blockchain. |
| `token_address` | `string` | required | Address of the token used in the channel. |
| `challenge_duration` | `integer` | required | Challenge period for the channel in seconds. |
| `challenge_expires_at` | `string` | optional | Challenge expiration timestamp in Unix seconds. |
| `nonce` | `string` | required | Nonce for the channel. |
| `status` | `string` | required | Current status: `void`, `open`, `challenged`, or `closed`. |
| `state_version` | `string` | required | On-chain state version of the channel. |

## transition_type

Type of state transition. Values: `transfer_receive`, `transfer_send`, `release`, `commit`, `home_deposit`, `home_withdrawal`, `mutual_lock`, `escrow_deposit`, `escrow_lock`, `escrow_withdraw`, `migrate`, `finalize`.

## transition

Represents a state transition.

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `type` | `transition_type` | required | Type of state transition. |
| `tx_id` | `string` | required | Transaction ID associated with the transition. |
| `account_id` | `string` | required | Account identifier, varying by transition type. |
| `amount` | `string` | required | Amount involved in the transition. |

## state

Represents the current state of the user stored on Node.

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Deterministic ID hash of the state. |
| `transition` | `transition` | required | State transition that led to this state. |
| `asset` | `string` | required | Asset type of the state. |
| `user_wallet` | `string` | required | User wallet address. |
| `epoch` | `string` | required | User epoch index. |
| `version` | `string` | required | Version of the state. |
| `home_channel_id` | `string` | optional | Identifier for the home channel. |
| `escrow_channel_id` | `string` | optional | Identifier for the escrow channel. |
| `home_ledger` | `ledger` | required | User and node balances for the home channel. |
| `escrow_ledger` | `ledger` | optional | User and node balances for the escrow channel. |
| `user_sig` | `string` | optional | User signature for the state. |
| `node_sig` | `string` | optional | Node signature for the state. |

## ledger

Represents ledger balances.

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `token_address` | `string` | required | Address of the token used in this channel. |
| `blockchain_id` | `string` | required | Unique identifier for the blockchain. |
| `user_balance` | `string` | required | User balance in the channel. |
| `user_net_flow` | `string` | required | User net flow in the channel. |
| `node_balance` | `string` | required | Node balance in the channel. |
| `node_net_flow` | `string` | required | Node net flow in the channel. |

## channel_definition

Configuration for creating a channel.

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `nonce` | `string` | required | Unique number to prevent replay attacks. |
| `challenge` | `integer` | required | Challenge period for the channel in seconds. |

## app_participant

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet_address` | `string` | required | Participant wallet address. |
| `signature_weight` | `integer` | required | Signature weight for the participant. |

## app_definition

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `application_id` | `string` | required | Application identifier from an app registry. |
| `participants` | `array<app_participant>` | required | List of participants in the app session. |
| `quorum` | `integer` | required | Quorum required for the app session. |
| `nonce` | `string` | required | Unique number to prevent replay attacks. |

## app_allocation

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `participant` | `string` | required | Participant wallet address. |
| `asset` | `string` | required | Asset symbol. |
| `amount` | `string` | required | Amount allocated to the participant. |

## app_state_update

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_session_id` | `string` | required | Unique application session identifier. |
| `intent` | `string` | required | Update intent: `operate`, `deposit`, `withdraw`, `close`, or `rebalance`. |
| `version` | `string` | required | Version of the app state. |
| `allocations` | `array<app_allocation>` | required | Allocations in the app state. |
| `session_data` | `string` | required | JSON stringified session data. |

## signed_app_state_update

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_state_update` | `app_state_update` | required | Application session state update. |
| `quorum_sigs` | `array<string>` | required | Signature quorum for the application session. |

## token

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Token name. |
| `symbol` | `string` | required | Token symbol. |
| `address` | `string` | required | Token contract address. |
| `blockchain_id` | `string` | required | Blockchain network ID. |
| `decimals` | `integer` | required | Number of decimal places. |

## asset

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Asset name. |
| `symbol` | `string` | required | Asset symbol. |
| `decimals` | `integer` | required | Asset decimal places. |
| `suggested_blockchain_id` | `string` | required | Suggested blockchain network ID for this asset. |
| `tokens` | `array<token>` | required | Supported tokens for the asset. |

## blockchain_info

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Blockchain name. |
| `blockchain_id` | `string` | required | Blockchain network ID. |
| `contract_address` | `string` | required | Main contract address on this blockchain. |

## balance_entry

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `asset` | `string` | required | Asset symbol. |
| `amount` | `string` | required | Balance amount. |
| `enforced` | `string` | required | On-chain enforced balance. |

## transaction_type

Type of transaction. Values: `transfer`, `release`, `commit`, `home_deposit`, `home_withdrawal`, `mutual_lock`, `escrow_deposit`, `escrow_lock`, `escrow_withdraw`, `migrate`, `rebalance`, `finalize`.

## transaction

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Unique transaction reference. |
| `asset` | `string` | required | Asset symbol. |
| `tx_type` | `transaction_type` | required | Transaction type. |
| `from_account` | `string` | required | Account that sent the funds. |
| `to_account` | `string` | required | Account that received the funds. |
| `sender_new_state_id` | `string` | optional | ID of the sender's new channel state. |
| `receiver_new_state_id` | `string` | optional | ID of the receiver's new channel state. |
| `amount` | `string` | required | Transaction amount. |
| `created_at` | `string` | required | Creation timestamp. |

## app_session_info

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_session_id` | `string` | required | Unique application session identifier. |
| `status` | `string` | required | Session status: `open` or `closed`. |
| `app_definition` | `app_definition` | required | Application definition for this session. |
| `session_data` | `string` | optional | JSON stringified session data. |
| `version` | `string` | required | Current version of the session state. |
| `allocations` | `array<app_allocation>` | required | Allocations in the app state. |

## channel_session_key_state

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `user_address` | `string` | required | User wallet address. |
| `session_key` | `string` | required | Session key address for delegation. |
| `version` | `string` | required | Session key format version. |
| `assets` | `array<string>` | required | Assets associated with this session key. |
| `expires_at` | `string` | required | Unix timestamp in seconds when the key expires. |
| `user_sig` | `string` | required | User signature authorizing the registration or update. |

## app_session_key_state

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `user_address` | `string` | required | User wallet address. |
| `session_key` | `string` | required | Session key address for delegation. |
| `version` | `string` | required | Session key format version. |
| `application_id` | `array<string>` | required | Application IDs associated with this session key. |
| `app_session_id` | `array<string>` | required | App-session IDs associated with this session key. |
| `expires_at` | `string` | required | Unix timestamp in seconds when the key expires. |
| `user_sig` | `string` | required | User signature authorizing the registration or update. |

## app

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Application identifier. |
| `owner_wallet` | `string` | required | Owner wallet address. |
| `metadata` | `string` | required | Application metadata bytes32 hash. |
| `version` | `string` | required | Current application version. |
| `creation_approval_not_required` | `boolean` | required | Whether app sessions can be created without owner approval. |

## app_info

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Application identifier. |
| `owner_wallet` | `string` | required | Owner wallet address. |
| `metadata` | `string` | required | Application metadata bytes32 hash. |
| `version` | `string` | required | Current application version. |
| `creation_approval_not_required` | `boolean` | required | Whether app sessions can be created without owner approval. |
| `created_at` | `string` | required | Creation timestamp in Unix seconds. |
| `updated_at` | `string` | required | Last update timestamp in Unix seconds. |

## action_allowance

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `gated_action` | `string` | required | Gated action: `transfer`, `app_session_deposit`, `app_session_operation`, or `app_session_withdrawal`. |
| `time_window` | `string` | required | Time window for the allowance, for example `24h0m0s`. |
| `allowance` | `string` | required | Total allowance within the window. |
| `used` | `string` | required | Amount already used within the window. |

## pagination_params

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `offset` | `integer` | optional | Number of items to skip. |
| `limit` | `integer` | optional | Number of items to return. |
| `sort` | `string` | optional | Sort order: `asc` or `desc`. |

## pagination_metadata

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `page` | `integer` | required | Current page number. |
| `per_page` | `integer` | required | Number of items per page. |
| `total_count` | `integer` | required | Total number of items. |
| `page_count` | `integer` | required | Total number of pages. |
