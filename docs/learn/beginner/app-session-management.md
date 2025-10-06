---
sidebar_position: 1
title: App Session Management
description: Complete guide to yellow application lifecycle management, stages, and operations
keywords: [app session, yellow application, lifecycle, stages, operations, nitrolite, clearnode]
---

# App Session Management

App sessions in the Yellow network enable secure, off-chain computation with on-chain settlement. This guide covers the complete lifecycle of app sessions, from creation through various operational stages to closure.

## Session Lifecycle Overview

App sessions follow a structured lifecycle with distinct stages and operations:

```mermaid
graph TD
    A[Create Session] --> B[Open]
    B --> C[Submit States]
    C --> C
    C --> D[Close Session]
    D --> E[Closed]
```

## Session Stages

### 1. Creation Stage

The initial stage where participants establish an application session with an optional yellow app (that can dictate state update rules) with agreed-upon parameters.

**Key Requirements:**
- All participants with non-zero allocations must sign the creation request
- Protocol must be specified ([`NitroRPC/0.4`](#nitrorpc04-current))
- Signature weights and quorum must be defined
- Initial allocations must be provided

**Stage Characteristics:**
- Status: `open`
- Version: Initial (1)
- Participants: Fixed set established
- Assets: Initial allocations locked

### 2. Operational Stage

The active phase where participants submit intermediate states and redistribute funds according to application logic.

**Stage Characteristics:**
- Status: `open`
- Version: Incrementing with each state update
- State Changes: Continuous based on application logic
- Signature Requirements: Quorum-based validation

**Sub-operations:**
Defined by Intent introduces with protocol version [`NitroRPC/0.4`](#nitrorpc04-current). Applications using older protocol versions do not support intents and execute `Operate` sub-operation for all requests.

- **Operate**: Redistribute existing session funds
- **Deposit**: Add funds from participants' unified balances
- **Withdraw**: Remove funds to participants' unified balances

### 3. Closure Stage

The final phase where the session is terminated, and final allocations are settled.

**Stage Characteristics:**
- Status: `open` → `closed`
- Final State: Immutable after closure
- Settlement: All funds distributed according to final allocations

## Core Operations

### Create Yellow App

Establishes a new app session between participants.

**Protocol Versions:**

#### NitroRPC/0.2 (Legacy)
```json
{
  "req": [1, "create_app_session", {
    "definition": {
      "protocol": "NitroRPC/0.2",
      "participants": [
        "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
        "0x00112233445566778899AaBbCcDdEeFf00112233"
      ],
      "weights": [50, 50],
      "quorum": 100,
      "challenge": 86400,
      "nonce": 1
    },
    "allocations": [
      {
        "participant": "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
        "asset": "usdc",
        "amount": "100.0"
      },
      {
        "participant": "0x00112233445566778899AaBbCcDdEeFf00112233",
        "asset": "usdc",
        "amount": "100.0"
      }
    ],
    "session_data": "{\"gameType\":\"chess\",\"timeControl\":{\"initial\":600,\"increment\":5}}"
  }, 1619123456789],
  "sig": ["0x9876fedcba..."]
}
```

#### NitroRPC/0.4 (Current)
Enhanced version with explicit versioning and improved state management allowing for optional deposits and withdrawals.

**Key Differences:**
- Required `version` field for state consistency
- Enhanced allocation validation
- Improved error handling

**Creation Requirements:**
- **Participants**: All participants with non-zero allocations must sign
- **Weights**: Signature weights determining voting power
- **Quorum**: Minimum signature weight threshold for operations
- **Challenge Period**: Time window for dispute resolution (seconds)
- **Session Data**: Optional application-specific metadata

### Submit Application State

Updates the session state during the operational stage.

#### Intent-Based Operations ([NitroRPC/0.4](#nitrorpc04-current))

The `intent` field specifies the purpose of the state update. An important concept is that the `allocations` you provide are not the *change* in funds, but rather the **final desired app balance state** for each participant after the operation.

**Operate Intent** - Redistribute session funds:
This intent is used for normal application logic where the total funds within the session do not change, but are simply moved between participants. The sum of the final allocations must equal the sum of the current allocations.

**Example:**
Assume the initial state is `100.0` usdc for each of the two participants. After a game round, Participant A loses `25.0` usdc to Participant B.

```json
{
  "req": [1, "submit_app_state", {
    "app_session_id": "0x3456789012abcdef...",
    "intent": "operate",
    "version": 2,
    "allocations": [
      {
        "participant": "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
        "asset": "usdc",
        "amount": "75.0"
      },
      {
        "participant": "0x00112233445566778899AaBbCcDdEeFf00112233",
        "asset": "usdc",
        "amount": "125.0"
      }
    ]
  }, 1619123456789],
  "sig": ["0x9876fedcba...", "0x8765fedcba..."]
}
```

**Deposit Intent** - Add funds to session:
To deposit funds, you specify the new total allocation for each depositing participant. The system calculates the deposit amount for a participant by subtracting their current balance from the new allocation amount you provide.

**Example:**
Suppose the current session state (from the `operate` example above) is:

  - Participant A (`0xA...C`): `75.0` usdc
  - Participant B (`0x0...3`): `125.0` usdc

Now, Participant A wants to deposit `50.0` usdc, and Participant B also wants to deposit `50.0` usdc.

**Calculation:**

  - Participant A's new total allocation = `75.0` (current) + `50.0` (deposit) = `125.0`
  - Participant B's new total allocation = `125.0` (current) + `50.0` (deposit) = `175.0`

You must submit these **updated amounts** in the `allocations` array.

```json
{
  "req": [1, "submit_app_state", {
    "app_session_id": "0x3456789012abcdef...",
    "intent": "deposit",
    "version": 3,
    "allocations": [
      {
        "participant": "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
        "asset": "usdc",
        "amount": "125.0"
      },
      {
        "participant": "0x00112233445566778899AaBbCcDdEeFf00112233",
        "asset": "usdc",
        "amount": "175.0"
      }
    ]
  }, 1619123456789],
  "sig": ["0x9876fedcba...", "0x8765fedcba..."]
}
```

**Important**: Any participant making a deposit must be a signer of the request, in addition to meeting the overall signature quorum.

**Withdraw Intent** - Remove funds from session:
Similar to depositing, you specify the final allocation for each participant after the withdrawal. The system calculates the withdrawal amount by subtracting the new allocation amount from the participant's current balance.

**Example:**
Following the deposit above, the current session state is:

  - Participant A (`0xA...C`): `125.0` usdc
  - Participant B (`0x0...3`): `175.0` usdc

Now, Participant A wants to withdraw `25.0` usdc, and Participant B also wants to withdraw `25.0` usdc.

**Calculation:**

  - Participant A's new total allocation = `125.0` (current) - `25.0` (withdraw) = `100.0`
  - Participant B's new total allocation = `175.0` (current) - `25.0` (withdraw) = `150.0`

You must submit these **final amounts** in the `allocations` array.

```json
{
  "req": [1, "submit_app_state", {
    "app_session_id": "0x3456789012abcdef...",
    "intent": "withdraw",
    "version": 4,
    "allocations": [
      {
        "participant": "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
        "asset": "usdc",
        "amount": "100.0"
      },
      {
        "participant": "0x00112233445566778899AaBbCcDdEeFf00112233",
        "asset": "usdc",
        "amount": "150.0"
      }
    ]
  }, 1619123456789],
  "sig": ["0x9876fedcba...", "0x8765fedcba..."]
}
```

**State Update Requirements:**
- **Quorum**: Sum of signer weights must meet threshold
- **Version**: Must specify expected next version number
- **Allocations**: Must comply with intent-specific rules
- **Signatures**: Required signers depend on operation type

### Close Yellow App

Terminates the session and finalizes all allocations.

```json
{
  "req": [1, "close_app_session", {
    "app_session_id": "0x3456789012abcdef...",
    "allocations": [
      {
        "participant": "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
        "asset": "usdc",
        "amount": "50.0"
      },
      {
        "participant": "0x00112233445566778899AaBbCcDdEeFf00112233",
        "asset": "usdc",
        "amount": "150.0"
      }
    ],
    "session_data": "{\"gameState\":\"closed\",\"winner\":\"0x00112233\",\"finalScore\":\"3-1\"}"
  }, 1619123456789],
  "sig": ["0x9876fedcba...", "0x8765fedcba..."]
}
```

**Closure Requirements:**
- **Quorum**: Must meet signature weight threshold
- **Final Allocations**: Define ultimate fund distribution  
- **Session Data**: Optional final state metadata
- **Irreversible**: Cannot reopen once closed

## Session Data Management

### Application-Specific Metadata

The optional `session_data` field enables applications to maintain custom state throughout the session lifecycle:

**Gaming Example:**
```json
{
  "gameType": "chess",
  "timeControl": {"initial": 600, "increment": 5},
  "gameState": "in_progress",
  "currentTurn": "0xAaBbCcDdEeFf0011223344556677889900aAbBcC",
  "moveHistory": ["e2e4", "e7e5", "Nf3", "Nc6"],
  "capturedPieces": {"white": ["p"], "black": []}
}
```

**Trading Example:**
```json
{
  "marketType": "prediction",
  "question": "Will BTC exceed $50k by end of month?",
  "positions": [
    {"participant": "0xAaBb...", "side": "yes", "amount": "100"},
    {"participant": "0x0011...", "side": "no", "amount": "100"}
  ],
  "oracleSource": "chainlink",
  "settlementDate": "2024-01-31T23:59:59Z"
}
```

### State Evolution

Session data evolves through the operational stages:

1. **Creation**: Initial configuration and rules
2. **Operation**: Dynamic state updates reflecting application logic
3. **Closure**: Final results and outcomes

### Recovery Strategies

**State Synchronization:**
- Query current session state before submitting updates
- Handle version conflicts with retry logic
- Implement exponential backoff for temporary failures

**Signature Collection:**
- Implement timeout mechanisms for signature gathering
- Handle partial signature scenarios gracefully
- Provide clear feedback on missing signatures

## Best Practices

### Session Design

1. **Quorum Selection**: Balance security with operational efficiency
   - Higher quorum = more security, slower operations
   - Lower quorum = faster operations, potential security risks

2. **Participant Management**: Plan for various scenarios
   - Offline participants
   - Signature collection coordination
   - Dispute resolution procedures

### Operational Efficiency

1. **State Batching**: Group multiple logical operations
2. **Session Data Optimization**: Minimize metadata size
3. **Version Management**: Implement proper state tracking
4. **Error Recovery**: Design robust fallback mechanisms

### Security Considerations

1. **Signature Verification**: Always validate all signatures
2. **State Validation**: Verify allocation arithmetic
3. **Replay Protection**: Use proper version sequencing
4. **Data Integrity**: Hash critical session data
