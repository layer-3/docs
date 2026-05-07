---
title: API Reference
description: Canonical Nitrolite v1 RPC reference sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 1
---

# API Reference

This is the canonical Nitrolite v1 RPC surface, sourced from `docs/api.yaml` in the Nitrolite repository. Method names are grouped by namespace and version, for example `channels.v1.submit_state`.

RPC messages use the compact wire envelope described in [Interaction Model](../protocol/interaction-model): `[type, requestId, method, payload, timestamp]`. A request uses type `1`, a successful response uses type `2`, an event uses type `3`, and an error response uses type `4`.

```json
[1, 1001, "channels.v1.get_home_channel", { "wallet": "0x...", "asset": "usdc" }, 1741344819012]
```

:::info Looking for the 0.5.3 helper API?
If your app still imports legacy 0.5.3 message helpers, start with the [TypeScript compat SDK](../build/sdk/typescript-compat/overview). This section documents the v1 RPC methods, not the legacy helper surface.
:::

## Groups

| Group | Page | Purpose |
| --- | --- | --- |
| `channels.v1` | [Channels](./channels-v1) | Channel queries, state submission, channel session keys, and channel events. |
| `app_sessions.v1` | [App Sessions](./app-sessions-v1) | App-session creation, updates, deposits, rebalancing, and app-session keys. |
| `apps.v1` | [Apps](./apps-v1) | App registry lookup and application registration. |
| `user.v1` | [User](./user-v1) | Balances, transaction history, and action allowances. |
| `node.v1` | [Node](./node-v1) | Connectivity, node configuration, and supported assets. |
| `session_keys.v1` | [Session Keys](./session-keys-v1) | Reserved group; methods are not defined in `api.yaml` yet. |
| Types | [Types](./types) | Field tables for all shared request and response types. |
| Errors | [Errors](./errors) | Aggregated error messages and suggested user-facing handling. |

## SDK and MCP Lookup

Most builders should call the TypeScript or Go SDK instead of hand-building envelopes. Each group page links the RPC method back to the high-level SDK method where one exists.

If you use the Yellow SDK MCP server, ask `lookup_rpc_method` for the full method by name, for example `channels.v1.submit_state`. The MCP package documents the same `docs/api.yaml` surface and is intended for agentic API browsing.
