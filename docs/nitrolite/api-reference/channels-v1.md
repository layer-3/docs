---
title: channels.v1
description: Nitrolite v1 channel RPC methods sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 3
---

# channels.v1

Channel methods query home and escrow channels, fetch signed state, submit state transitions, and manage channel session keys. Send requests with the compact envelope described in [Interaction Model](../protocol/interaction-model): `[1, requestId, method, payload, timestamp]`.

## get_home_channel

Retrieve current on-chain home channel information.
SDK wrapper: `Client.getHomeChannel(wallet, asset)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet` | `string` | required | User wallet address. |
| `asset` | `string` | required | Asset symbol. |

| Response field | Type | Description |
| --- | --- | --- |
| `channel` | [`channel`](./types#channel) | On-chain channel information. |
Errors: `channel_not_found`. See [Errors](./errors).

```json
[1, 1001, "channels.v1.get_home_channel", { "wallet": "0xUser", "asset": "usdc" }, 1741344819012]
```

## get_escrow_channel

Retrieve current on-chain escrow channel information.
SDK wrapper: `Client.getEscrowChannel(escrowChannelId)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `escrow_channel_id` | `string` | required | Escrow channel ID. |

| Response field | Type | Description |
| --- | --- | --- |
| `channel` | [`channel`](./types#channel) | On-chain channel information. |
Errors: `channel_not_found`. See [Errors](./errors).

```json
[1, 1002, "channels.v1.get_escrow_channel", { "escrow_channel_id": "0xEscrowChannel" }, 1741344819012]
```

## get_channels

Retrieve all channels for a user with optional filtering.
SDK wrapper: `Client.getChannels(wallet, { asset, status, pagination })`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet` | `string` | required | User wallet address. |
| `asset` | `string` | optional | Filter by asset. |
| `status` | `string` | optional | Filter by status. |
| `pagination` | [`pagination_params`](./types#pagination_params) | optional | Pagination parameters. |

| Response field | Type | Description |
| --- | --- | --- |
| `channels` | `array<channel>` | List of channels. |
| `metadata` | [`pagination_metadata`](./types#pagination_metadata) | Pagination information. |
Errors: `invalid_parameters`. See [Errors](./errors).

```json
[1, 1003, "channels.v1.get_channels", { "wallet": "0xUser", "asset": "usdc", "status": "open" }, 1741344819012]
```

## get_latest_state

Retrieve the current state of the user stored on the Node.
SDK wrapper: `Client.getLatestState(wallet, asset, onlySigned)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `wallet` | `string` | required | User wallet address. |
| `asset` | `string` | required | Asset symbol. |
| `only_signed` | `boolean` | required | When true, returns only the latest signed state. |

| Response field | Type | Description |
| --- | --- | --- |
| `state` | [`state`](./types#state) | Current state of the user. |
Errors: `channel_not_found`. See [Errors](./errors).

```json
[1, 1004, "channels.v1.get_latest_state", { "wallet": "0xUser", "asset": "usdc", "only_signed": true }, 1741344819012]
```

## request_creation

Request the creation of a channel from Node.
SDK wrapper: internal path used by `Client.deposit(...)` when the home channel does not exist.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `state` | [`state`](./types#state) | required | Initial state to submit. |
| `channel_definition` | [`channel_definition`](./types#channel_definition) | required | Definition of the channel to create. |

| Response field | Type | Description |
| --- | --- | --- |
| `signature` | `string` | Node signature for the state. |
Errors: `invalid_channel_definition`, `invalid_state`, `channel_already_exists`. See [Errors](./errors).

```json
[1, 1005, "channels.v1.request_creation", { "state": { "id": "0xState", "asset": "usdc" }, "channel_definition": { "nonce": "1", "challenge": 86400 } }, 1741344819012]
```

## submit_state

Submit a cross-chain channel state.
SDK wrapper: internal path used by `Client.deposit(...)`, `Client.transfer(...)`, `Client.checkpoint(...)`, and other channel-state transitions.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `state` | [`state`](./types#state) | required | Signed state to submit. |

| Response field | Type | Description |
| --- | --- | --- |
| `signature` | `string` | Node signature for the state. |
Errors: `invalid_transition`, `ongoing_transition`, `channel_not_found`, `denied_until_checkpoint`. See [Errors](./errors).

```json
[1, 1006, "channels.v1.submit_state", { "state": { "id": "0xState", "transition": { "type": "transfer_send", "tx_id": "tx-1", "account_id": "0xReceiver", "amount": "1.0" } } }, 1741344819012]
```

## submit_session_key_state

Submit the channel session key state for registration and updates.
SDK wrapper: `Client.submitChannelSessionKeyState(state)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `state` | [`channel_session_key_state`](./types#channel_session_key_state) | required | Session key metadata and delegation information. |
Response: empty payload.
Errors: `invalid_session_key_state`. See [Errors](./errors).

```json
[1, 1007, "channels.v1.submit_session_key_state", { "state": { "user_address": "0xUser", "session_key": "0xKey", "version": "1", "assets": ["usdc"], "expires_at": "1770000000", "user_sig": "0xSig" } }, 1741344819012]
```

## get_last_key_states

Retrieve latest channel session key states for a user, optionally filtered by session key.
SDK wrapper: `Client.getLastChannelKeyStates(userAddress, sessionKey?)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `user_address` | `string` | required | User wallet address. |
| `session_key` | `string` | optional | Optional session key filter. |

| Response field | Type | Description |
| --- | --- | --- |
| `states` | `array<channel_session_key_state>` | Active channel session key states for the user. |
Errors: `account_not_found`. See [Errors](./errors).

```json
[1, 1008, "channels.v1.get_last_key_states", { "user_address": "0xUser", "session_key": "0xKey" }, 1741344819012]
```

## Events

### home_channel_created

`docs/api.yaml` declares `home_channel_created` with `channel` and `initial_state` payload fields.

:::note Future protocol revision
The [Interaction Model](../protocol/interaction-model#message-types) currently marks asynchronous event notifications as reserved for a future protocol revision. Treat `home_channel_created` as documented schema, not a stable event subscription guarantee.
:::

| Payload field | Type | Description |
| --- | --- | --- |
| `channel` | [`channel`](./types#channel) | Created home channel information. |
| `initial_state` | [`state`](./types#state) | Initial state of the home channel. |
