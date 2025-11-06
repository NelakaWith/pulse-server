# Quick Start Guide

## Getting Started with Pulse Server

### Prerequisites

- Node.js 16+ installed
- GitHub personal access token
- OpenRouter API key
- `.env.local` file configured

---

## Setup

### 1. Environment Configuration

Create or update `.env.local`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# GitHub Configuration
GITHUB_TOKEN=your_github_pat_here
GITHUB_GRAPHQL_API_BASE_URL=https://api.github.com/graphql

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_AI_MODEL=deepseek/deepseek-chat-v3.1:free
```

### 2. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with auto-restart enabled.

### 3. Verify Server is Running

```bash
curl http://localhost:3000/health
```

You should see:

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 4. Authentication with API Keys

The server is configured with API Key authentication enabled. Use one of these keys:

- `pulse-dev-key-123`
- `pulse-test-key-456`
- `sk-demo-key-789`

Provide your API key in requests using the `X-API-Key` header or `api_key` query parameter.

---

## First API Call

### Using cURL with API Key

Analyze a repository:

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -H "X-API-Key: pulse-dev-key-123" \
  -d '{
    "owner": "octocat",
    "name": "Hello-World",
    "scope": "repo",
    "task": "analyze"
  }'
```

Or using query parameter:

```bash
curl -X POST "http://localhost:3000/api/enrichment?api_key=pulse-dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "octocat",
    "name": "Hello-World",
    "scope": "repo",
    "task": "analyze"
  }'
```

### Using PowerShell with API Key

```powershell
$headers = @{
  'Content-Type' = 'application/json'
  'X-API-Key' = 'pulse-dev-key-123'
}

$body = @{
  owner = "octocat"
  name = "Hello-World"
  scope = "repo"
  task = "analyze"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/enrichment" `
  -Method POST `
  -Body $body `
  -Headers $headers | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## Common Tasks

### Task 1: Analyze a Repository

Get AI-powered insights about code quality and repository health.

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "facebook",
    "name": "react",
    "scope": "repo",
    "task": "analyze",
    "question": "What is the overall code quality and maintenance status?"
  }'
```

**Response includes:**

- Repository metadata (stars, forks, language, URL)
- AI analysis answering your question
- Total issues count
- Last update timestamp

---

### Task 2: Summarize Repository Issues

Get a summary of open issues and identify patterns.

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "facebook",
    "name": "react",
    "scope": "repo",
    "task": "summarize-issues"
  }'
```

**Response includes:**

- AI-generated summary of issues
- Issues breakdown (themes, patterns, priorities)
- List of individual issues analyzed
- Total vs analyzed issues count

---

### Task 3: Chat with AI Directly

Ask the AI anything without repository context.

```bash
curl -X POST http://localhost:3000/api/ai/llm \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the best practices for API design?"
  }'
```

---

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": {
    // Response data varies by endpoint
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

---

## Debugging

### Check Server Logs

Watch the server console for detailed logs:

```bash
[INFO] 2025-11-06T... - [Enrichment] Fetching repository: octocat/Hello-World
[INFO] 2025-11-06T... - [Enrichment] Repository data: Hello-World (2023 stars, Python)
[INFO] 2025-11-06T... - [Enrichment] Sending context to AI (1234 characters)
[INFO] 2025-11-06T... - [Enrichment] AI analysis completed successfully (2300 characters response)
```

### Enable Debug Logging

Set in `.env.local`:

```
LOG_LEVEL=debug
```

### Common Issues

**❌ Error: "GitHub token is not configured"**

- Solution: Check `GITHUB_TOKEN` in `.env.local`

**❌ Error: "OpenRouter API key is not configured"**

- Solution: Check `OPENROUTER_API_KEY` in `.env.local`

**❌ Error: "Repository not found"**

- Solution: Verify owner and repository name exist on GitHub

**❌ Slow responses**

- Check GitHub GraphQL rate limits
- Verify OpenRouter API is responding
- Check network connection

---

## API Endpoints Summary

| Method   | Endpoint                 | Purpose                                               |
| -------- | ------------------------ | ----------------------------------------------------- |
| GET      | `/health`                | Health check                                          |
| GET      | `/`                      | Welcome/info                                          |
| GET      | `/api`                   | Available routes                                      |
| **POST** | **`/api/enrichment`**    | **Main endpoint - analyze repos or summarize issues** |
| POST     | `/api/ai/llm`            | Direct AI chat                                        |
| GET      | `/api/ai/models`         | List available AI models                              |
| POST     | `/api/github/repository` | Get GitHub repo data                                  |

---

## Frontend Integration

### Example: React Component

```javascript
import { useState } from "react";

export function RepoAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeRepo = async (owner, name) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/enrichment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          name,
          scope: "repo",
          task: "analyze",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        console.error(data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => analyzeRepo("octocat", "Hello-World")}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Repository"}
      </button>

      {result && (
        <div>
          <h2>{result.repository.name}</h2>
          <p>{result.analysis}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Next Steps

1. ✅ Set up `.env.local` with credentials
2. ✅ Start the server with `npm run dev`
3. ✅ Test endpoints with curl or Postman
4. ✅ Integrate into your frontend application
5. ✅ Review full API guide for advanced usage

For detailed endpoint documentation, see [API_GUIDE.md](./API_GUIDE.md).
