---
sidebar_position: 3
title: Multi-Party Applications
description: Complex scenarios with multiple participants and application patterns
keywords: [multi-party, applications, consensus, state channels, patterns]
displayed_sidebar: learnSidebar
---

# Multi-Party Applications

Build sophisticated applications with multiple participants using Yellow SDK's flexible channel architecture.

## Three-Party Applications

### Escrow Pattern

Perfect for marketplace transactions with buyer, seller, and mediator:

### Escrow Application Session

```javascript
import { createAppSessionMessage } from '@erc7824/nitrolite';

async function createEscrowSession(buyer, seller, mediator, amount) {
  const appDefinition = {
    protocol: 'escrow-v1',
    participants: [buyer, seller, mediator],
    weights: [33, 33, 34], // Equal voting with mediator tiebreaker
    quorum: 67, // Requires 2 of 3 consensus
    challenge: 0,
    nonce: Date.now()
  };

  const allocations = [
    { participant: buyer, asset: 'usdc', amount: amount.toString() },
    { participant: seller, asset: 'usdc', amount: '0' },
    { participant: mediator, asset: 'usdc', amount: '0' }
  ];

  return createAppSessionMessage(messageSigner, [{
    definition: appDefinition,
    allocations
  }]);
}
```

## Tournament Structure

Multi-player competitive applications with prize distribution:

```javascript
async function createTournament(players, entryFee, messageSigner) {
  // Create application session for tournament logic
  const appDefinition = {
    protocol: 'tournament-v1',
    participants: [...players, houseAddress],
    weights: [...players.map(() => 0), 100], // House controls tournament
    quorum: 100,
    challenge: 0,
    nonce: Date.now()
  };

  const allocations = players.map(player => ({
    participant: player,
    asset: 'usdc',
    amount: entryFee.toString()
  })).concat([{
    participant: houseAddress,
    asset: 'usdc',
    amount: '0'
  }]);

  const tournamentMessage = await createAppSessionMessage(messageSigner, [{
    definition: appDefinition,
    allocations
  }]);

  // Send to ClearNode
  ws.send(tournamentMessage);
  console.log('🎮 Tournament session created!');

  return appDefinition;
}
```

## Consensus Mechanisms

### Weighted Voting

Different participants can have different voting power:

```javascript
const governanceSession = {
  protocol: 'governance-v1',
  participants: [admin, moderator1, moderator2, user1, user2],
  weights: [40, 20, 20, 10, 10], // Admin has 40% vote
  quorum: 60, // Requires 60% consensus
  challenge: 0,
  nonce: Date.now()
};
```

### Multi-Signature Requirements

```javascript
const multiSigSession = {
  protocol: 'multisig-v1',
  participants: [signer1, signer2, signer3, beneficiary],
  weights: [33, 33, 34, 0], // 3 signers, 1 beneficiary
  quorum: 67, // Requires 2 of 3 signatures
  challenge: 0,
  nonce: Date.now()
};
```

## Application Patterns

### Payment Routing

Route payments through multiple sessions for optimal liquidity:

```javascript
class PaymentRouter {
  constructor() {
    this.sessions = new Map(); // route -> sessionId
    this.liquidity = new Map(); // sessionId -> available amounts
    this.ws = null;
    this.messageSigner = null;
  }

  async routePayment(amount, recipient) {
    // Find optimal path considering liquidity and fees
    const path = await this.findOptimalPath(this.userAddress, recipient, amount);
    
    if (path.length === 1) {
      // Direct session exists
      return this.sendDirectPayment(path[0], amount, recipient);
    } else {
      // Multi-hop payment required
      return this.executeMultiHopPayment(path, amount, recipient);
    }
  }

  async sendDirectPayment(sessionId, amount, recipient) {
    const paymentMessage = {
      sessionId,
      type: 'payment',
      amount: amount.toString(),
      recipient,
      timestamp: Date.now()
    };

    const signature = await this.messageSigner(JSON.stringify(paymentMessage));
    
    this.ws.send(JSON.stringify({
      ...paymentMessage,
      signature
    }));

    return paymentMessage;
  }
}
```

### State Synchronization

Keep multiple channels synchronized for complex applications:

```javascript
class ChannelSynchronizer {
  constructor() {
    this.channels = new Map();
    this.syncGroups = new Map();
  }

  addToSyncGroup(groupId, channelId) {
    if (!this.syncGroups.has(groupId)) {
      this.syncGroups.set(groupId, new Set());
    }
    this.syncGroups.get(groupId).add(channelId);
  }

  async syncStateUpdate(groupId, stateUpdate) {
    const channels = this.syncGroups.get(groupId);
    
    // Apply update to all channels in sync group
    const updatePromises = Array.from(channels).map(channelId =>
      this.applyStateUpdate(channelId, stateUpdate)
    );

    const results = await Promise.allSettled(updatePromises);
    
    // Handle any failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      await this.handleSyncFailures(groupId, failures);
    }

    return results;
  }
}
```

## ClearNode Integration

### Multi-Session Management

```javascript
class MultiSessionManager {
  constructor() {
    this.connections = new Map(); // sessionId -> WebSocket
    this.sessions = new Map();    // sessionId -> sessionData
    this.messageSigner = null;
  }

  async connectToSession(sessionConfig) {
    const ws = new WebSocket('wss://clearnet.yellow.com/ws');
    
    return new Promise((resolve, reject) => {
      ws.onopen = async () => {
        // Create application session
        const sessionMessage = await createAppSessionMessage(
          this.messageSigner,
          [sessionConfig]
        );
        
        ws.send(sessionMessage);
        
        const sessionId = this.generateSessionId();
        this.connections.set(sessionId, ws);
        this.sessions.set(sessionId, sessionConfig);
        
        resolve({ ws, sessionId });
      };
      
      ws.onerror = reject;
      
      ws.onmessage = (event) => {
        this.handleSessionMessage(sessionId, parseRPCResponse(event.data));
      };
    });
  }

  async broadcastToAllSessions(message) {
    const broadcasts = Array.from(this.connections.entries()).map(([sessionId, ws]) => {
      if (ws.readyState === WebSocket.OPEN) {
        const signature = await this.messageSigner(JSON.stringify(message));
        return ws.send(JSON.stringify({ ...message, signature }));
      }
    });

    return Promise.allSettled(broadcasts);
  }

  handleSessionMessage(sessionId, message) {
    // Route messages based on session and message type
    switch (message.type) {
      case 'session_created':
        this.handleSessionCreated(sessionId, message.data);
        break;
      case 'participant_message':
        this.handleParticipantMessage(sessionId, message.data);
        break;
      case 'error':
        this.handleSessionError(sessionId, message.error);
        break;
    }
  }
}
```

### Session Management

```javascript
class SessionManager {
  constructor() {
    this.activeSessions = new Map();
    this.sessionParticipants = new Map();
  }

  async createMultiPartySession(participants, sessionConfig) {
    const appDefinition = {
      protocol: sessionConfig.protocol,
      participants,
      weights: sessionConfig.weights || participants.map(() => 100 / participants.length),
      quorum: sessionConfig.quorum || 51,
      challenge: 0,
      nonce: Date.now()
    };

    const allocations = participants.map((participant, index) => ({
      participant,
      asset: sessionConfig.asset || 'usdc',
      amount: sessionConfig.initialAmounts?.[index]?.toString() || '0'
    }));

    const sessionMessage = await createAppSessionMessage(
      this.messageSigner,
      [{ definition: appDefinition, allocations }]
    );

    // Send to all participants' connections
    await this.broadcastSessionCreation(participants, sessionMessage);
    
    return this.waitForSessionConfirmation();
  }

  async coordinateStateUpdate(sessionId, updateData) {
    const session = this.activeSessions.get(sessionId);
    const participants = this.sessionParticipants.get(sessionId);

    // Create coordinated update message
    const updateMessage = {
      type: 'coordinate_update',
      sessionId,
      data: updateData,
      requiredSignatures: this.calculateRequiredSignatures(session),
      timestamp: Date.now()
    };

    // Send to all participants
    await this.broadcastToParticipants(participants, updateMessage);
    
    // Wait for consensus
    return this.waitForConsensus(sessionId, updateMessage.timestamp);
  }
}
```

## Advanced Patterns

### Channel Hierarchies

Create parent-child relationships between channels:

```javascript
class HierarchicalChannels {
  constructor(client) {
    this.client = client;
    this.parentChannels = new Map();
    this.childChannels = new Map();
  }

  async createParentChannel(participants, totalCapacity) {
    const parentChannel = await this.client.createChannel({
      participants: [...participants, this.coordinatorAddress],
      initialAllocationAmounts: [...totalCapacity, 0n],
      stateData: '0x'
    });

    this.parentChannels.set(parentChannel.channelId, {
      participants,
      totalCapacity,
      childChannels: new Set()
    });

    return parentChannel;
  }

  async createChildChannel(parentChannelId, subset, allocation) {
    const parent = this.parentChannels.get(parentChannelId);
    
    // Validate subset is from parent participants
    if (!subset.every(addr => parent.participants.includes(addr))) {
      throw new Error('Child participants must be subset of parent');
    }

    const childChannel = await this.client.createChannel({
      participants: subset,
      initialAllocationAmounts: allocation,
      stateData: this.encodeParentReference(parentChannelId)
    });

    // Link to parent
    parent.childChannels.add(childChannel.channelId);
    this.childChannels.set(childChannel.channelId, parentChannelId);

    return childChannel;
  }
}
```

### Cross-Channel Coordination

Coordinate state updates across multiple related channels:

```javascript
class CrossChannelCoordinator {
  constructor() {
    this.channelGroups = new Map();
    this.pendingUpdates = new Map();
  }

  async coordinateAcrossChannels(groupId, operation) {
    const channels = this.channelGroups.get(groupId);
    
    // Prepare updates for all channels
    const updatePromises = channels.map(channelId =>
      this.prepareChannelUpdate(channelId, operation)
    );

    const preparedUpdates = await Promise.all(updatePromises);
    
    // Execute all updates atomically
    try {
      const results = await this.executeAtomicUpdates(preparedUpdates);
      return results;
    } catch (error) {
      // Rollback all updates on failure
      await this.rollbackUpdates(preparedUpdates);
      throw error;
    }
  }

  async executeAtomicUpdates(updates) {
    // Use two-phase commit protocol
    
    // Phase 1: Prepare all updates
    const preparePromises = updates.map(update =>
      this.prepareUpdate(update)
    );
    
    const prepared = await Promise.all(preparePromises);
    
    // Phase 2: Commit all updates
    const commitPromises = prepared.map(prep =>
      this.commitUpdate(prep)
    );
    
    return Promise.all(commitPromises);
  }
}
```

## Real-World Applications

### Gaming Lobby System

```javascript
class GamingLobby {
  constructor() {
    this.gameRooms = new Map();
    this.playerQueues = new Map();
    this.ws = null;
    this.messageSigner = null;
  }

  async createGameRoom(gameType, maxPlayers, buyIn) {
    const roomId = this.generateRoomId();
    
    this.gameRooms.set(roomId, {
      gameType,
      maxPlayers,
      buyIn,
      players: [],
      status: 'WAITING'
    });

    // Broadcast room creation
    const roomMessage = {
      type: 'room_created',
      roomId,
      gameType,
      maxPlayers,
      buyIn,
      timestamp: Date.now()
    };

    const signature = await this.messageSigner(JSON.stringify(roomMessage));
    this.ws.send(JSON.stringify({ ...roomMessage, signature }));

    return roomId;
  }

  async joinGameRoom(roomId, playerAddress) {
    const room = this.gameRooms.get(roomId);
    
    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    room.players.push(playerAddress);

    // Start game when room is full
    if (room.players.length === room.maxPlayers) {
      await this.startGame(roomId);
    }

    return room;
  }

  async startGame(roomId) {
    const room = this.gameRooms.get(roomId);
    
    // Create game application session
    const appDefinition = {
      protocol: `${room.gameType}-v1`,
      participants: [...room.players, this.serverAddress],
      weights: [...room.players.map(() => 0), 100], // Server controls game
      quorum: 100,
      challenge: 0,
      nonce: Date.now()
    };

    const allocations = room.players.map(player => ({
      participant: player,
      asset: 'usdc',
      amount: room.buyIn.toString()
    })).concat([{
      participant: this.serverAddress,
      asset: 'usdc',
      amount: '0'
    }]);

    const gameSession = await createAppSessionMessage(this.messageSigner, [{
      definition: appDefinition,
      allocations
    }]);

    this.ws.send(gameSession);
    
    room.status = 'ACTIVE';
    room.sessionId = this.generateSessionId();

    return room;
  }
}
```

### Subscription Service

```javascript
class SubscriptionService {
  constructor() {
    this.subscriptions = new Map();
    this.ws = null;
    this.messageSigner = null;
  }

  async createSubscription(subscriber, provider, monthlyFee) {
    const appDefinition = {
      protocol: 'subscription-v1',
      participants: [subscriber, provider, this.serviceAddress],
      weights: [0, 100, 0], // Provider controls service delivery
      quorum: 100,
      challenge: 0,
      nonce: Date.now()
    };

    const allocations = [
      { participant: subscriber, asset: 'usdc', amount: (monthlyFee * 12).toString() },
      { participant: provider, asset: 'usdc', amount: '0' },
      { participant: this.serviceAddress, asset: 'usdc', amount: '0' }
    ];

    const sessionMessage = await createAppSessionMessage(this.messageSigner, [{
      definition: appDefinition,
      allocations
    }]);

    // Send to ClearNode
    this.ws.send(sessionMessage);
    
    const subscriptionId = this.generateSubscriptionId();
    this.subscriptions.set(subscriptionId, {
      subscriber,
      provider,
      monthlyFee,
      createdAt: Date.now()
    });

    return subscriptionId;
  }

  async processMonthlyPayment(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    
    // Create payment message for this month
    const paymentMessage = {
      type: 'monthly_payment',
      subscriptionId,
      amount: subscription.monthlyFee,
      month: this.getCurrentMonth(),
      timestamp: Date.now()
    };

    const signature = await this.messageSigner(JSON.stringify(paymentMessage));
    
    this.ws.send(JSON.stringify({
      ...paymentMessage,
      signature
    }));

    return this.waitForPaymentConfirmation(subscriptionId);
  }
}
```

## Best Practices

### Participant Management

```javascript
class ParticipantManager {
  constructor() {
    this.participants = new Map();
    this.roles = new Map();
  }

  addParticipant(address, role, permissions) {
    this.participants.set(address, {
      role,
      permissions: new Set(permissions),
      joinedAt: Date.now(),
      status: 'ACTIVE'
    });
  }

  validateParticipantAction(address, action) {
    const participant = this.participants.get(address);
    if (!participant) {
      throw new Error('Unknown participant');
    }

    if (!participant.permissions.has(action)) {
      throw new Error(`Insufficient permissions for action: ${action}`);
    }

    return true;
  }

  async rotateParticipant(oldAddress, newAddress) {
    const participant = this.participants.get(oldAddress);
    
    // Transfer permissions to new address
    this.participants.set(newAddress, {
      ...participant,
      previousAddress: oldAddress,
      rotatedAt: Date.now()
    });

    // Mark old address as rotated
    participant.status = 'ROTATED';
    participant.rotatedTo = newAddress;
  }
}
```

### Message Broadcasting

```javascript
class MessageBroadcaster {
  constructor() {
    this.connections = new Map();
    this.messageQueue = new Map();
  }

  async broadcastToParticipants(participants, message) {
    const deliveryPromises = participants.map(async (participant) => {
      const connection = this.connections.get(participant);
      
      if (!connection || connection.readyState !== WebSocket.OPEN) {
        // Queue message for later delivery
        this.queueMessage(participant, message);
        return { participant, status: 'QUEUED' };
      }

      try {
        connection.send(JSON.stringify(message));
        return { participant, status: 'DELIVERED' };
      } catch (error) {
        this.queueMessage(participant, message);
        return { participant, status: 'FAILED', error: error.message };
      }
    });

    return Promise.all(deliveryPromises);
  }

  queueMessage(participant, message) {
    if (!this.messageQueue.has(participant)) {
      this.messageQueue.set(participant, []);
    }
    
    this.messageQueue.get(participant).push({
      message,
      timestamp: Date.now(),
      retries: 0
    });
  }

  async deliverQueuedMessages(participant) {
    const queue = this.messageQueue.get(participant);
    if (!queue || queue.length === 0) return;

    const connection = this.connections.get(participant);
    if (!connection || connection.readyState !== WebSocket.OPEN) return;

    // Deliver all queued messages
    for (const queued of queue) {
      try {
        connection.send(JSON.stringify(queued.message));
      } catch (error) {
        queued.retries++;
        if (queued.retries < 3) {
          continue; // Keep in queue for retry
        }
      }
    }

    // Clear delivered messages
    this.messageQueue.set(participant, 
      queue.filter(msg => msg.retries >= 3)
    );
  }
}
```

Multi-party applications enable sophisticated logic while maintaining the performance benefits of state channels. Focus on application logic and participant coordination rather than low-level protocol details.