# Security Guide

## Overview

This document outlines the security features implemented in Pulse Server and best practices for deploying to production.

## Authentication

### API Key Authentication

The server supports API Key-based authentication to protect endpoints from unauthorized access.

#### Configuration

Enable API Key authentication by setting these environment variables:

```bash
# Enable API key validation
API_KEY_AUTH_ENABLED=true

# Comma-separated list of valid API keys
API_KEYS=pulse-dev-key-123,pulse-test-key-456,sk-demo-key-789
```

#### Using API Keys

Provide your API key in one of two ways:

**Option 1: Request Header (Recommended)**

```bash
curl -H "X-API-Key: pulse-dev-key-123" \
  http://localhost:3000/api/enrichment
```

**Option 2: Query Parameter**

```bash
curl "http://localhost:3000/api/enrichment?api_key=pulse-dev-key-123"
```

#### JavaScript Example

```javascript
// With header
const response = await fetch("http://localhost:3000/api/enrichment", {
  method: "POST",
  headers: {
    "X-API-Key": "pulse-dev-key-123",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    owner: "user",
    name: "repo",
    scope: "repo",
    task: "analyze",
  }),
});

// With query parameter
const response = await fetch(
  "http://localhost:3000/api/enrichment?api_key=pulse-dev-key-123",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: "user",
      name: "repo",
      scope: "repo",
      task: "analyze",
    }),
  }
);
```

#### React Hook Example

```javascript
// Custom hook for authenticated API calls
import { useState } from "react";

export function useApi(apiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api${endpoint}`, {
        ...options,
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
}

// Usage in component
function AnalyzeRepo() {
  const { call, loading, error } = useApi("pulse-dev-key-123");

  const handleAnalyze = async () => {
    try {
      const result = await call("/enrichment", {
        method: "POST",
        body: JSON.stringify({
          owner: "torvalds",
          name: "linux",
          scope: "repo",
          task: "analyze",
        }),
      });
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleAnalyze} disabled={loading}>
      {loading ? "Analyzing..." : "Analyze Repository"}
    </button>
  );
}
```

## Rate Limiting

Rate limiting is automatically applied to all API endpoints to prevent abuse.

### Limits

- **Unauthenticated (by IP):** 100 requests per 15 minutes
- **Authenticated (by API Key):** 500 requests per 15 minutes

### Response Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100              # Maximum requests allowed
X-RateLimit-Remaining: 87           # Remaining requests in window
X-RateLimit-Reset: 2025-11-06...    # When the window resets (ISO 8601)
```

### Rate Limit Exceeded (429 Response)

```json
{
  "success": false,
  "error": "Too many requests. Limit: 100 requests per 15 minutes.",
  "retryAfter": 312
}
```

The `retryAfter` value is in seconds. Wait this long before making another request.

## Error Responses

### Missing API Key (401)

```json
{
  "success": false,
  "error": "Access denied. API key required. Provide via X-API-Key header or ?api_key=xxx query parameter."
}
```

### Invalid API Key (403)

```json
{
  "success": false,
  "error": "Invalid API key."
}
```

## Logging

All authentication and rate limiting events are logged:

```
WARN: API request rejected: Missing API key from 192.168.1.1
WARN: API request rejected: Invalid API key from 192.168.1.1
WARN: Rate limit exceeded for key:pulse-dev-key-123: 500/500 requests in 900000ms
DEBUG: API request authenticated with key: pulse-dev...
```

Set `LOG_LEVEL=debug` in `.env.local` to see all authentication details.

## Production Security Recommendations

### 1. **HTTPS Only**

Always use HTTPS in production. Redirect HTTP to HTTPS:

```javascript
// In app.js or server.js
if (config.isProduction) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.originalUrl}`);
    }
    next();
  });
}
```

### 2. **API Key Management**

- **Never commit API keys** to version control
- Use secure environment management:
  - **Docker:** Secrets (Docker Swarm/Kubernetes)
  - **Cloud:** AWS Secrets Manager, Azure Key Vault, Google Cloud Secret Manager
  - **On-premise:** HashiCorp Vault, encrypted environment files
- Rotate API keys regularly (e.g., every 3-6 months)
- Create separate keys for each environment (dev, staging, prod)
- Monitor API key usage for suspicious activity

### 3. **CORS Configuration**

Restrict CORS to trusted domains:

```bash
# .env.local
CORS_ORIGIN=https://app.example.com,https://admin.example.com
```

### 4. **Input Validation**

Validate all request parameters:

```javascript
const schema = Joi.object({
  owner: Joi.string().alphanum().min(1).max(50).required(),
  name: Joi.string().alphanum().min(1).max(100).required(),
  scope: Joi.string().valid("repo").required(),
  task: Joi.string().valid("analyze", "summarize-issues").required(),
});
```

### 5. **Monitoring & Alerts**

Monitor for:

- Multiple failed API key attempts → **Alert**
- Sudden spike in rate limit hits → **Alert**
- Errors from unusual IP addresses → **Alert**
- Unusual request patterns → **Investigate**

### 6. **Database/Token Storage**

For storing API keys in a database:

```javascript
// Hash API keys before storing
import crypto from "crypto";

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

// Store hashed version in DB
db.apiKeys.insert({
  hashedKey: hashApiKey("pulse-dev-key-123"),
  name: "Development Key",
  owner: "dev-team",
  created: new Date(),
  lastUsed: null,
  active: true,
});

// During validation, hash incoming key and compare
const incomingHash = hashApiKey(req.header("X-API-Key"));
const valid = await db.apiKeys.findOne({
  hashedKey: incomingHash,
  active: true,
});
```

### 7. **Future: JWT Implementation**

For more advanced use cases, implement JWT tokens:

```javascript
import jwt from "jsonwebtoken";

// Generate token (after API key validation)
const token = jwt.sign(
  { apiKey: "pulse-dev-key-123", scope: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);

// Validate token in middleware
export const verifyJwt = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
```

## Security Checklist

Before deploying to production:

- [ ] API_KEY_AUTH_ENABLED=true in production .env
- [ ] CORS_ORIGIN restricted to your domain(s)
- [ ] HTTPS enabled and HTTP redirects to HTTPS
- [ ] API keys stored securely (not in version control)
- [ ] Rate limiting tested and appropriate for your use case
- [ ] Error messages don't leak sensitive information
- [ ] Logging includes all auth failures
- [ ] Regular security audits scheduled
- [ ] API keys rotated regularly
- [ ] Monitoring and alerts configured
- [ ] Backup and disaster recovery plan in place
- [ ] Rate limits adjusted based on usage patterns

## Testing Authentication

Test the API key system:

```bash
# ✅ Valid API key (should work)
curl -H "X-API-Key: pulse-dev-key-123" \
  http://localhost:3000/api/enrichment

# ❌ Missing API key (should fail with 401)
curl http://localhost:3000/api/enrichment

# ❌ Invalid API key (should fail with 403)
curl -H "X-API-Key: invalid-key" \
  http://localhost:3000/api/enrichment
```

## Questions?

See other documentation:

- [`QUICK_START.md`](./QUICK_START.md) - Getting started guide
- [`API_GUIDE.md`](./API_GUIDE.md) - Complete API reference
- [`PURPOSE.md`](./PURPOSE.md) - Project vision and architecture
