# Nitrolite v1 Lifecycle Example

Runnable TypeScript example for the native `@yellow-org/sdk` channel and app-session lifecycle.

The script:

1. Connects a user wallet and a separate app signer.
2. Checks Nitronode config and asset support.
3. Prepares the user's home channel with `approveToken`, `deposit`, and `checkpoint` when needed.
4. Creates a two-party app session.
5. Deposits channel funds into the app session.
6. Runs `operate`, `withdraw`, and `close` app-session updates.

## Setup

```bash
cp .env.example .env
npm install
npm run build
npm run lifecycle
```

Use disposable test wallets only. The app signer can be an unfunded test wallet; the user wallet needs Sepolia gas and the selected test asset.

Set `NITRONODE_WS_URL` to the current v1 sandbox or test endpoint provided for your environment before running `npm run lifecycle`.

The script calls `enableNodeLocalAccountTransactions()` after creating each SDK client. This keeps viem's local account attached to `writeContract()` requests in Node.js so `approveToken()` and `checkpoint()` can send transactions through public RPC endpoints. Browser wallet apps do not need this shim.

Set `CLOSE_HOME_CHANNEL=true` only when you intentionally want to close the example home channel after the app-session lifecycle.
