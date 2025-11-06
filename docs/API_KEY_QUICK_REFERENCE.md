# API Key Authentication - Quick Reference

## 🔐 Authentication Basics

### Required Header

```
X-API-Key: pulse-dev-key-123
```

### Alternative: Query Parameter

```
?api_key=pulse-dev-key-123
```

---

## 📝 Minimal Example

### cURL

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "X-API-Key: pulse-dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{"owner":"facebook","name":"react","scope":"repo","task":"analyze"}'
```

### JavaScript

```javascript
fetch("http://localhost:3000/api/enrichment", {
  method: "POST",
  headers: {
    "X-API-Key": "pulse-dev-key-123",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    owner: "facebook",
    name: "react",
    scope: "repo",
    task: "analyze",
  }),
});
```

### PowerShell

```powershell
$headers = @{
  'X-API-Key' = 'pulse-dev-key-123'
  'Content-Type' = 'application/json'
}
$body = @{owner='facebook'; name='react'; scope='repo'; task='analyze'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/enrichment' `
  -Method POST -Body $body -Headers $headers
```

---

## 📊 Response Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 500                           # Max requests per window
X-RateLimit-Remaining: 499                       # Requests left
X-RateLimit-Reset: 2025-11-06T07:03:29.240Z    # When window resets
```

---

## ⚠️ Error Codes

| Code | Error               | Solution                  |
| ---- | ------------------- | ------------------------- |
| 401  | Missing API key     | Add `X-API-Key` header    |
| 403  | Invalid API key     | Use a valid API key       |
| 429  | Rate limit exceeded | Wait `retryAfter` seconds |
| 500  | Server error        | Contact support           |

---

## 🚀 Rate Limits

| User Type                  | Limit        | Window     |
| -------------------------- | ------------ | ---------- |
| Unauthenticated (by IP)    | 100 requests | 15 minutes |
| Authenticated (by API key) | 500 requests | 15 minutes |

---

## ✅ Valid Test API Keys

```
pulse-dev-key-123
pulse-test-key-456
sk-demo-key-789
```

---

## 📚 Learn More

- 🔐 [Full Security Guide](./SECURITY.md)
- 📖 [Complete API Reference](./API_GUIDE.md)
- 🎯 [Frontend Integration](./FRONTEND_INTEGRATION.md)
- 🚀 [Quick Start](./QUICK_START.md)

---

## 💡 Pro Tips

1. **Use header method** - More secure than query parameters
2. **Store keys in env vars** - Never commit keys to code
3. **Monitor rate limits** - Check headers to avoid hitting limits
4. **Implement retries** - Handle rate limiting gracefully
5. **HTTPS only** - Always use HTTPS in production

---

**Questions?** See [SECURITY.md](./SECURITY.md#troubleshooting) Troubleshooting section.
