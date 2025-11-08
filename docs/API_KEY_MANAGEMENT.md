# API Key Management Guide

## Overview

This guide covers generating, managing, and rotating API keys for different environments.

## Quick Start

### Generate Production API Keys

```bash
# Generate 3 production API keys
node utils/generateApiKey.js prod 3

# Generate 2 staging API keys
node utils/generateApiKey.js staging 2

# Generate 1 development API key
node utils/generateApiKey.js dev 1
```

### Output Format

```
🔑 Generating 3 API key(s) for prod environment:

1. sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61
2. sk-prod-9eeb3cb562a4a9af2d03caf58c55c7aa9b0551e1430d4010
3. sk-prod-46cd217ba5cc7773c36d5e8b667ba2567cbd635201dca541

📝 Add these to your .env file:
API_KEYS=sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61,sk-prod-9eeb3cb562a4a9af2d03caf58c55c7aa9b0551e1430d4010,sk-prod-46cd217ba5cc7773c36d5e8b667ba2567cbd635201dca541

🔒 Hashed versions (for database storage):
   ed4acff0157f15424002ee465855fac5b110f4dcfe84fda3f0408ee7de2b20fe
   459f99bc94e8587a9764310f90f548ce6d58ce0435fee516533354d9dd25c6e6
   906f88ed93fec279ae73fd9ba4134801c0a18ddd555a458ad147d673340b72f2
```

## API Key Format

### Structure

```
sk-[environment]-[random-hex-48-chars]
└─ Prefix     └─ Environment (dev, staging, prod)  └─ Cryptographically secure random
```

### Examples

- **Development:** `sk-dev-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Staging:** `sk-staging-b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7`
- **Production:** `sk-prod-c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8`

## Environment Configuration

### Development (`.env.local`)

```bash
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-dev-key1,sk-dev-key2,sk-test-key3
```

### Staging (`.env.staging`)

```bash
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-staging-key1,sk-staging-key2
```

### Production (`.env.production`)

```bash
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-prod-key1,sk-prod-key2,sk-prod-key3
```

## Secure Storage

### Option 1: Environment Variables (Simple)

```bash
# For small deployments
API_KEYS=sk-prod-key1,sk-prod-key2
```

### Option 2: AWS Secrets Manager (Recommended)

```javascript
// Get keys from AWS Secrets Manager
import AWS from "aws-sdk";

const secretsManager = new AWS.SecretsManager();

async function getApiKeys() {
  try {
    const secret = await secretsManager
      .getSecretValue({ SecretId: "pulse-server/api-keys" })
      .promise();

    const apiKeys = JSON.parse(secret.SecretString).apiKeys;
    return apiKeys.split(",");
  } catch (error) {
    console.error("Failed to retrieve API keys:", error);
    throw error;
  }
}
```

### Option 3: HashiCorp Vault

```javascript
// Get keys from Vault
import vault from "node-vault";

const client = vault({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

async function getApiKeys() {
  try {
    const secret = await client.read("secret/pulse-server/api-keys");
    return secret.data.data.keys.split(",");
  } catch (error) {
    console.error("Failed to retrieve API keys from Vault:", error);
    throw error;
  }
}
```

### Option 4: Database with Hashed Keys

```javascript
// Store hashed keys in database for lookup
import crypto from "crypto";

function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

// Validate incoming key
async function validateApiKey(incomingKey) {
  const hash = hashApiKey(incomingKey);
  const record = await db.apiKeys.findOne({
    hashedKey: hash,
    active: true,
  });
  return record ? true : false;
}
```

## Key Rotation

### Step 1: Generate New Keys

```bash
# Generate replacement keys
node utils/generateApiKey.js prod 3
```

### Step 2: Add New Keys Alongside Old Ones

```bash
# Keep old keys active while introducing new ones
API_KEYS=sk-prod-old-key1,sk-prod-old-key2,sk-prod-new-key1,sk-prod-new-key2,sk-prod-new-key3
```

### Step 3: Notify Clients

Send notification to API key owners:

```
📢 Important: API Key Rotation

We're rotating API keys for security. Please update your applications to use the new key below within 30 days:

Old Key: sk-prod-old-key1 (Expires: Dec 7, 2025)
New Key: sk-prod-new-key1 (Active)

Both keys will work until the expiration date. After that, old keys will be revoked.
```

### Step 4: Remove Old Keys

```bash
# After expiration period, remove old keys
API_KEYS=sk-prod-new-key1,sk-prod-new-key2,sk-prod-new-key3
```

## Best Practices

✅ **Do:**

- Generate keys using the provided utility
- Rotate keys every 90 days in production
- Use different keys for different clients
- Store keys in a secure secrets manager
- Log all key usage (without exposing full key)
- Revoke keys immediately if leaked
- Use HTTPS for all API calls
- Implement rate limiting per key
- Monitor for suspicious activity

❌ **Don't:**

- Hardcode API keys in source code
- Commit `.env.production` to version control
- Share API keys via email or chat
- Use the same key for multiple clients
- Expose full API key in logs or error messages
- Store plain-text keys in database
- Use weak random generation
- Forget to rotate keys regularly
- Trust client IP addresses alone

## API Key Masking

When logging, always mask the sensitive part:

```javascript
function maskApiKey(apiKey) {
  if (!apiKey || apiKey.length < 8) return "***";
  return apiKey.substring(0, 8) + "*".repeat(apiKey.length - 8);
}

// Usage
const key = "sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61";
console.log(`API Key used: ${maskApiKey(key)}`);
// Output: API Key used: sk-prod-***
```

## Monitoring & Alerts

### Monitor for:

- ✅ Failed authentication attempts (401, 403)
- ✅ Unusual spike in requests per key
- ✅ Requests from unexpected IP addresses
- ✅ Key usage patterns changing significantly
- ✅ Same key from multiple geographic locations simultaneously

### Alert Conditions:

```javascript
// Alert if more than 10 failed attempts in 5 minutes
const failedAttempts = await db.logs.count({
  status: 401,
  timestamp: { $gte: Date.now() - 5 * 60 * 1000 },
});

if (failedAttempts > 10) {
  sendAlert("Potential brute force attack detected");
}

// Alert if key usage exceeds threshold
const keyUsage = await db.logs.count({
  apiKey: maskedKey,
  timestamp: { $gte: Date.now() - 60 * 1000 },
});

if (keyUsage > 100) {
  sendAlert(`Unusual activity on key ${maskedKey}`);
}
```

## Troubleshooting

### "Invalid API Key"

- Check that the key is in `API_KEYS` environment variable
- Verify key format: `sk-[env]-[hex]`
- Ensure key hasn't been rotated out
- Check for typos or extra spaces

### "Rate Limited"

- Key has exceeded rate limit (500 requests per 15 minutes)
- Wait for rate limit window to reset
- Check `X-RateLimit-Reset` header for exact time
- Consider upgrading to higher tier

### Multiple Requests, Same Key

- Good! It means the key is being reused as intended
- Verify requests are from authorized clients
- Check logs for unusual patterns

## Support

For issues or questions:

- See [`docs/SECURITY.md`](./SECURITY.md) for security overview
- See [`docs/FRONTEND_INTEGRATION.md`](./FRONTEND_INTEGRATION.md) for client examples
- Review the source: `utils/generateApiKey.js`
