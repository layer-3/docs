---
sidebar_position: 5
title: Production Deployment
description: Deploy Yellow Apps to production with confidence - configuration, optimization, and best practices
keywords: [production, deployment, configuration, optimization, mainnet, scaling]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Production Deployment

Deploy your Yellow App to production with confidence using battle-tested configurations and optimization strategies.

## Environment Configuration

<Tabs>
  <TabItem value="mainnet" label="Mainnet">

```javascript
// Production configuration for Polygon mainnet
const productionConfig = {
  chainId: 137,
  addresses: {
    custody: '0x...', // Production custody contract
    adjudicator: '0x...', // Your deployed adjudicator
    tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // USDC on Polygon
  },
  clearNodeUrl: 'wss://clearnet.yellow.com/ws',
  challengeDuration: 7200n, // 2 hours for mainnet
  reconnectConfig: {
    maxAttempts: 10,
    backoffMultiplier: 1.5,
    initialDelay: 1000
  }
};
```

  </TabItem>
  <TabItem value="testnet" label="Testnet">

```javascript
// Testnet configuration for development
const testnetConfig = {
  chainId: 80001, // Mumbai testnet
  addresses: {
    custody: '0x...', // Testnet custody contract
    adjudicator: '0x...', // Your test adjudicator
    tokenAddress: '0x...' // Test USDC
  },
  clearNodeUrl: 'wss://testnet.clearnet.yellow.com/ws',
  challengeDuration: 100n, // Shorter for testing
  reconnectConfig: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 500
  }
};
```

  </TabItem>
</Tabs>

## Error Handling & Recovery

### Robust Initialization

```javascript
class RobustYellowApp {
  constructor(config) {
    this.client = new NitroliteClient(config);
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = config.reconnectConfig.maxAttempts;
    this.backoffMultiplier = config.reconnectConfig.backoffMultiplier;
  }

  async initializeWithRetry() {
    try {
      await this.client.deposit(this.config.initialDeposit);
      const channel = await this.client.createChannel(this.config.channelParams);
      await this.connectToClearNode();
      return channel;
    } catch (error) {
      return this.handleInitializationError(error);
    }
  }

  async handleInitializationError(error) {
    switch (error.code) {
      case 'INSUFFICIENT_FUNDS':
        throw new UserError('Please add more funds to your wallet');
      
      case 'NETWORK_ERROR':
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = this.config.reconnectConfig.initialDelay * 
                       Math.pow(this.backoffMultiplier, this.reconnectAttempts);
          this.reconnectAttempts++;
          await this.delay(delay);
          return this.initializeWithRetry();
        }
        throw new NetworkError('Unable to connect after maximum attempts');
      
      case 'CONTRACT_ERROR':
        throw new ContractError('Smart contract interaction failed: ' + error.message);
      
      default:
        throw error;
    }
  }

  async connectToClearNode() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.config.clearNodeUrl);
      
      const connectionTimeout = setTimeout(() => {
        reject(new Error('ClearNode connection timeout'));
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        this.setupHeartbeat(ws);
        this.setupReconnectLogic(ws);
        resolve(ws);
      };

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        reject(error);
      };
    });
  }

  setupHeartbeat(ws) {
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);

    // Clear interval when WebSocket closes
    ws.addEventListener('close', () => {
      clearInterval(heartbeatInterval);
    });
  }

  setupReconnectLogic(ws) {
    ws.addEventListener('close', async (event) => {
      if (event.code !== 1000) { // Not a normal closure
        console.log('Connection lost, attempting to reconnect...');
        await this.delay(5000);
        await this.connectToClearNode();
      }
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Performance Optimization

### Batch Operations

```javascript
class OptimizedYellowApp {
  async batchDepositsAndChannels(operations) {
    // Prepare all transactions in parallel
    const preparationPromises = operations.map(async (op) => ({
      deposit: await this.client.prepareDeposit(op.amount),
      channel: await this.client.prepareCreateChannel(op.channelParams)
    }));
    
    const prepared = await Promise.all(preparationPromises);
    
    // Execute in optimized batches
    const batchSize = 5; // Adjust based on gas limits
    const results = [];
    
    for (let i = 0; i < prepared.length; i += batchSize) {
      const batch = prepared.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async ({ deposit, channel }) => {
          const depositTx = await this.client.executeTransaction(deposit);
          const channelTx = await this.client.executeTransaction(channel);
          return { deposit: depositTx, channel: channelTx };
        })
      );
      
      results.push(...batchResults);
    }
    
    return results;
  }

  async optimizeGasUsage() {
    // Estimate gas for common operations
    const gasEstimates = await Promise.all([
      this.client.estimateDeposit(1000000n),
      this.client.estimateCreateChannel(this.defaultChannelParams),
      this.client.estimateCloseChannel(this.defaultCloseParams)
    ]);

    // Adjust gas limits based on network conditions
    const gasMultiplier = await this.getNetworkCongestionMultiplier();
    
    return {
      deposit: gasEstimates[0] * gasMultiplier,
      createChannel: gasEstimates[1] * gasMultiplier,
      closeChannel: gasEstimates[2] * gasMultiplier
    };
  }
}
```

### Memory-Efficient State Storage

```javascript
class CompactStateStorage {
  constructor() {
    this.stateHashes = new Map(); // Store only hashes
    this.criticalStates = new Map(); // Store full critical states
    this.compressionLevel = 9; // High compression for storage
  }

  storeState(channelId, state) {
    const stateHash = keccak256(JSON.stringify(state));
    
    // Always store hash for validation
    this.stateHashes.set(`${channelId}-${state.version}`, stateHash);
    
    // Store full state only for checkpoints and final states
    if (this.isCriticalState(state)) {
      const compressed = this.compressState(state);
      this.criticalStates.set(`${channelId}-${state.version}`, compressed);
    }
  }

  isCriticalState(state) {
    return state.intent === StateIntent.INITIALIZE ||
           state.intent === StateIntent.FINALIZE ||
           state.version % 100 === 0; // Every 100th state
  }

  compressState(state) {
    // Implement compression logic for storage efficiency
    return JSON.stringify(state); // Placeholder
  }
}
```

## Infrastructure Setup

### Load Balancing

```javascript
class LoadBalancedConnection {
  constructor(clearNodeUrls) {
    this.clearNodeUrls = clearNodeUrls;
    this.connectionPool = new Map();
    this.currentIndex = 0;
  }

  async getConnection() {
    const url = this.getNextUrl();
    
    if (!this.connectionPool.has(url)) {
      const ws = await this.createConnection(url);
      this.connectionPool.set(url, ws);
    }
    
    return this.connectionPool.get(url);
  }

  getNextUrl() {
    const url = this.clearNodeUrls[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.clearNodeUrls.length;
    return url;
  }

  async healthCheck() {
    const healthPromises = this.clearNodeUrls.map(async (url) => {
      try {
        const ws = await this.createConnection(url);
        ws.close();
        return { url, healthy: true, latency: Date.now() };
      } catch (error) {
        return { url, healthy: false, error: error.message };
      }
    });

    return Promise.all(healthPromises);
  }
}
```

### Caching Strategy

```javascript
class IntelligentCache {
  constructor() {
    this.stateCache = new LRUCache(1000); // Most recent states
    this.channelCache = new LRUCache(100); // Channel info
    this.accountCache = new LRUCache(50);  // Account data
  }

  async getAccountInfo(address, maxAge = 30000) {
    const cacheKey = `account:${address}`;
    const cached = this.accountCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data;
    }

    const fresh = await this.client.getAccountInfo();
    this.accountCache.set(cacheKey, {
      data: fresh,
      timestamp: Date.now()
    });

    return fresh;
  }

  invalidateChannel(channelId) {
    // Remove all related cache entries
    this.channelCache.delete(`channel:${channelId}`);
    this.stateCache.delete(`latest:${channelId}`);
  }
}
```

## Deployment Pipeline

### Automated Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy Yellow App

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Deploy contracts
        run: |
          npx hardhat deploy --network polygon
          npx hardhat verify --network polygon
        env:
          PRIVATE_KEY: ${{ secrets.DEPLOYER_PRIVATE_KEY }}
          POLYGONSCAN_API_KEY: ${{ secrets.POLYGONSCAN_API_KEY }}
          
      - name: Deploy frontend
        run: |
          npm run build
          aws s3 sync ./build s3://${{ secrets.S3_BUCKET }}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Environment Management

```javascript
// config/production.js
export const productionConfig = {
  contracts: {
    custody: process.env.CUSTODY_CONTRACT_ADDRESS,
    adjudicator: process.env.ADJUDICATOR_CONTRACT_ADDRESS,
    tokenAddress: process.env.TOKEN_CONTRACT_ADDRESS
  },
  network: {
    chainId: parseInt(process.env.CHAIN_ID),
    rpcUrl: process.env.RPC_URL,
    clearNodeUrls: process.env.CLEARNODE_URLS.split(',')
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};
```

## Monitoring Setup

### Health Checks

```javascript
class ProductionHealthCheck {
  constructor(client) {
    this.client = client;
    this.healthMetrics = {
      lastSuccessfulDeposit: null,
      lastSuccessfulChannel: null,
      connectionUptime: 0,
      errorRate: 0
    };
  }

  async runHealthCheck() {
    const checks = [
      this.checkContractConnectivity(),
      this.checkClearNodeConnectivity(),
      this.checkAccountAccess(),
      this.checkGasEstimation()
    ];

    const results = await Promise.allSettled(checks);
    
    return {
      healthy: results.every(r => r.status === 'fulfilled'),
      checks: results.map((r, i) => ({
        name: this.getCheckName(i),
        status: r.status,
        error: r.reason?.message
      })),
      timestamp: Date.now()
    };
  }

  async checkContractConnectivity() {
    const balance = await this.client.getTokenBalance();
    return balance !== null;
  }

  async checkClearNodeConnectivity() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.config.clearNodeUrl);
      const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      };
      
      ws.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Connection failed'));
      };
    });
  }
}
```

### Logging and Alerting

```javascript
class ProductionLogger {
  constructor(config) {
    this.logger = winston.createLogger({
      level: config.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  logChannelEvent(event, channelId, data) {
    this.logger.info('Channel event', {
      event,
      channelId,
      data,
      timestamp: Date.now()
    });
  }

  logError(error, context) {
    this.logger.error('Application error', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
    
    // Send to alerting system
    this.sendAlert('ERROR', error.message, context);
  }

  async sendAlert(level, message, context) {
    // Integration with alerting services (PagerDuty, Slack, etc.)
    if (level === 'ERROR' || level === 'CRITICAL') {
      await this.notifyOnCall(message, context);
    }
  }
}
```

## Scaling Strategies

### Horizontal Scaling

```javascript
class HorizontalScaler {
  constructor() {
    this.instances = new Map();
    this.loadBalancer = new LoadBalancer();
  }

  async scaleUp(requiredCapacity) {
    const currentCapacity = this.getCurrentCapacity();
    
    if (requiredCapacity > currentCapacity) {
      const additionalInstances = Math.ceil(
        (requiredCapacity - currentCapacity) / this.instanceCapacity
      );
      
      await this.deployInstances(additionalInstances);
    }
  }

  async deployInstances(count) {
    const deploymentPromises = Array(count).fill().map(() => 
      this.deployInstance()
    );
    
    const newInstances = await Promise.all(deploymentPromises);
    
    newInstances.forEach(instance => {
      this.instances.set(instance.id, instance);
      this.loadBalancer.addInstance(instance);
    });
  }

  async deployInstance() {
    // Deploy new application instance
    return {
      id: generateInstanceId(),
      client: new NitroliteClient(this.config),
      capacity: this.instanceCapacity,
      status: 'healthy'
    };
  }
}
```

### Database Optimization

```javascript
class OptimizedStateStorage {
  constructor(dbConfig) {
    this.db = new Database(dbConfig);
    this.setupIndexes();
  }

  async setupIndexes() {
    // Optimize queries for common patterns
    await this.db.createIndex('states', ['channelId', 'version']);
    await this.db.createIndex('states', ['channelId', 'intent']);
    await this.db.createIndex('channels', ['participants']);
    await this.db.createIndex('transactions', ['timestamp', 'status']);
  }

  async storeStateOptimized(channelId, state) {
    const compressed = await this.compressState(state);
    
    // Store with proper indexing
    await this.db.transaction(async (tx) => {
      await tx.states.insert({
        channelId,
        version: state.version,
        intent: state.intent,
        data: compressed,
        timestamp: Date.now()
      });
      
      // Update latest state cache
      await tx.channels.update(
        { id: channelId },
        { latestVersion: state.version, lastActivity: Date.now() }
      );
    });
  }
}
```

## Security in Production

### Key Management

```javascript
class ProductionKeyManager {
  constructor() {
    this.keyVault = new AzureKeyVault(); // or AWS KMS, HashiCorp Vault
    this.localCache = new Map();
  }

  async getSigningKey(channelId) {
    // Check local cache first
    if (this.localCache.has(channelId)) {
      return this.localCache.get(channelId);
    }

    // Fetch from secure vault
    const key = await this.keyVault.getSecret(`channel-${channelId}`);
    
    // Cache for limited time
    this.localCache.set(channelId, key);
    setTimeout(() => {
      this.localCache.delete(channelId);
    }, 300000); // 5 minutes

    return key;
  }

  async rotateKeys(channelId) {
    const newKey = await this.generateKey();
    await this.keyVault.setSecret(`channel-${channelId}`, newKey);
    this.localCache.delete(channelId); // Clear cache
    return newKey;
  }
}
```

### Rate Limiting

```javascript
class RateLimiter {
  constructor() {
    this.limits = new Map();
    this.windowSize = 60000; // 1 minute windows
  }

  async checkLimit(identifier, limit) {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    
    if (!this.limits.has(identifier)) {
      this.limits.set(identifier, []);
    }
    
    const requests = this.limits.get(identifier);
    
    // Remove old requests
    const recentRequests = requests.filter(time => time > windowStart);
    this.limits.set(identifier, recentRequests);
    
    if (recentRequests.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    // Add current request
    recentRequests.push(now);
    return true;
  }
}
```

## Deployment Checklist

### Pre-Production

- [ ] **Contracts Audited**: Security audit completed by reputable firm
- [ ] **Gas Optimization**: All transactions optimized for cost
- [ ] **Error Handling**: Comprehensive error recovery implemented
- [ ] **State Validation**: All state transitions validated
- [ ] **Key Management**: Secure key storage and rotation
- [ ] **Monitoring**: Health checks and alerting configured
- [ ] **Testing**: Full integration test suite passing
- [ ] **Load Testing**: Performance validated under expected load
- [ ] **Documentation**: User guides and API docs complete

### Production

- [ ] **Mainnet Contracts**: Deployed and verified on block explorers
- [ ] **ClearNode Connection**: Production endpoints configured
- [ ] **Backup Systems**: Redundancy and failover implemented
- [ ] **User Support**: Documentation and support channels ready
- [ ] **Incident Response**: Monitoring and response procedures documented
- [ ] **Upgrade Path**: Contract upgrade strategy defined
- [ ] **Compliance**: Regulatory requirements addressed
- [ ] **Insurance**: Consider smart contract insurance
- [ ] **Legal Review**: Terms of service and liability reviewed

### Post-Deployment

- [ ] **Monitoring Active**: All systems being monitored 24/7
- [ ] **Alerts Configured**: Team notified of critical issues
- [ ] **Backup Verified**: Disaster recovery tested
- [ ] **Performance Baseline**: Metrics baseline established
- [ ] **User Feedback**: Feedback collection system active
- [ ] **Update Process**: Smooth update and rollback procedures
- [ ] **Security Monitoring**: Anomaly detection active
- [ ] **Capacity Planning**: Growth projections and scaling plans

## Disaster Recovery

### Backup Strategies

```javascript
class DisasterRecovery {
  constructor() {
    this.backupSchedule = new CronJob('0 */6 * * *', this.performBackup.bind(this));
    this.recoveryPlan = new RecoveryPlan();
  }

  async performBackup() {
    // Backup critical state data
    const criticalStates = await this.getCriticalStates();
    await this.uploadToSecureStorage(criticalStates);
    
    // Backup channel configurations
    const channelConfigs = await this.getChannelConfigurations();
    await this.uploadToSecureStorage(channelConfigs);
    
    // Verify backup integrity
    await this.verifyBackupIntegrity();
  }

  async emergencyRecovery(backupTimestamp) {
    // 1. Stop all active operations
    await this.gracefulShutdown();
    
    // 2. Restore from backup
    const backup = await this.downloadBackup(backupTimestamp);
    await this.restoreState(backup);
    
    // 3. Validate restored state
    await this.validateRestoredState();
    
    // 4. Resume operations
    await this.resumeOperations();
  }
}
```

Following these production deployment practices ensures your Yellow App can handle real-world usage with confidence, security, and reliability.