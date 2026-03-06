---
sidebar_position: 9
title: API Reference
description: Complete Yellow SDK method documentation with examples and type definitions
keywords: [api reference, methods, types, nitrolite client, documentation]
displayed_sidebar: apiSidebar
---

# API Reference

Complete reference for all Yellow SDK methods, types, and utilities.

## NitroliteRPC Functions

### Message Creation

#### `createAppSessionMessage(signer: MessageSigner, sessions: AppSession[]): Promise<string>`

Creates a signed application session message.

**Parameters:**
```typescript
type MessageSigner = (payload: any) => Promise<Hex>;

interface AppSession {
  definition: AppDefinition;
  allocations: AppAllocation[];
}

interface AppDefinition {
  protocol: string;
  participants: Address[];
  weights: number[];
  quorum: number;
  challenge: number;
  nonce: number;
}

interface AppAllocation {
  participant: Address;
  asset: string;
  amount: string;
}
```

#### `createStateUpdateMessage(signer: MessageSigner, update: StateUpdate): Promise<string>`

Creates a signed state update message.

#### `parseRPCResponse(data: string): RPCMessage`

Parses ClearNode response messages.

**Returns:**
```typescript
interface RPCMessage {
  id?: number;
  method?: string;
  params?: any;
  result?: any;
  error?: RPCError;
}
```

### Utilities

#### `computeChannelId(channel: Channel): ChannelId`

Calculates deterministic channel identifier.

#### `computeStateHash(state: State, channelId: ChannelId): Hash`

Calculates state hash for signatures.

#### `validateSignature(state: State, signature: Hex, signer: Address): Promise<boolean>`

Verifies state signature.

## Type Definitions

### Core Types

```typescript
type Address = `0x${string}`;
type Hash = `0x${string}`;
type Hex = `0x${string}`;
type ChannelId = Hash;

interface Channel {
  participants: Address[];
  adjudicator: Address;
  challenge: bigint;
  nonce: bigint;
}

interface State {
  intent: StateIntent;
  version: bigint;
  data: Hex;
  allocations: Allocation[];
  sigs: Hex[];
}

interface Allocation {
  destination: Address;
  token: Address;
  amount: bigint;
}

enum StateIntent {
  OPERATE = 0,
  INITIALIZE = 1,
  RESIZE = 2,
  FINALIZE = 3
}

enum ChannelStatus {
  VOID = 0,
  INITIAL = 1,
  ACTIVE = 2,
  DISPUTE = 3,
  FINAL = 4
}
```

### Connection Configuration

```typescript
interface ClearNodeConfig {
  endpoint: string;          // WebSocket endpoint
  apiKey?: string;          // Optional authentication
  timeout: number;          // Connection timeout
  retryAttempts: number;    // Reconnection attempts
}

const config = {
  endpoint: 'wss://clearnet-sandbox.yellow.com/ws', // or wss://clearnet.yellow.com/ws for production
  timeout: 30000,
  retryAttempts: 3
};
```

### RPC Types

```typescript
interface RPCRequest {
  id: number;
  method: string;
  params: any[];
  timestamp?: number;
}

interface RPCResponse {
  id: number;
  result?: any;
  error?: RPCError;
  timestamp: number;
}

interface RPCError {
  code: number;
  message: string;
  data?: any;
}
```

## Error Types

### Client Errors

```typescript
class YellowSDKError extends Error {
  constructor(message: string, public code: string, public context?: any) {
    super(message);
    this.name = 'YellowSDKError';
  }
}

class NetworkError extends YellowSDKError {
  constructor(message: string, context?: any) {
    super(message, 'NETWORK_ERROR', context);
  }
}

class ContractError extends YellowSDKError {
  constructor(message: string, context?: any) {
    super(message, 'CONTRACT_ERROR', context);
  }
}

class ValidationError extends YellowSDKError {
  constructor(message: string, context?: any) {
    super(message, 'VALIDATION_ERROR', context);
  }
}
```

### Error Handling

```javascript
try {
  const sessionMessage = await createAppSessionMessage(messageSigner, sessionData);
  ws.send(sessionMessage);
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network connectivity issues
    await this.reconnectToClearNode();
  } else if (error instanceof ValidationError) {
    // Handle input validation errors
    console.error('Invalid session parameters:', error.context);
  } else if (error instanceof SigningError) {
    // Handle wallet signing errors
    console.error('Message signing failed:', error.message);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

## Constants

### Network Endpoints

```typescript
const CLEARNODE_ENDPOINTS = {
  PRODUCTION: 'wss://clearnet.yellow.com/ws',
  SANDBOX: 'wss://clearnet-sandbox.yellow.com/ws',
  LOCAL: 'ws://localhost:8080/ws'
};

const PROTOCOLS = {
  PAYMENT: 'payment-app-v1',
  GAMING: 'gaming-app-v1',
  ESCROW: 'escrow-app-v1',
  TOURNAMENT: 'tournament-v1',
  SUBSCRIPTION: 'subscription-v1'
};
```

### Message Types

```typescript
const MESSAGE_TYPES = {
  SESSION_CREATE: 'session_create',
  SESSION_MESSAGE: 'session_message',
  PAYMENT: 'payment',
  STATE_UPDATE: 'state_update',
  PARTICIPANT_JOIN: 'participant_join',
  SESSION_CLOSE: 'session_close',
  ERROR: 'error'
};

const SESSION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  CLOSING: 'closing',
  CLOSED: 'closed',
  ERROR: 'error'
};
```

This API reference provides everything you need to integrate NitroliteRPC into your applications with confidence and precision.