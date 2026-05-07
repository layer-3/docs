---
title: session_keys.v1
description: Reserved Nitrolite v1 session key RPC group
displayed_sidebar: apiSidebar
sidebar_position: 8
---

# session_keys.v1

Group reserved; methods are not yet defined in `docs/api.yaml`.

Session key operations currently live under the channel and app-session groups:

| Existing method | Purpose |
| --- | --- |
| [`channels.v1.submit_session_key_state`](./channels-v1#submit_session_key_state) | Register or update a channel session key state. |
| [`channels.v1.get_last_key_states`](./channels-v1#get_last_key_states) | Read latest channel session key states. |
| [`app_sessions.v1.submit_session_key_state`](./app-sessions-v1#submit_session_key_state) | Register or update an app-session key state. |
| [`app_sessions.v1.get_last_key_states`](./app-sessions-v1#get_last_key_states) | Read latest app-session key states. |
