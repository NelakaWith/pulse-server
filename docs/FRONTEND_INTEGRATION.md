# Frontend Integration Guide - API Key Authentication

This guide shows frontend developers how to integrate with the secured Pulse Server API.

## Quick Start

### 1. Get Your API Key

Contact your backend team to get an API key. For development, use one of these test keys:

- `pulse-dev-key-123`
- `pulse-test-key-456`
- `sk-demo-key-789`

### 2. Always Include the API Key

Every API request to Pulse Server must include your API key. Use the header method (recommended):

```javascript
const API_KEY = "pulse-dev-key-123";
const API_BASE_URL = "http://localhost:3000";

// Example request
fetch(`${API_BASE_URL}/api/enrichment`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY, // ← Always include this
  },
  body: JSON.stringify({
    owner: "facebook",
    name: "react",
    scope: "repo",
    task: "analyze",
  }),
});
```

---

## Framework Examples

### Vue.js

```vue
<template>
  <button @click="analyzeRepo" :disabled="loading">
    {{ loading ? "Analyzing..." : "Analyze Repository" }}
  </button>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="result">{{ result.data.analysis }}</div>
</template>

<script setup>
import { ref } from "vue";

const API_KEY = "pulse-dev-key-123";
const API_BASE_URL = "http://localhost:3000";

const loading = ref(false);
const error = ref(null);
const result = ref(null);

async function analyzeRepo() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/enrichment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        owner: "torvalds",
        name: "linux",
        scope: "repo",
        task: "analyze",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    result.value = await response.json();

    // Show rate limit info
    console.log(
      "Rate Limit Remaining:",
      response.headers.get("X-RateLimit-Remaining")
    );
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
```

### React with Hooks

```javascript
import { useState } from "react";

const API_KEY = "pulse-dev-key-123";
const API_BASE_URL = "http://localhost:3000";

export function RepositoryAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);

  async function analyzeRepo() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/enrichment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          owner: "facebook",
          name: "react",
          scope: "repo",
          task: "analyze",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      // Track rate limiting
      setRateLimit({
        limit: response.headers.get("X-RateLimit-Limit"),
        remaining: response.headers.get("X-RateLimit-Remaining"),
        reset: response.headers.get("X-RateLimit-Reset"),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={analyzeRepo} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Repository"}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h3>Analysis Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {rateLimit && (
        <div className="rate-limit">
          <p>
            Requests remaining: {rateLimit.remaining}/{rateLimit.limit}
          </p>
          <p>Window resets at: {rateLimit.reset}</p>
        </div>
      )}
    </div>
  );
}
```

### React with TanStack Query

```javascript
import { useQuery, useMutation } from "@tanstack/react-query";

const API_KEY = "pulse-dev-key-123";
const API_BASE_URL = "http://localhost:3000";

// Query for fetching repository analysis
export function useAnalyzeRepository(owner, name) {
  return useQuery({
    queryKey: ["repository", owner, name, "analysis"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/enrichment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          owner,
          name,
          scope: "repo",
          task: "analyze",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

// Usage in component
export function AnalyzeButton() {
  const { data, isLoading, error } = useAnalyzeRepository("facebook", "react");

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Analysis</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Angular

```typescript
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const API_KEY = "pulse-dev-key-123";
const API_BASE_URL = "http://localhost:3000";

@Injectable({
  providedIn: "root",
})
export class PulseServerService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    });
  }

  analyzeRepository(owner: string, name: string): Observable<any> {
    return this.http.post(
      `${API_BASE_URL}/api/enrichment`,
      {
        owner,
        name,
        scope: "repo",
        task: "analyze",
      },
      { headers: this.getHeaders() }
    );
  }

  summarizeIssues(owner: string, name: string): Observable<any> {
    return this.http.post(
      `${API_BASE_URL}/api/enrichment`,
      {
        owner,
        name,
        scope: "repo",
        task: "summarize-issues",
      },
      { headers: this.getHeaders() }
    );
  }
}

// Usage in component
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-repository-analyzer",
  template: `
    <button (click)="analyze()">Analyze Repository</button>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <pre *ngIf="result">{{ result | json }}</pre>
  `,
})
export class RepositoryAnalyzerComponent implements OnInit {
  loading = false;
  error = null;
  result = null;

  constructor(private pulseServer: PulseServerService) {}

  analyze() {
    this.loading = true;
    this.error = null;

    this.pulseServer.analyzeRepository("facebook", "react").subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error.error;
        this.loading = false;
      },
    });
  }
}
```

### Svelte

```svelte
<script>
  const API_KEY = 'pulse-dev-key-123';
  const API_BASE_URL = 'http://localhost:3000';

  let loading = false;
  let error = null;
  let result = null;
  let rateLimit = null;

  async function analyzeRepo() {
    loading = true;
    error = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/enrichment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          owner: 'facebook',
          name: 'react',
          scope: 'repo',
          task: 'analyze'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      result = await response.json();
      rateLimit = {
        limit: response.headers.get('X-RateLimit-Limit'),
        remaining: response.headers.get('X-RateLimit-Remaining')
      };
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<button on:click={analyzeRepo} disabled={loading}>
  {loading ? 'Analyzing...' : 'Analyze Repository'}
</button>

{#if error}
  <div class="error">{error}</div>
{/if}

{#if result}
  <div class="result">
    <h3>Analysis Result</h3>
    <pre>{JSON.stringify(result, null, 2)}</pre>
  </div>
{/if}

{#if rateLimit}
  <p>Requests remaining: {rateLimit.remaining}/{rateLimit.limit}</p>
{/if}
```

---

## Error Handling

Always handle authentication errors gracefully:

```javascript
async function callApi(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    // Handle different error statuses
    if (response.status === 401) {
      throw new Error("Invalid API key. Contact your administrator.");
    }
    if (response.status === 403) {
      throw new Error("API key is not authorized for this action.");
    }
    if (response.status === 429) {
      const body = await response.json();
      const retryAfter = body.retryAfter;
      throw new Error(
        `Rate limit exceeded. Please retry after ${retryAfter} seconds.`
      );
    }
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Unknown error occurred");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

---

## Rate Limiting Best Practices

### Monitor Rate Limit Headers

```javascript
const response = await fetch(endpoint, {
  /* ... */
});

const rateLimitInfo = {
  limit: response.headers.get("X-RateLimit-Limit"),
  remaining: response.headers.get("X-RateLimit-Remaining"),
  reset: new Date(response.headers.get("X-RateLimit-Reset")),
};

console.log(
  `Requests remaining: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}`
);
console.log(`Reset at: ${rateLimitInfo.reset.toLocaleString()}`);

// Warn user if approaching limit
if (rateLimitInfo.remaining < 10) {
  console.warn("⚠️ Approaching rate limit!");
}
```

### Implement Backoff Strategy

```javascript
async function callApiWithRetry(endpoint, data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 429) {
        const body = await response.json();
        const retryAfter = body.retryAfter || Math.pow(2, attempt - 1);

        if (attempt < maxRetries) {
          console.log(`Rate limited. Retrying in ${retryAfter}s...`);
          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000)
          );
          continue;
        }
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
    }
  }
}
```

---

## Environment-Specific Configuration

### Development

```javascript
const API_KEY = process.env.REACT_APP_API_KEY || "pulse-dev-key-123";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
```

### Production

```javascript
// Load from secure storage, never hardcode
const API_KEY = localStorage.getItem("apiKey");
const API_BASE_URL = process.env.REACT_APP_PROD_API_URL;

if (!API_KEY) {
  throw new Error("API key not configured");
}
```

---

## Troubleshooting

### 401 Unauthorized

- **Cause:** API key is missing or not provided
- **Solution:** Check that `X-API-Key` header is included in request

### 403 Forbidden

- **Cause:** API key is invalid or expired
- **Solution:** Contact your administrator to verify API key

### 429 Too Many Requests

- **Cause:** Rate limit exceeded
- **Solution:** Wait `retryAfter` seconds before making another request

### CORS Error

- **Cause:** Frontend origin not allowed
- **Solution:** Contact backend team to add your frontend URL to `CORS_ORIGIN`

---

## Best Practices

1. ✅ **Always use HTTPS in production** - Never send API keys over HTTP
2. ✅ **Never hardcode API keys** - Use environment variables
3. ✅ **Store API keys in secure storage** - Use localStorage carefully or secure cookies
4. ✅ **Handle rate limiting gracefully** - Show user-friendly messages
5. ✅ **Log authentication errors** - For debugging and security monitoring
6. ✅ **Implement retry logic** - Handle temporary failures
7. ✅ **Monitor rate limit headers** - Adjust request frequency proactively
8. ✅ **Use different keys for dev/prod** - Isolate environments

---

## Support

For issues or questions about API authentication:

- See [`docs/SECURITY.md`](../../docs/SECURITY.md) for detailed security guide
- See [`docs/API_GUIDE.md`](../../docs/API_GUIDE.md) for complete API reference
- Contact your backend development team
