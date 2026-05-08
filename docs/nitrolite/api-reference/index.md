---
title: API Reference
description: Canonical Nitrolite v1 RPC reference sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 1
---

# API Reference

The **Protocol** tab describes the semantic model: envelope structure, channel lifecycle, state-and-ledger model, enforcement guarantees, and other conceptual pieces. **API Reference** catalogs the concrete RPC methods that bind that model to the wire. Most app builders never read this tab directly: the TypeScript and Go SDKs build the envelopes, sign requests, and surface every method below as a typed function call. Reach for hand-rolled RPC only when you are integrating from a language without an official SDK, building a thin proxy or wire debugger, or generating code against `docs/api.yaml`.

This is the canonical Nitrolite v1 RPC surface, sourced from `docs/api.yaml` in the Nitrolite repository. Method names are grouped by namespace and version, for example `channels.v1.submit_state`.

RPC messages use the compact wire envelope described in [Interaction Model](../protocol/interaction-model): `[type, requestId, method, payload, timestamp]`. A request uses type `1`, a successful response uses type `2`, an event uses type `3`, and an error response uses type `4`.

```json
[1, 1001, "channels.v1.get_home_channel", { "wallet": "0x...", "asset": "usdc" }, 1741344819012]
```

:::info Looking for the 0.5.3 helper API?
If your app still imports legacy 0.5.3 message helpers, start with the [TypeScript compat SDK](../build/sdk/typescript-compat/overview). This section documents the v1 RPC methods, not the legacy helper surface.
:::

## Use the SDKs first

The official SDKs are the recommended way to call every method documented here:

- **TypeScript:** [`@yellow-org/sdk`](../build/sdk/typescript/getting-started) for new apps, or [`@yellow-org/sdk-compat`](../build/sdk/typescript-compat/overview) for migrations from `@erc7824/nitrolite@0.5.3`. You get IDE autocomplete, parameter checking, discriminated-union response types, and correct amount-unit handling out of the box.
- **Go:** [`github.com/layer-3/nitrolite/sdk/go`](../build/sdk/go/getting-started) for backends and CLI tooling, with typed structs for every request and response.
- **MCP server (`@yellow-org/sdk-mcp`, coming soon):** ask `lookup_rpc_method` for a method by name, for example `channels.v1.submit_state`, and `lookup_method` to find the matching SDK call. The MCP indexes the same `docs/api.yaml` surface and is intended for agentic browsing inside coding tools.

The SDKs handle the `[type, requestId, method, payload, timestamp]` envelope, signing, response correlation, event streams, auth/session-key plumbing, and amount-unit conversions. Reach for the catalogue below when you genuinely need to inspect or generate against the wire surface.

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
