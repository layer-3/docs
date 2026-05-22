---
title: <namespace.v1.method>
description: <One sentence that describes the RPC method.>
---

# <namespace.v1.method>

<One sentence that states what this method does.>

## Signature

```text
<namespace.v1.method>(<payload>) -> <response>
```

## Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `<field>` | `<type>` | Yes | <Description.> |

## Response

| Field | Type | Description |
| --- | --- | --- |
| `<field>` | `<type>` | <Description.> |

## Errors

| Code | Meaning |
| --- | --- |
| `<code>` | <Description.> |

## SDK equivalents

| SDK | Call |
| --- | --- |
| TypeScript | `<client.method()>` |
| Go | `<client.Method()>` |

## Example envelope

```json
[
  "<type>",
  "<requestId>",
  "<namespace.v1.method>",
  {},
  "<timestamp>"
]
```
