---
sidebar_position: 9
title: API Reference
description: Complete Yellow SDK method documentation with examples and type definitions
keywords: [api reference, methods, types, nitrolite client, documentation]
---

# API Reference

Complete reference for all Yellow SDK methods, types, and utilities.

## NitroliteRPC Functions

### Message Creation

#### `createAppSessionMessage(signer: MessageSigner, params: CreateAppSessionRequestParams): Promise<string>`

Creates a signed application session message.

**Parameters:**

```typescript
type MessageSigner = (payload: any) => Promise<Hex>;

interface CreateAppSessionRequestParams {
  /** The detailed definition of the application being created, including protocol, participants, weights, and quorum. */
  definition: RPCAppDefinition;
  /** The initial allocation distribution among participants. Each participant must have sufficient balance for their allocation. */
  allocations: RPCAppSessionAllocation[];
  /** Optional session data as a JSON string that can store application-specific state or metadata. */
  session_data?: string;
};

interface RPCAppDefinition {
    /** Protocol identifies the version of the application protocol */
    protocol: ProtocolVersion;
    /** An array of participant addresses (Ethereum addresses) involved in the application. Must have at least 2 participants. */
    participants: Hex[];
    /** An array representing the relative weights or stakes of participants, often used for dispute resolution or allocation calculations. Order corresponds to the participants array. */
    weights: number[];
    /** The number of participants required to reach consensus or approve state updates. */
    quorum: number;
    /** A parameter related to the challenge period or mechanism within the application's protocol, in seconds. */
    challenge: number;
    /** A unique number used once, often for preventing replay attacks or ensuring uniqueness of the application instance. Must be non-zero. */
    nonce?: number;
}

interface RPCAppSessionAllocation {
    /** The symbol of the asset (e.g., "USDC", "USDT", "ETH"). */
    asset: string;
    /** The amount of the asset. Must be a positive number. */
    amount: string;
    /** The Ethereum address of the participant receiving the allocation. */
    participant: Address;
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
  endpoint: 'wss://clearnet.yellow.com/ws',
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
  MAINNET: 'wss://clearnet.yellow.com/ws',
  TESTNET: 'wss://clearnet-sandbox.yellow.com/ws',
  LOCAL: 'ws://localhost:8080/ws'
};

// Represents the protocol version and is used to provide backward compatibility as the API evolves.
enum ProtocolVersion {
  // NitroRPC_0_2 is the initial supported version of the NitroRPC protocol
  NitroRPC_0_2 = 'NitroRPC/0.2',
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
