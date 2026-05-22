---
title: Errors
description: Aggregated Nitrolite v1 RPC error messages sourced from docs/api.yaml
displayed_sidebar: apiSidebar
sidebar_position: 9
---

# Errors

RPC failures are returned as error response messages in the envelope described by [Interaction Model](../protocol/interaction-model#error-handling). Surface the message safely to users, log the method and request ID, and guide the user to the next recoverable action where one exists.

| Error message | Returned by | User-facing handling |
| --- | --- | --- |
| `account_not_found` | `channels.v1.get_last_key_states`, `app_sessions.v1.get_last_key_states`, `user.v1.get_balances` | Ask the user to reconnect or verify the wallet address. |
| `app_already_exists` | `apps.v1.submit_app_version` | Treat registration as complete if the app metadata matches; otherwise choose a new app ID. |
| `app_session_not_found` | `app_sessions.v1.get_app_definition` | Refresh the session list before retrying. |
| `application_not_registered` | `app_sessions.v1.create_app_session` | Register the app with [`apps.v1.submit_app_version`](./apps-v1#submit_app_version), then retry. |
| `channel_already_exists` | `channels.v1.request_creation` | Fetch the existing channel and continue from its latest state. |
| `channel_not_found` | `channels.v1.get_home_channel`, `channels.v1.get_escrow_channel`, `channels.v1.get_latest_state`, `channels.v1.submit_state`, `app_sessions.v1.submit_deposit_state` | Create or fund the required channel, or refresh local channel IDs. |
| `denied_until_checkpoint` | `channels.v1.submit_state` | Run the checkpoint flow before submitting another state. |
| `insufficient_balance` | `app_sessions.v1.create_app_session` | Ask the user to deposit or reduce allocations. |
| `invalid_app_id` | `apps.v1.submit_app_version` | Fix the application ID format. |
| `invalid_app_state` | `app_sessions.v1.submit_deposit_state`, `app_sessions.v1.submit_app_state` | Rebuild the app-state update from the latest session version. |
| `invalid_channel_definition` | `channels.v1.request_creation` | Recompute the channel definition from SDK helpers. |
| `invalid_definition` | `app_sessions.v1.create_app_session` | Validate participants, quorum, nonce, and application ID. |
| `invalid_owner_signature` | `app_sessions.v1.create_app_session` | Re-sign creation approval with the registered owner wallet. |
| `invalid_parameters` | `channels.v1.get_channels`, `app_sessions.v1.get_app_sessions`, `apps.v1.get_apps` | Fix filters and pagination parameters. |
| `invalid_session_key_state` | `channels.v1.submit_session_key_state`, `app_sessions.v1.submit_session_key_state` | Rebuild the session key state and verify expiration, scope, and user signature. |
| `invalid_signature` | `apps.v1.submit_app_version` | Re-sign packed app data with the owner wallet. |
| `invalid_state` | `channels.v1.request_creation` | Rebuild and sign the state from canonical SDK state helpers. |
| `invalid_transition` | `channels.v1.submit_state` | Recompute the next state from the latest node-signed state. |
| `invalid_version` | `apps.v1.submit_app_version` | Submit version `1`; other versions are not supported yet. |
| `ongoing_transition` | `channels.v1.submit_state`, `app_sessions.v1.submit_app_state` | Poll latest state or app session until the pending transition settles. |
| `owner_sig_required` | `app_sessions.v1.create_app_session` | Include `owner_sig` because the registered app requires owner approval. |
| `quorum_not_met` | `app_sessions.v1.submit_deposit_state`, `app_sessions.v1.submit_app_state` | Collect enough participant signatures to satisfy quorum. |
| `retrieval_failed` | `user.v1.get_action_allowances` | Retry after reconnecting; log the failure for operators. |
| `wallet_required` | `user.v1.get_action_allowances` | Request a connected wallet address before calling the method. |
