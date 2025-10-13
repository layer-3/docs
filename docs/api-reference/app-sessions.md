---
sidebar_position: 3
title: App Sessions
description: API reference for virtual application session management
keywords: [app session, create, submit, close, virtual application, api]
displayed_sidebar: apiSidebar
---

# App Sessions

API methods for managing virtual application sessions.

## create_app_session

Creates a virtual application session between participants.

**Request:**
```json
{
  "req": [1, "create_app_session", {
    "definition": {
      "protocol": "NitroRPC/0.2" | "NitroRPC/0.4",
      "participants": Address[],
      "weights": number[],
      "quorum": number,
      "challenge": number,
      "nonce": number
    },
    "allocations": AppAllocation[],
    "session_data": string // Optional
  }, timestamp],
  "sig": Hex[]
}
```

**Response:**
```json
{
  "res": [1, "create_app_session", {
    "app_session_id": Hex,
    "version": string,
    "status": "open"
  }, timestamp],
  "sig": [Hex]
}
```

## submit_app_state

Updates session state and redistributes funds.

### NitroRPC/0.2

**Request:**
```json
{
  "req": [1, "submit_app_state", {
    "app_session_id": Hex,
    "allocations": AppAllocation[],
    "session_data": string // Optional
  }, timestamp],
  "sig": Hex[]
}
```

### NitroRPC/0.4

**Request:**
```json
{
  "req": [1, "submit_app_state", {
    "app_session_id": Hex,
    "intent": "operate" | "deposit" | "withdraw",
    "version": number,
    "allocations": AppAllocation[],
    "session_data": string // Optional
  }, timestamp],
  "sig": Hex[]
}
```

**Response:**
```json
{
  "res": [1, "submit_app_state", {
    "app_session_id": Hex,
    "version": string,
    "status": "open"
  }, timestamp],
  "sig": [Hex]
}
```

## close_app_session

Closes session and finalizes fund distribution.

**Request:**
```json
{
  "req": [1, "close_app_session", {
    "app_session_id": Hex,
    "allocations": AppAllocation[],
    "session_data": string // Optional
  }, timestamp],
  "sig": Hex[]
}
```

**Response:**
```json
{
  "res": [1, "close_app_session", {
    "app_session_id": Hex,
    "version": string,
    "status": "closed"
  }, timestamp],
  "sig": [Hex]
}
```

## Types

### AppAllocation
```typescript
interface AppAllocation {
  participant: Address;
  asset: string;
  amount: string;
}
```

### AppDefinition
```typescript
interface AppDefinition {
  protocol: "NitroRPC/0.2" | "NitroRPC/0.4";
  participants: Address[];
  weights: number[];
  quorum: number;
  challenge: number;
  nonce: number;
}
```

## Intent Types (NitroRPC/0.4)

- `operate`: Redistribute existing session funds
- `deposit`: Add funds from participants' unified balances  
- `withdraw`: Remove funds to participants' unified balances

## Session Status

- `open`: Session is active and accepting state updates
- `closed`: Session is finalized, no further updates allowed