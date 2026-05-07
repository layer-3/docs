---
title: apps.v1
description: Nitrolite v1 app registry RPC methods sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 5
---

# apps.v1

App registry methods list registered applications and register new application versions. Send requests with the compact envelope described in [Interaction Model](../protocol/interaction-model): `[1, requestId, method, payload, timestamp]`.

## get_apps

Retrieve registered applications with optional filtering by app ID and owner wallet.

SDK wrapper: `Client.getApps({ appId, ownerWallet, page, pageSize })`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app_id` | `string` | optional | Filter by application ID. |
| `owner_wallet` | `string` | optional | Filter by owner wallet address. |
| `pagination` | [`pagination_params`](./types#pagination_params) | optional | Pagination parameters. |

| Response field | Type | Description |
| --- | --- | --- |
| `apps` | `array<app_info>` | Registered applications. |
| `metadata` | [`pagination_metadata`](./types#pagination_metadata) | Pagination information. |

Errors: `invalid_parameters`. See [Errors](./errors).

```json
[1, 3001, "apps.v1.get_apps", { "owner_wallet": "0xOwner", "pagination": { "offset": 0, "limit": 20 } }, 1741344819012]
```

## submit_app_version

Register a new application in the app registry. Currently only version `1` creation is supported, and the owner must sign the packed app data.

SDK wrapper: `Client.registerApp(appID, metadata, creationApprovalNotRequired)`.

This is the registration prerequisite for [`app_sessions.v1.create_app_session`](./app-sessions-v1#create_app_session). If app-session creation returns `application_not_registered`, submit the app version first and then retry session creation.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `app` | [`app`](./types#app) | required | Application definition including ID, owner wallet, metadata, version, and creation approval flag. |
| `owner_sig` | `string` | required | Owner EIP-191 signature over the packed application data. |

Response: empty payload.

Errors: `invalid_app_id`, `invalid_version`, `invalid_signature`, `app_already_exists`. See [Errors](./errors).

```json
[1, 3002, "apps.v1.submit_app_version", { "app": { "id": "demo-app", "owner_wallet": "0xOwner", "metadata": "0xMetadata", "version": "1", "creation_approval_not_required": true }, "owner_sig": "0xSig" }, 1741344819012]
```
