---
sidebar_position: 6
title: Security Best Practices
description: Secure your Yellow Apps with proper authentication, key management, and monitoring
keywords: [security, authentication, key management, best practices, yellow apps]
---

# Security Best Practices

Secure your Yellow Apps with proper authentication, robust key management, and proactive monitoring.

## Authentication & Authorization

### Wallet Integration Security

```javascript
class WalletSecurity {
  constructor() {
    this.authorizedSessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  async authenticateUser(walletAddress) {
    // Verify wallet connection
    if (!window.ethereum) {
      throw new Error('No wallet provider found');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts.includes(walletAddress)) {
      throw new SecurityError('Wallet not authorized');
    }

    // Create session
    const sessionId = this.generateSessionId();
    this.authorizedSessions.set(sessionId, {
      address: walletAddress,
      createdAt: Date.now(),
      lastActivity: Date.now()
    });

    // Auto-expire session
    setTimeout(() => {
      this.authorizedSessions.delete(sessionId);
    }, this.sessionTimeout);

    return sessionId;
  }

  validateSession(sessionId) {
    const session = this.authorizedSessions.get(sessionId);
    if (!session) {
      throw new SecurityError('Invalid or expired session');
    }

    // Update last activity
    session.lastActivity = Date.now();
    return session;
  }
}
```

### Environment Configuration

```javascript
class SecureConfig {
  constructor() {
    this.requiredVars = [
      'CLEARNODE_ENDPOINT',
      'CUSTODY_ADDRESS',
      'ADJUDICATOR_ADDRESS'
    ];
  }

  validateEnvironment() {
    // Check required environment variables
    for (const varName of this.requiredVars) {
      if (!process.env[varName]) {
        throw new ConfigError(`Missing required environment variable: ${varName}`);
      }
    }

    // Validate addresses
    if (!this.isValidAddress(process.env.CUSTODY_ADDRESS)) {
      throw new ConfigError('Invalid custody contract address');
    }

    return {
      clearNodeEndpoint: process.env.CLEARNODE_ENDPOINT,
      custodyAddress: process.env.CUSTODY_ADDRESS,
      adjudicatorAddress: process.env.ADJUDICATOR_ADDRESS,
      environment: process.env.NODE_ENV || 'development'
    };
  }

  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}
```

## Input Validation & Sanitization

### User Input Security

```javascript
class InputValidator {
  validateChannelParams(params) {
    return {
      participants: this.validateAddresses(params.participants),
      amount: this.validateAmount(params.amount),
      sessionData: this.sanitizeSessionData(params.sessionData)
    };
  }

  validateAddresses(addresses) {
    if (!Array.isArray(addresses) || addresses.length < 2) {
      throw new ValidationError('Invalid participants array');
    }

    return addresses.map(addr => {
      if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        throw new ValidationError(`Invalid address: ${addr}`);
      }
      return addr.toLowerCase();
    });
  }

  validateAmount(amount) {
    const bigIntValue = BigInt(amount);
    
    if (bigIntValue <= 0n) {
      throw new ValidationError('Amount must be positive');
    }
    
    if (bigIntValue > BigInt('1000000000000000000000')) { // 1000 tokens max
      throw new ValidationError('Amount exceeds maximum limit');
    }
    
    return bigIntValue;
  }

  sanitizeSessionData(data) {
    if (!data) return '';
    
    // Remove potentially malicious content
    const sanitized = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Validate size limits
    if (sanitized.length > 64 * 1024) { // 64KB limit
      throw new ValidationError('Session data too large');
    }
    
    return sanitized;
  }
}
```

## Error Handling

### Secure Error Responses

```javascript
class SecureErrorHandler {
  constructor() {
    this.errorLogs = new Map();
  }

  handleError(error, context) {
    // Log detailed error internally
    this.logError(error, context);
    
    // Return sanitized error to user
    return this.sanitizeError(error);
  }

  sanitizeError(error) {
    // Remove sensitive information from error messages
    const safeErrors = {
      'ValidationError': 'Invalid input parameters',
      'SecurityError': 'Authentication failed',
      'NetworkError': 'Connection issue',
      'TimeoutError': 'Request timed out'
    };

    return {
      message: safeErrors[error.constructor.name] || 'An error occurred',
      code: this.getErrorCode(error),
      timestamp: Date.now()
    };
  }

  logError(error, context) {
    const errorEntry = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      severity: this.getErrorSeverity(error)
    };

    // Store securely (never expose to client)
    this.errorLogs.set(this.generateErrorId(), errorEntry);
  }
}
```

## Rate Limiting & Protection

### DDoS Protection

```javascript
class RateLimiter {
  constructor() {
    this.requestCounts = new Map();
    this.limits = {
      perMinute: 100,
      perHour: 1000,
      perDay: 10000
    };
  }

  async checkRateLimit(userAddress, action) {
    const key = `${userAddress}:${action}`;
    const now = Date.now();
    
    // Clean old entries
    this.cleanupOldEntries(now);
    
    const userRequests = this.requestCounts.get(key) || [];
    
    // Check minute limit
    const minuteCount = userRequests.filter(t => now - t < 60000).length;
    if (minuteCount >= this.limits.perMinute) {
      throw new SecurityError('Rate limit exceeded');
    }
    
    // Record request
    userRequests.push(now);
    this.requestCounts.set(key, userRequests);
    
    return true;
  }

  cleanupOldEntries(now) {
    const dayAgo = now - 24 * 60 * 60 * 1000;
    
    for (const [key, requests] of this.requestCounts) {
      const filtered = requests.filter(t => t > dayAgo);
      if (filtered.length === 0) {
        this.requestCounts.delete(key);
      } else {
        this.requestCounts.set(key, filtered);
      }
    }
  }
}
```

## Monitoring & Logging

### Application Monitoring

```javascript
class SecurityMonitor {
  constructor() {
    this.metrics = new Map();
    this.alerts = new Set();
  }

  trackUserActivity(userAddress, action, details) {
    const key = `${userAddress}:${action}`;
    const activity = {
      timestamp: Date.now(),
      action,
      details,
      userAgent: details.userAgent,
      ipAddress: details.ipAddress
    };

    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    this.metrics.get(key).push(activity);
    
    // Check for suspicious patterns
    this.detectSuspiciousActivity(userAddress, action);
  }

  detectSuspiciousActivity(userAddress, action) {
    const activities = this.metrics.get(`${userAddress}:${action}`) || [];
    const recentActivities = activities.filter(a => 
      Date.now() - a.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );

    // Flag rapid consecutive actions
    if (recentActivities.length > 50) {
      this.alerts.add({
        type: 'RAPID_ACTIVITY',
        userAddress,
        action,
        count: recentActivities.length,
        timestamp: Date.now()
      });
    }
  }

  getSecurityMetrics() {
    return {
      totalUsers: this.metrics.size,
      activeAlerts: this.alerts.size,
      recentActivity: this.getRecentActivityCount(),
      timestamp: Date.now()
    };
  }
}
```

## Security Testing

### Application Security Tests

```javascript
describe('Yellow App Security', () => {
  describe('Authentication', () => {
    it('should reject unauthorized wallet connections', async () => {
      const unauthorizedWallet = '0x1234567890123456789012345678901234567890';
      
      await expect(
        app.authenticateUser(unauthorizedWallet)
      ).rejects.toThrow('Wallet not authorized');
    });

    it('should expire sessions after timeout', async () => {
      const session = await app.createSession(validWallet);
      
      // Fast-forward time
      jest.advanceTimersByTime(31 * 60 * 1000); // 31 minutes
      
      expect(app.validateSession(session.id)).toThrow('Invalid or expired session');
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid amounts', async () => {
      await expect(
        app.createPayment(-100n, recipient)
      ).rejects.toThrow('Amount must be positive');
    });

    it('should sanitize malicious session data', async () => {
      const maliciousData = '<script>alert("xss")</script>normal content';
      const sanitized = app.sanitizeSessionData(maliciousData);
      
      expect(sanitized).toBe('normal content');
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('Rate Limiting', () => {
    it('should block excessive requests', async () => {
      // Make 100 requests quickly
      for (let i = 0; i < 100; i++) {
        await app.makeRequest(userAddress);
      }
      
      // 101st request should be blocked
      await expect(
        app.makeRequest(userAddress)
      ).rejects.toThrow('Rate limit exceeded');
    });
  });
});
```

## Security Checklist

### Development Phase

- [ ] **Input Validation**: All user inputs sanitized and validated
- [ ] **Wallet Authentication**: Proper wallet connection and session management
- [ ] **Rate Limiting**: Protection against excessive requests
- [ ] **Error Handling**: Secure error messages (no information leakage)
- [ ] **Session Management**: Proper timeout and cleanup
- [ ] **Connection Security**: Secure WebSocket connections only

### Pre-Production

- [ ] **Security Testing**: Application security tests passing
- [ ] **Dependency Audit**: All dependencies scanned for vulnerabilities
- [ ] **Code Review**: Peer review with security focus
- [ ] **Environment Config**: Secure configuration management
- [ ] **Monitoring Setup**: Activity tracking and alerting configured

### Production

- [ ] **Real-time Monitoring**: Application activity monitoring active
- [ ] **Incident Response**: Security procedures documented and tested
- [ ] **Backup Security**: Secure backup and recovery procedures
- [ ] **User Education**: Security guidelines provided to users
- [ ] **Regular Updates**: Security update procedures established

Focus on application-level security practices that protect your Yellow App users and maintain trust in your service.