---
sidebar_position: 2
title: Migration Guide
description: Guide to migrate to newer versions of Nitrolite
keywords: [migration, upgrade, breaking changes, nitrolite, erc7824]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migration Guide

If you are coming from an earlier version of the Nitrolite protocol, first choose the migration surface:

- If you're using `@yellow-org/sdk-compat`, use this page for legacy protocol semantics and the [compat overview](./typescript-compat/overview) for the codemod workflow.
- If you're going straight to `@yellow-org/sdk`, use this page as a semantics checklist, then implement new code with the native [TypeScript SDK guide](./typescript/getting-started).

The `@yellow-org/nitrolite-codemod` package is planned for npm. Until it publishes, the [compat overview codemod workflow](./typescript-compat/overview) shows how to clone the source repo, build the CLI, scan your app, and apply the migration transforms. It rewrites package imports, updates dependencies, and leaves `TODO [codemod]` markers where a native v1 decision is required.

## What semantics changed

Amount units are the most important migration boundary:

- If you're using `@yellow-org/sdk-compat`, channel transfers use raw asset-unit strings, such as `'5000000'` for 5 USDC with 6 decimals. See the amount-units table in the [compat overview](./typescript-compat/overview).
- If you're updating app-session allocations, keep human-decimal strings in the allocation payloads because app state is signed and shared by participants.
- If you're going straight to `@yellow-org/sdk`, use `Decimal` values for native v1 calls such as `deposit()`, `withdraw()`, `transfer()`, and app-session allocation amounts.

## 0.5.x Breaking changes

If you're using `@yellow-org/sdk-compat`, treat the snippets in this section as legacy-shape examples to compare with your current app. If you're going straight to `@yellow-org/sdk`, use the native SDK pages for replacement code.

The 0.5.x release includes fundamental protocol changes affecting session keys, channel operations, state signatures, and channel resize rules. The main objective of these changes is to enhance security, and provide better experience for developers and users by ability to limit allowances for specific applications.

**Not ready to migrate?** Unfortunately, at this time Yellow Network does not provide Nitronode instances running the previous version of the protocol, so you will need to migrate to the latest version to continue using the Network.

### Protocol Changes

These protocol-level changes affect all implementations and integrations with the Yellow Network.

#### Session Keys: Applications, Allowances, and Expiration

Session keys now have enhanced properties that define their access levels and capabilities:

- **Application field**: Determines the scope of session key permissions. Setting this to an application name (e.g., "My Trading App") grants application-scoped access with enforced allowances. Legacy root-access examples may use a broker-specific root marker because that is what older protocol versions expected.

- **Allowances field**: Defines spending limits for application-scoped session keys. These limits are tracked cumulatively across all operations and are enforced by the protocol.

- **Expires_at field**: Uses a bigint timestamp (seconds since epoch). Once expired, session keys are permanently frozen and cannot be reactivated. This is particularly critical for legacy root access keys: if they expire, you lose the ability to perform channel operations.

#### Channel Creation: Separate Create and Fund Steps

Nitronode no longer supports creating channels with an initial deposit. All channels must be created with zero balance and funded separately through a resize operation. This two-step process ensures cleaner state management and prevents edge cases in channel initialization.

#### State Signatures: Wallet vs Session Key Signing

A fundamental change in how channel states are signed:

- **Channels created before v0.5.0**: The participant address is the session key, and all states must be signed by that session key.

- **Channels created after v0.5.0**: The participant address is the wallet address, and all states must be signed by the wallet.

This change improves security and aligns with standard practices, but requires careful handling during the transition period.

#### Resize Operations: Strict Channel Balance Rules

The protocol now enforces strict rules about channel balances and their impact on other operations:

- **Blocked operations**: Users with any channel containing non-zero amounts cannot perform transfers, submit app states with deposit intent, or create app sessions with non-zero allocations.

- **Resizing state**: After a resize request, channels enter a "resizing" state with locked funds until the on-chain transaction is confirmed. If a channel remains stuck in this state for an extended period, the recommended action is to close the channel and create a new one.

- **Allocate amount semantics**: The resize operation uses `allocate_amount` where negative values withdraw from the channel to unified balance, and positive values deposit to the channel.

:::warning
**Legacy channel migration**: Users with existing channels containing non-zero amounts must either resize them to zero (by providing "resize_amount" as 0 and "allocate_amount" as your **negative** on-chain balance) or close them to enable full protocol functionality. If you are unsure how to adjust resize parameters, the safe option is to close the old on-chain channel entirely, and open a new one.
:::

#### Non-Zero Channel Allocations: Operation Restrictions

The following operations will return errors if the user has any channel with non-zero amount:

- **Transfer**: Returns error code indicating blocked due to non-zero channel balance
- **Submit App State** (with deposit intent): Rejected if attempting to deposit
- **Create App Session** (with allocations): Rejected if attempting to allocate

The returned error has the following format: `operation denied: non-zero allocation in <count> channel(s) detected owned by wallet <address>"`

### Nitrolite SDK

You should read this section if you are using the Nitrolite SDK.

#### Update Authentication

Implementing the new session key protocol changes:

<Tabs>
  <TabItem value="application" label="Application Session Key">

  ```typescript
  const authRequest = {
    address: '0x...',
    session_key: '0x...',
    application: 'My Trading App', // Application name for confined access
    allowances: [
      { asset: 'usdc', amount: '1000.0' },
      { asset: 'eth', amount: '0.5' }
    ],
    scope: 'app.create',
    expires_at: BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60) // 7 days
  };
  ```

  </TabItem>
  <TabItem value="root" label="Root Access (legacy)">

  ```typescript
  const authRequest = {
    address: '0x...',
    session_key: '0x...',
    // The legacy root-access value was 'clearnode'; check your broker docs if you used a custom value.
    application: '<legacy-root-application>',
    allowances: [], // Not enforced for root access
    scope: 'app.create',
    expires_at: BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60) // Long expiration recommended
  };
  ```

  </TabItem>
</Tabs>

**Important considerations:**
- Root access keys that use a legacy root-application marker cannot perform channel operations after expiration
- Plan expiration times based on your operational needs
- Application-scoped keys track cumulative spending against allowances

#### Auth Verify Changes

The `createEIP712AuthMessageSigner` function signature has changed to align with the new session key structure.

```typescript
const eip712SigningFunction = createEIP712AuthMessageSigner(
    walletClient,
    {
        scope: authMessage.scope,
        // remove-next-line
        application: authMessage.application,
        // remove-next-line
        participant: authMessage.session_key,
        // remove-next-line
        expire: authMessage.expire,
        // add-next-line
        session_key: authMessage.session_key,
        // add-next-line
        expires_at: authMessage.expires_at,
        allowances: authMessage.allowances,
    },
    getAuthDomain(),
);
```

#### Migrate Channel Creation

Channels must now be created with zero initial deposit and funded separately via the `resizeChannel` method:

```typescript
const { channelId } = await client.createChannel({
  chain_id: 1,
  token: tokenAddress,
  // remove-next-line
  amount: BigInt(1000000), // Initial deposit
  // remove-next-line
  session_key: '0x...' // Optional
});

// add-start
// Step 2: Fund the channel separately
await client.resizeChannel({
  channel_id: channelId,
  amount: BigInt(1000000),
});
// add-end
```

#### Resize correctly

Channel resizing must be negotiated with Nitronode through WebSocket. Use `resize_amount` and `allocate_amount` with correct sign convention (`resize_amount = -allocate_amount`) and help users with non-zero channel balances migrate by resizing to zero or reopening channels.

Channel resize can be requested as follows:

```typescript
const resizeMessage = await createResizeChannelMessage(messageSigner, {
  channel_id: channelId,
  resize_amount: BigInt(50), // Positive = deposit to channel, negative = withdraw from channel to custody ledger
  allocate_amount: BigInt(-50), // Negative = deposit to unified balance, negative = withdraw from unified balance to channel
  funds_destination: walletAddress,
});

const resizeResponse = {}; // send the message and wait for Nitronode's response

const { params: resizeResponseParams } = parseResizeChannelResponse(resizeResponse);
const resizeParams = {
  resizeState: {
      channelId,
      ...resizeResponseParams.state,
      serverSignature: resizeResponseParams.serverSignature,
      data: resizeResponseParams.state.stateData as Hex,
      version: BigInt(resizeResponseParams.state.version),
  },
  // `previousState` is either initial or previous resizing state, depending on which has higher version number
  // can be obtained with `await (client.getChannelData(channelId)).lastValidState`
  proofStates: [previousState],
}

const {txHash} = await client.resizeChannel(resizeParams);
```

Here is how you can migrate your channels:

```typescript
// Check and migrate channels with non-zero amounts
const channels = await client.getOpenChannels();

for (const channel of channels) {
  if (channel.amount > 0) {
    // Must empty channel to enable transfers/app operations
    const resizeMessage = await createResizeChannelMessage(messageSigner, {
      channel_id: channel.channelId,
      resize_amount: BigInt(0),
      allocate_amount: -BigInt(channel.amount),
      funds_destination: walletAddress,
    });
    
    // perform the resize as shown above
  }
}
```


**Critical:** Operations blocked when any channel has non-zero amount:
- Off-chain transfers
- App state submissions with deposit intent
- Creating app sessions with allocations

#### Test State Signatures

If you plan to work with on-chain channels opened PRIOR to v0.5.0, then on Nitrolite client initialization the `stateSigner` you specify must be based on a Session Key used in the channel as participant. Even if this session key is or will expire, you still need to provide a `stateSigner` based on it.

On the other hand, if you plan to work with channels created SINCE v0.5.0, you can specify the `stateSigner` based on the `walletClient` you have specified.

#### Manage Session Keys

New methods have been added for comprehensive session key management, including retrieval and revocation.

```typescript
// Get all active session keys
const sessionKeys = await client.getSessionKeys();

// Revoke a specific session key
await client.revokeSessionKey({
  session_key: '0x...'
});

// Session key data structure
interface RPCSessionKey {
  id: string;
  sessionKey: Address;
  application: string;
  allowances: RPCAllowanceUsage[]; // Includes usage tracking
  scope: string;
  expiresAt: bigint;
  createdAt: bigint;
}
```
#### EIP-712 Signatures: String-based Amounts

EIP-712 signature types now use string values for amounts instead of numeric types to support better precision with decimal values.

```typescript
const types = {
  Allowance: [
    { name: 'asset', type: 'string' },
    // remove-next-line
    { name: 'amount', type: 'uint256' },
    // add-next-line
    { name: 'amount', type: 'string' },
  ]
};
```

### Nitronode RPC

You should read this section only if you are using the Nitronode RPC API directly.

#### Update Authentication

Use the new session key parameters with proper `application`, `allowances`, and `expires_at` fields:

<Tabs>
  <TabItem value="application" label="Application Auth">

  ```json
  {
    "req": [1, "auth_request", {
      "address": "0x1234567890abcdef...",
      "session_key": "0x9876543210fedcba...",
      "application": "My Trading App",
      "allowances": [
        { "asset": "usdc", "amount": "1000.0" },
        { "asset": "eth", "amount": "0.5" }
      ],
      "scope": "app.create",
      "expires_at": 1719123456789
    }, 1619123456789],
    "sig": ["0x..."]
  }
  ```

  </TabItem>
  <TabItem value="root" label="Root Auth (legacy)">

  ```json
  {
    "req": [1, "auth_request", {
      "address": "0x1234567890abcdef...",
      "session_key": "0x9876543210fedcba...",
      "application": "<legacy-root-application>",
      "allowances": [],
      "scope": "app.create",
      "expires_at": 1750659456789
    }, 1619123456789],
    "sig": ["0x..."]
  }
  ```

  </TabItem>
</Tabs>

#### Migrate Channel Creation

Implement the two-step process (create empty, then resize to fund)

The `create_channel` method no longer accepts `amount` and `session_key` parameters:

```json
{
  "req": [1, "create_channel", {
    "chain_id": 137,
    "token": "0xeeee567890abcdef...",
    // remove-next-line
    "amount": "100000000",
    // remove-next-line
    "session_key": "0x1234567890abcdef..."
  }, 1619123456789],
  "sig": ["0x9876fedcba..."]
}
```

#### Manage Session Keys

New methods for session key operations have been added.

##### Get Session Keys

Request:
```json
{
  "req": [1, "get_session_keys", {}, 1619123456789],
  "sig": ["0x..."]
}
```

Response:
```json
{
  "res": [1, "get_session_keys", {
    "session_keys": [{
      "id": "sk_123",
      "session_key": "0x9876543210fedcba...",
      "application": "My Trading App",
      "allowances": [
        { "asset": "usdc", "amount": "1000.0", "used": "250.0" }
      ],
      "scope": "app.create",
      "expires_at": 1719123456789,
      "created_at": 1619123456789
    }]
  }, 1619123456789],
  "sig": ["0x..."]
}
```

##### Revoke Session Key Request

Request:
```json
{
  "req": [1, "revoke_session_key", {
    "session_key": "0x1234567890abcdef..."
  }, 1619123456789],
  "sig": ["0x..."]
}
```

Response:
```json
{
  "res": [1, "revoke_session_key", {
    "session_key": "0x1234567890abcdef..."
  }, 1619123456789],
  "sig": ["0x..."]
}
```
