---
title: app_sessions.v1
description: Nitrolite v1 app-session RPC methods sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 4
---

# app_sessions.v1

App-session methods create sessions, submit signed app-state updates, deposit into sessions, rebalance sessions, and manage app-session session keys. Send requests with the compact envelope described in [Interaction Model](../protocol/interaction-model): `[1, requestId, method, payload, timestamp]`.

:::important Register the app first
`create_app_session` requires the application to exist in the app registry. If you receive `application_not_registered`, register it with [`apps.v1.submit_app_version`](./apps-v1#submit_app_version), then retry session creation.
:::

## submit_deposit_state

Submit an application session deposit state update.
SDK wrapper: `Client.submitAppSessionDeposit(appStateUpdate, quorumSigs, asset, depositAmount)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_state_update` | [`app_state_update`](./types#app_state_update) | required | Application session state update. |
| `quorum_sigs` | `array<string>` | required | App-session state update signatures. |
| `user_state` | [`state`](./types#state) | required | User state associated with the update. |

| Response field | Type | Description |
| --- | --- | --- |
| `signature` | `string` | Node signature for the deposit state. |
Errors: `invalid_app_state`, `quorum_not_met`, `channel_not_found`. See [Errors](./errors).

```json
[1, 2001, "app_sessions.v1.submit_deposit_state", { "app_state_update": { "app_session_id": "0xSession", "intent": "deposit", "version": "2", "allocations": [], "session_data": "{}" }, "quorum_sigs": ["0xSig"], "user_state": { "id": "0xState", "asset": "usdc" } }, 1741344819012]
```

## submit_app_state

Submit an application session state update.
SDK wrapper: `Client.submitAppState(appStateUpdate, quorumSigs)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_state_update` | [`app_state_update`](./types#app_state_update) | required | Application session state update. |
| `quorum_sigs` | `array<string>` | required | App-session state update signatures required for quorum. |
Response: empty payload.
Errors: `invalid_app_state`, `quorum_not_met`, `ongoing_transition`. See [Errors](./errors).

```json
[1, 2002, "app_sessions.v1.submit_app_state", { "app_state_update": { "app_session_id": "0xSession", "intent": "operate", "version": "3", "allocations": [], "session_data": "{\"move\":\"e4\"}" }, "quorum_sigs": ["0xSigA", "0xSigB"] }, 1741344819012]
```

## rebalance_app_sessions

Rebalance multiple application sessions atomically.
SDK wrapper: `Client.rebalanceAppSessions(signedUpdates)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `signed_updates` | `array<signed_app_state_update>` | required | Signed app-state updates; each update must have intent `rebalance`. |

| Response field | Type | Description |
| --- | --- | --- |
| `batch_id` | `string` | Unique identifier of the executed rebalance operation. |
Errors: none declared in `docs/api.yaml`.

```json
[1, 2003, "app_sessions.v1.rebalance_app_sessions", { "signed_updates": [{ "app_state_update": { "app_session_id": "0xSession", "intent": "rebalance", "version": "4", "allocations": [], "session_data": "{}" }, "quorum_sigs": ["0xSig"] }] }, 1741344819012]
```

## get_app_definition

Retrieve the application definition for a specific app session.
SDK wrapper: `Client.getAppDefinition(appSessionId)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_session_id` | `string` | required | Application session ID. |

| Response field | Type | Description |
| --- | --- | --- |
| `definition` | [`app_definition`](./types#app_definition) | Application definition. |
Errors: `app_session_not_found`. See [Errors](./errors).

```json
[1, 2004, "app_sessions.v1.get_app_definition", { "app_session_id": "0xSession" }, 1741344819012]
```

## get_app_sessions

List all application sessions for a participant with optional filtering.
SDK wrapper: `Client.getAppSessions({ appSessionId, wallet, status, page, pageSize })`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_session_id` | `string` | optional | Filter by application session ID. |
| `participant` | `string` | optional | Filter by participant wallet address. |
| `status` | `string` | optional | Filter by `open` or `closed`. |
| `pagination` | [`pagination_params`](./types#pagination_params) | optional | Pagination parameters. |

| Response field | Type | Description |
| --- | --- | --- |
| `app_sessions` | `array<app_session_info>` | List of application sessions. |
| `metadata` | [`pagination_metadata`](./types#pagination_metadata) | Pagination information. |

`metadata` is optional and may be absent when the response is not paginated.

Errors: `invalid_parameters`. See [Errors](./errors).

```json
[1, 2005, "app_sessions.v1.get_app_sessions", { "participant": "0xUser", "status": "open", "pagination": { "offset": 0, "limit": 20 } }, 1741344819012]
```

## create_app_session

Create a new application session between participants.
SDK wrapper: `Client.createAppSession(definition, sessionData, quorumSigs, { ownerSig })`.

Before calling this method, register the application with [`apps.v1.submit_app_version`](./apps-v1#submit_app_version). The `application_not_registered` error means the app registry does not know the `definition.application_id`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `definition` | [`app_definition`](./types#app_definition) | required | Application definition including participants and quorum. |
| `session_data` | `string` | required | JSON stringified session data. |
| `quorum_sigs` | `array<string>` | required | Participant signatures for app-session creation. |
| `owner_sig` | `string` | optional | Owner signature, required when creation approval is required. |

| Response field | Type | Description |
| --- | --- | --- |
| `app_session_id` | `string` | Created application session ID. |
| `version` | `string` | Initial session version. |
| `status` | `string` | Session status, normally `open`. |
Errors: `invalid_definition`, `application_not_registered`, `owner_sig_required`, `invalid_owner_signature`, `insufficient_balance`. See [Errors](./errors).

```json
[1, 2006, "app_sessions.v1.create_app_session", { "definition": { "application_id": "demo-app", "participants": [{ "wallet_address": "0xUser", "signature_weight": 1 }], "quorum": 1, "nonce": "1" }, "session_data": "{}", "quorum_sigs": ["0xSig"] }, 1741344819012]
```

## submit_session_key_state

Submit the app-session key state for registration and updates.
SDK wrapper: `Client.submitSessionKeyState(state)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `state` | [`app_session_key_state`](./types#app_session_key_state) | required | Session key metadata and delegation information. |
Response: empty payload.
Errors: `invalid_session_key_state`. See [Errors](./errors).

```json
[1, 2007, "app_sessions.v1.submit_session_key_state", { "state": { "user_address": "0xUser", "session_key": "0xKey", "version": "1", "application_id": ["demo-app"], "app_session_id": ["0xSession"], "expires_at": "1770000000", "user_sig": "0xSig" } }, 1741344819012]
```

## get_last_key_states

Retrieve latest app-session key states for a user, optionally filtered by session key.
SDK wrapper: `Client.getLastKeyStates(userAddress, sessionKey?)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `user_address` | `string` | required | User wallet address. |
| `session_key` | `string` | optional | Optional session key filter. |
| `pagination` | [`pagination_params`](./types#pagination_params) | optional | Pagination parameters. The `sort` field is not supported and must be omitted; maximum `limit` is 10. |

| Response field | Type | Description |
| --- | --- | --- |
| `states` | `array<app_session_key_state>` | Active app-session key states for the user. |
| `metadata` | [`pagination_metadata`](./types#pagination_metadata) | Pagination information. |
Errors: `account_not_found`. See [Errors](./errors).

```json
[1, 2008, "app_sessions.v1.get_last_key_states", { "user_address": "0xUser", "session_key": "0xKey", "pagination": { "offset": 0, "limit": 10 } }, 1741344819012]
```
