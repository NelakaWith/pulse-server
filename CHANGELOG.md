# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned Features

- JWT token authentication alongside API keys
- Webhook support for async operations
- AI image vision endpoint
- Advanced rate limiting analytics
- Database persistence layer

## [1.0.0] - 2025-11-08

### Initial Release

#### Added

- **Express.js Server** - Fast, unopinionated Node.js framework
- **API Key Authentication** - Secure endpoints with API key validation
- **Rate Limiting** - Two-tier rate limiting (100/IP, 500/API key per 15 min)
- **OpenRouter Integration** - Access to 50+ AI models (GPT-4, Claude, Llama, etc.)
- **Repository Analysis** - AI-powered GitHub repository analysis
- **Issue Summarization** - Automatic summarization of repository issues
- **GitHub Integration** - GraphQL API integration for repository data
- **Security Headers** - Helmet.js for security headers (CSP, X-Frame-Options, etc.)
- **CORS Support** - Configurable Cross-Origin Resource Sharing
- **Request Logging** - Morgan middleware for HTTP request logging
- **Configuration Management** - Environment-based configuration
- **Error Handling** - Comprehensive error middleware and handling
- **Testing Suite** - Jest with 11 comprehensive tests
- **Docker Support** - Dockerfile and Docker Compose examples
- **Development Tools** - Nodemon for auto-restart during development

#### Features

**Core Endpoints:**

- `GET /` - Welcome message and server info
- `GET /health` - Health check endpoint
- `GET /api` - API information and available routes

**Enrichment Endpoints:**

- `POST /api/enrichment` - Unified repository analysis endpoint
  - Task: `analyze` - AI-powered repository analysis
  - Task: `summarize-issues` - AI summary of issues

**AI Endpoints:**

- `POST /api/ai/llm` - AI chat/completion endpoint
- `GET /api/ai/models` - List available AI models

**GitHub Endpoints:**

- `GET /api/github/status` - GitHub service status
- `POST /api/github/repository` - Get raw GitHub repository data

**Authentication:**

- API Key in header: `X-API-Key: sk-prod-xxxxx`
- API Key in query: `?api_key=sk-prod-xxxxx`

**Rate Limiting:**

- 100 requests per 15 minutes per IP (unauthenticated)
- 500 requests per 15 minutes per API key (authenticated)
- Response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

#### Documentation

- QUICK_START.md - Getting started guide
- API_GUIDE.md - Complete API reference
- SECURITY.md - Security configuration and best practices
- FRONTEND_INTEGRATION.md - Framework examples (React, Vue, Angular, Svelte)
- API_KEY_QUICK_REFERENCE.md - One-page cheat sheet
- API_KEY_MANAGEMENT.md - API key generation and management
- PURPOSE.md - Project vision and goals

#### Supported AI Models

- OpenAI: GPT-4, GPT-3.5, GPT-4 Vision
- Anthropic: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- Google: Gemini Pro, Gemini 1.5
- Meta: Llama 2 70B, Llama 3 70B
- DeepSeek: DeepSeek Chat v3.1
- And 40+ more models

#### Environment Variables

```
NODE_ENV=development|production|test
PORT=3000
API_KEY_AUTH_ENABLED=true
API_KEYS=comma,separated,keys
GITHUB_API_TOKEN=github_pat_xxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxx
DEFAULT_AI_MODEL=deepseek/deepseek-chat-v3.1:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
LOG_LEVEL=info|debug|warn|error
```

#### Dependencies

- express: ^4.18.2
- helmet: ^7.1.0
- cors: ^2.8.5
- dotenv: ^16.3.1
- morgan: ^1.10.0
- axios: ^1.6.0
- graphql-request: ^7.3.1

#### Dev Dependencies

- jest: ^29.7.0
- nodemon: ^3.0.1
- supertest: ^6.3.3

#### Tests

- 11 comprehensive tests covering:
  - Server startup and health checks
  - API endpoint responses
  - API key authentication (401/403)
  - Rate limiting enforcement
  - Error handling
  - Route availability
  - CORS configuration
  - Security headers

#### Known Limitations

- No database persistence (in-memory operations only)
- Rate limiting stored in memory (resets on server restart)
- No horizontal scaling support yet
- No webhook support
- No async job queue

#### Security

- ✅ API Key authentication
- ✅ Rate limiting per IP/key
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Request validation
- ✅ Error message sanitization
- ✅ Request logging
- ⚠️ No JWT support yet (planned for v2.0.0)
- ⚠️ No database encryption yet

#### Breaking Changes

- None (initial release)

#### Migration Guide

- None (initial release)

#### Performance

- Average response time: 100-500ms
- Supports 500 concurrent connections
- Rate limit window: 15 minutes
- Max tokens per request: 1000 (configurable)

#### Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

#### Testing

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
```

#### Credits

- Created by Nelaka Withanage
- OpenRouter API integration
- GitHub API integration

---

**Format:** [Keep a Changelog](https://keepachangelog.com/)
**Versioning:** [Semantic Versioning](https://semver.org/)
**Last Updated:** November 8, 2025
