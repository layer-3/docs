---
title: node.v1
description: Nitrolite v1 node RPC methods sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 7
---

# node.v1

Node methods check connectivity and read the node configuration and supported assets. Send requests with the compact envelope described in [Interaction Model](../protocol/interaction-model): `[1, requestId, method, payload, timestamp]`.

## ping

Simple connectivity check.

SDK wrapper: `Client.ping()`.

Request: empty payload. Response: empty payload. Errors: none declared in `docs/api.yaml`.

```json
[1, 5001, "node.v1.ping", {}, 1741344819012]
```

## get_config

Retrieve broker configuration and supported networks.

SDK wrapper: `Client.getConfig()`.

Request: empty payload.

| Response field | Type | Description |
| --- | --- | --- |
| `node_address` | `string` | Node wallet address. |
| `node_version` | `string` | Node software version. |
| `blockchains` | `array<blockchain_info>` | Supported networks. |

Errors: none declared in `docs/api.yaml`.

```json
[1, 5002, "node.v1.get_config", {}, 1741344819012]
```

## get_assets

Retrieve all supported assets with optional blockchain filter.

SDK wrapper: `Client.getAssets(blockchainId?)`.

| Request field | Type | Presence | Description |
| --- | --- | --- | --- |
| `blockchain_id` | `string` | optional | Filter by blockchain network ID. |

| Response field | Type | Description |
| --- | --- | --- |
| `assets` | `array<asset>` | Supported assets, filtered by blockchain if provided. |

Errors: none declared in `docs/api.yaml`.

```json
[1, 5003, "node.v1.get_assets", { "blockchain_id": "11155111" }, 1741344819012]
```
