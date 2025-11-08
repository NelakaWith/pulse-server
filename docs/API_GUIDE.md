# Pulse Server API Guide

## Overview

This guide explains how to use the exposed API endpoints in the Pulse Server. The server provides REST endpoints for repository analysis, issue summarization, and AI-powered insights powered by OpenRouter.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, authentication is handled via GitHub token in the backend environment (`.env.local`). No client-side authentication is required for API calls.

---

## Endpoints

### 1. Health Check

Check if the server is running and healthy.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-06T12:34:56.789Z"
}
```

**Example:**

```bash
curl http://localhost:3000/health
```

---

### 2. Root/Welcome

Get server information and welcome message.

**Endpoint:** `GET /`

**Response:**

```json
{
  "message": "Welcome to Pulse Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "api": "/api",
    "enrichment": "/api/enrichment"
  }
}
```

---

### 3. API Information

Get list of all available API routes.

**Endpoint:** `GET /api`

**Response:**

```json
{
  "message": "Pulse Server API",
  "availableRoutes": [
    "/ai/llm - AI Chat endpoint",
    "/ai/models - Get available AI models",
    "/enrichment - Repository enrichment (analyze, summarize issues)",
    "/github - GitHub data endpoints"
  ]
}
```

---

### 4. Repository Enrichment (Primary Endpoint)

Analyze repositories or summarize issues using AI. This is the main endpoint for the frontend.

**Endpoint:** `POST /api/enrichment`

**Required Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `owner` | string | GitHub repository owner username |
| `name` | string | GitHub repository name |
| `scope` | string | Scope of analysis (currently only `"repo"` supported) |
| `task` | string | Task to perform: `"analyze"` or `"summarize-issues"` |
| `question` | string | (Optional) Custom question for analyze task. If not provided, uses default analysis |

#### Task: `analyze`

Fetch GitHub repository data and provide AI analysis with insights.

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "octocat",
    "name": "Hello-World",
    "scope": "repo",
    "task": "analyze",
    "question": "What is the code quality of this repository?"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "repository": {
      "name": "Hello-World",
      "owner": "octocat",
      "url": "https://github.com/octocat/Hello-World",
      "stars": 2023,
      "language": "Python"
    },
    "analysis": "Based on the repository data...",
    "metadata": {
      "totalIssues": 42,
      "lastUpdated": "2025-11-06T10:00:00Z"
    }
  }
}
```

**What Happens:**

1. Fetches repository details from GitHub (stars, forks, language, description, etc.)
2. Fetches recent issues for context
3. Sends combined data to OpenRouter AI for analysis
4. Returns AI-generated insights

---

#### Task: `summarize-issues`

Fetch and summarize repository issues with AI analysis.

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "octocat",
    "name": "Hello-World",
    "scope": "repo",
    "task": "summarize-issues"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "repository": "octocat/Hello-World",
    "totalIssues": 156,
    "analyzedIssues": 10,
    "summary": "The repository has various issues across categories...",
    "issues": [
      {
        "number": 123,
        "title": "Bug: Login fails on Safari",
        "state": "OPEN",
        "author": "developer1",
        "labels": ["bug", "priority-high"]
      },
      ...
    ]
  }
}
```

**What Happens:**

1. Fetches up to 10 most recent issues from the repository
2. Sends issues to OpenRouter AI for analysis
3. AI identifies themes, patterns, and priority areas
4. Returns summary with individual issue details

---

### 5. AI Chat Endpoint

Direct access to AI chat completions.

**Endpoint:** `POST /api/ai/llm`

**Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Your message to the AI |
| `model` | string | (Optional) AI model to use. Defaults to `deepseek/deepseek-chat-v3.1:free` |

**Request Example:**

```bash
curl -X POST http://localhost:3000/api/ai/llm \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain what DevOps is in simple terms"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "DevOps is a set of practices that combines software development..."
  },
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

---

### 6. Available AI Models

Get list of available AI models from OpenRouter.

**Endpoint:** `GET /api/ai/models`

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "anthropic/claude-3-haiku",
        "name": "Claude 3 Haiku",
        "pricing": {...}
      },
      {
        "id": "deepseek/deepseek-chat-v3.1:free",
        "name": "DeepSeek Chat v3.1 (Free)",
        "pricing": {...}
      },
      ...
    ]
  }
}
```

---

### 7. GitHub Data Endpoints

Access raw GitHub data without AI enrichment.

**Endpoint:** `POST /api/github/repository`

Get repository details.

**Request:**

```bash
curl -X POST http://localhost:3000/api/github/repository \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "octocat",
    "name": "Hello-World"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
    "name": "Hello-World",
    "description": "Example repository",
    "url": "https://github.com/octocat/Hello-World",
    "stargazerCount": 2023,
    "forkCount": 523,
    "createdAt": "2011-01-26T19:01:12Z",
    "updatedAt": "2025-11-06T10:00:00Z",
    "primaryLanguage": {
      "name": "Python",
      "color": "#3572A5"
    }
  }
}
```

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Analyze a repository
async function analyzeRepository(owner, name, question) {
  const response = await fetch("http://localhost:3000/api/enrichment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      owner,
      name,
      scope: "repo",
      task: "analyze",
      question,
    }),
  });

  const data = await response.json();
  return data;
}

// Usage
const result = await analyzeRepository(
  "octocat",
  "Hello-World",
  "What is the overall health of this repository?"
);
console.log(result.data.analysis);
```

```javascript
// Summarize issues
async function summarizeIssues(owner, name) {
  const response = await fetch("http://localhost:3000/api/enrichment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      owner,
      name,
      scope: "repo",
      task: "summarize-issues",
    }),
  });

  const data = await response.json();
  return data;
}

// Usage
const result = await summarizeIssues("octocat", "Hello-World");
console.log(result.data.summary);
```

### PowerShell

```powershell
# Analyze repository
$body = @{
  owner = "octocat"
  name = "Hello-World"
  scope = "repo"
  task = "analyze"
  question = "What programming language is this repository built with?"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/enrichment" `
  -Method POST `
  -Headers @{'Content-Type'='application/json'} `
  -Body $body

$response.Content | ConvertFrom-Json
```

### Python

```python
import requests

def analyze_repository(owner, name, question=None):
    payload = {
        "owner": owner,
        "name": name,
        "scope": "repo",
        "task": "analyze",
        "question": question
    }

    response = requests.post(
        'http://localhost:3000/api/enrichment',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )

    return response.json()

# Usage
result = analyze_repository('octocat', 'Hello-World', 'Is this a well-maintained repository?')
print(result['data']['analysis'])
```

---

## Error Handling

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Description of the error"
}
```

### Common Error Codes

| Status | Error                       | Cause                                    |
| ------ | --------------------------- | ---------------------------------------- |
| 400    | Missing required fields     | owner, name, scope, or task not provided |
| 400    | Unknown task                | task value not recognized                |
| 400    | Repository not found        | GitHub repository doesn't exist          |
| 401    | GitHub token not configured | GITHUB_TOKEN env var missing             |
| 500    | AI analysis failed          | OpenRouter API error                     |
| 500    | Internal server error       | Server-side error                        |

---

## Logging

All API requests are logged with timestamps and request details. Enable debug logging by setting `LOG_LEVEL=debug` in `.env.local`:

```
LOG_LEVEL=debug
```

Check the server console for:

- ✅ `[INFO]` - Successful operations
- ⚠️ `[WARN]` - Warnings (e.g., issue fetch failed but continuing)
- ❌ `[ERROR]` - Errors with details
- 🔧 `[DEBUG]` - Detailed debugging info (dev mode only)

---

## Environment Configuration

Ensure these are set in `.env.local`:

```
# Server
PORT=3000
NODE_ENV=development

# GitHub
GITHUB_TOKEN=your_github_token_here
GITHUB_GRAPHQL_API_BASE_URL=https://api.github.com/graphql

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_AI_MODEL=deepseek/deepseek-chat-v3.1:free
```

---

## Rate Limiting

- GitHub API: ~5000 requests/hour (handled by GitHub token)
- OpenRouter AI: Depends on your plan
- Server rate limiting: 100 requests per 15 minutes per IP

---

## Tips & Best Practices

✅ **DO:**

- Always provide `owner`, `name`, `scope`, and `task`
- Use specific questions for better analyze results
- Cache results to reduce API calls
- Check `success` field before accessing `data`

❌ **DON'T:**

- Make requests without proper error handling
- Ignore the `error` field in responses
- Send the same request multiple times immediately
- Store sensitive data in response logs

---

## Support

For issues or questions about the API:

1. Check the server logs for detailed error messages
2. Verify GitHub and OpenRouter credentials in `.env.local`
3. Test endpoints with curl or Postman first
4. Review this guide for correct payload structure

---

## Version History

| Version | Date       | Changes                                          |
| ------- | ---------- | ------------------------------------------------ |
| 1.0.0   | 2025-11-06 | Initial release with unified enrichment endpoint |
