---
sidebar_position: 2
sidebar_label: Quick Start
title: Quick Start
description: Build your first Yellow App in 5 minutes - a complete beginner's guide
keywords: [yellow sdk, quick start, tutorial, nitrolite, state channels, beginner guide]
displayed_sidebar: buildSidebar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start Guide

Build your first Yellow App in 5 minutes! This guide walks you through creating a simple payment application using state channels.

## What You'll Build

A basic payment app where users can:
- Deposit funds into a state channel
- Send instant payments to another user
- Withdraw remaining funds

No blockchain knowledge required - we'll handle the complexity for you!

## Prerequisites

- **Node.js 16+** installed on your computer
- **A wallet** (MetaMask recommended)
- **Basic JavaScript/TypeScript** knowledge

## Step 1: Installation

Create a new project and install the Yellow SDK:

<Tabs>
  <TabItem value="npm" label="npm">

```bash showLineNumbers
mkdir my-yellow-app
cd my-yellow-app
npm init -y
npm install @erc7824/nitrolite
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash showLineNumbers
mkdir my-yellow-app
cd my-yellow-app
yarn init -y
yarn add @erc7824/nitrolite
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash showLineNumbers
mkdir my-yellow-app
cd my-yellow-app
pnpm init
pnpm add @erc7824/nitrolite
```

  </TabItem>
</Tabs>

## Step 2: Connect to ClearNode

Create a file `app.js` and connect to the Yellow Network.

:::tip Clearnode Endpoints
- **Production**: `wss://clearnet.yellow.com/ws`
- **Sandbox**: `wss://clearnet-sandbox.yellow.com/ws` (recommended for testing)
:::

```javascript title="app.js" showLineNumbers
import { createAppSessionMessage, parseRPCResponse } from '@erc7824/nitrolite';

// Connect to Yellow Network (using sandbox for testing)
const ws = new WebSocket('wss://clearnet-sandbox.yellow.com/ws');

ws.onopen = () => {
  console.log('✅ Connected to Yellow Network!');
};

ws.onmessage = (event) => {
  const message = parseRPCResponse(event.data);
  console.log('📨 Received:', message);
};

ws.onerror = (error) => {
  console.error('Connection error:', error);
};

console.log('Connecting to Yellow Network...');
```

## Step 3: Create Application Session

Set up your wallet for signing messages:

```javascript showLineNumbers
// Set up message signer for your wallet
async function setupMessageSigner() {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  // Request wallet connection
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  
  const userAddress = accounts[0];
  
  // Create message signer function
  const messageSigner = async (message) => {
    return await window.ethereum.request({
      method: 'personal_sign',
      params: [message, userAddress]
    });
  };

  console.log('✅ Wallet connected:', userAddress);
  return { userAddress, messageSigner };
}
```

## Step 4: Create Application Session

Create a session for your payment app:

```javascript showLineNumbers
async function createPaymentSession(messageSigner, userAddress, partnerAddress) {
  // Define your payment application
  const appDefinition = {
    protocol: 'payment-app-v1',
    participants: [userAddress, partnerAddress],
    weights: [50, 50], // Equal participation
    quorum: 100, // Both participants must agree
    challenge: 0,
    nonce: Date.now()
  };

  // Initial balances (1 USDC = 1,000,000 units with 6 decimals)
  const allocations = [
    { participant: userAddress, asset: 'usdc', amount: '800000' }, // 0.8 USDC
    { participant: partnerAddress, asset: 'usdc', amount: '200000' } // 0.2 USDC
  ];

  // Create signed session message
  const sessionMessage = await createAppSessionMessage(
    messageSigner,
    [{ definition: appDefinition, allocations }]
  );

  // Send to ClearNode
  ws.send(sessionMessage);
  console.log('✅ Payment session created!');
  
  return { appDefinition, allocations };
}
```

## Step 5: Send Instant Payments

```javascript showLineNumbers
async function sendPayment(ws, messageSigner, amount, recipient) {
  // Create payment message
  const paymentData = {
    type: 'payment',
    amount: amount.toString(),
    recipient,
    timestamp: Date.now()
  };

  // Sign the payment
  const signature = await messageSigner(JSON.stringify(paymentData));
  
  const signedPayment = {
    ...paymentData,
    signature,
    sender: await getCurrentUserAddress()
  };

  // Send instantly through ClearNode
  ws.send(JSON.stringify(signedPayment));
  console.log('💸 Payment sent instantly!');
}

// Usage
await sendPayment(ws, messageSigner, 100000n, partnerAddress); // Send 0.1 USDC
```

## Step 6: Handle Incoming Messages

```javascript showLineNumbers
// Enhanced message handling
ws.onmessage = (event) => {
  const message = parseRPCResponse(event.data);
  
  switch (message.type) {
    case 'session_created':
      console.log('✅ Session confirmed:', message.sessionId);
      break;
      
    case 'payment':
      console.log('💰 Payment received:', message.amount);
      // Update your app's UI
      updateBalance(message.amount, message.sender);
      break;
      
    case 'session_message':
      console.log('📨 App message:', message.data);
      handleAppMessage(message);
      break;
      
    case 'error':
      console.error('❌ Error:', message.error);
      break;
  }
};

function updateBalance(amount, sender) {
  console.log(`Received ${amount} from ${sender}`);
  // Update your application state
}
```

## Complete Example

Here's a complete working example you can copy and run:

```javascript title="SimplePaymentApp.js" showLineNumbers
import { createAppSessionMessage, parseRPCResponse } from '@erc7824/nitrolite';

class SimplePaymentApp {
  constructor() {
    this.ws = null;
    this.messageSigner = null;
    this.userAddress = null;
    this.sessionId = null;
  }

  async init() {
    // Step 1: Set up wallet
    const { userAddress, messageSigner } = await this.setupWallet();
    this.userAddress = userAddress;
    this.messageSigner = messageSigner;
    
    // Step 2: Connect to ClearNode (sandbox for testing)
    this.ws = new WebSocket('wss://clearnet-sandbox.yellow.com/ws');
    
    this.ws.onopen = () => {
      console.log('🟢 Connected to Yellow Network!');
    };
    
    this.ws.onmessage = (event) => {
      this.handleMessage(parseRPCResponse(event.data));
    };
    
    return userAddress;
  }

  async setupWallet() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    const userAddress = accounts[0];
    const messageSigner = async (message) => {
      return await window.ethereum.request({
        method: 'personal_sign',
        params: [message, userAddress]
      });
    };

    return { userAddress, messageSigner };
  }

  async createSession(partnerAddress) {
    const appDefinition = {
      protocol: 'payment-app-v1',
      participants: [this.userAddress, partnerAddress],
      weights: [50, 50],
      quorum: 100,
      challenge: 0,
      nonce: Date.now()
    };

    const allocations = [
      { participant: this.userAddress, asset: 'usdc', amount: '800000' },
      { participant: partnerAddress, asset: 'usdc', amount: '200000' }
    ];

    const sessionMessage = await createAppSessionMessage(
      this.messageSigner,
      [{ definition: appDefinition, allocations }]
    );

    this.ws.send(sessionMessage);
    console.log('✅ Payment session created!');
  }

  async sendPayment(amount, recipient) {
    const paymentData = {
      type: 'payment',
      amount: amount.toString(),
      recipient,
      timestamp: Date.now()
    };

    const signature = await this.messageSigner(JSON.stringify(paymentData));
    
    this.ws.send(JSON.stringify({
      ...paymentData,
      signature,
      sender: this.userAddress
    }));
    
    console.log(`💸 Sent ${amount} instantly!`);
  }

  handleMessage(message) {
    switch (message.type) {
      case 'session_created':
        this.sessionId = message.sessionId;
        console.log('✅ Session ready:', this.sessionId);
        break;
      case 'payment':
        console.log('💰 Payment received:', message.amount);
        break;
    }
  }
}

// Usage
const app = new SimplePaymentApp();
await app.init();
await app.createSession('0xPartnerAddress');
await app.sendPayment('100000', '0xPartnerAddress'); // Send 0.1 USDC
```

## What's Next?

Congratulations! You've built your first Yellow App. Here's what to explore next:

- **[Advanced Topics](../../learn/advanced/architecture)**: Learn about architecture, multi-party applications, and production deployment
- **[API Reference](../../api-reference)**: Explore all available SDK methods and options

## Need Help?

- **Documentation**: Continue reading the guides for in-depth explanations
- **Community**: Join our developer community for support
- **Examples**: Check out our GitHub repository for sample applications

You're now ready to build fast, scalable apps with Yellow SDK!