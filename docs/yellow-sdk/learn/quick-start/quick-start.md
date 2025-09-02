---
sidebar_position: 2
---

# Quick Start Guide

Get started with Yellow SDK in minutes.

## Installation

```bash
npm install @erc7824/nitrolite
```

## Configuration

Configure your Yellow Nitrolite Client instance:

```javascript
import { NitroliteClient } from '@erc7824/nitrolite';

// Initialize client
const nitroliteClient = new NitroliteClient({
  publicClient,
  walletClient,
  addresses: {
    custody: '0x...',
    adjudicator: '0x...',
    guestAddress: '0x...',
    tokenAddress: '0x...'
  },
  chainId: 137, // Polygon mainnet
  challengeDuration: 100n
});
```

## Basic Usage

### Connect to a Clearnode

```javascript
// Import your preferred WebSocket library
import WebSocket from 'ws'; // Node.js
// or use the browser's built-in WebSocket

// Create a WebSocket connection to the ClearNode
const ws = new WebSocket('wss://clearnode.example.com');

// Set up basic event handlers
ws.onopen = () => {
  console.log('WebSocket connection established');
  // Connection is open, can now proceed with authentication
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received message:', message);
  // Process incoming messages
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log(`WebSocket closed: ${event.code} ${event.reason}`);
};
```

## Next Steps

- Learn about [Advanced Usage](../advanced.md)
- Check out the [API Reference](../advanced.md#api-reference)