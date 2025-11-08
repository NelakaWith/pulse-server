# 🚀 Pulse Server

An AI-powered Express.js server designed for seamless integration with OpenRouter AI services. Built with modern Node.js practices and ready for production deployment.

**Version:** 1.0.0 | **License:** ISC | **Status:** Production Ready ✅

---

## 📖 Table of Contents

### Getting Started

- [✨ Features](#-features)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [📓 Documentation](#-documentation)
- 📖 [Quick Start Guide](./docs/QUICK_START.md) - Environment setup and first API call

### Core Documentation

- [🔄 CI/CD Pipeline](#-cicd-pipeline-with-drone-ci)
  - 📚 [CI/CD Pipeline Guide](./docs/CI_CD_PIPELINE.md) - Complete architecture and features
  - 🔧 [CI/CD Setup](./docs/CI_CD_SETUP.md) - Step-by-step configuration
  - 📋 [CI/CD Quick Reference](./docs/CI_CD_QUICK_REFERENCE.md) - Commands and troubleshooting
  - 🎨 [CI/CD Visual Workflow](./docs/CI_CD_VISUAL_WORKFLOW.md) - Pipeline diagrams and flows
- [🔗 Key Endpoints](#-key-endpoints)
  - 📖 [API Guide](./docs/API_GUIDE.md) - Complete endpoint documentation
- [🔍 Frontend Contract](#-frontend-contract)
  - 💻 [Frontend Integration](./docs/FRONTEND_INTEGRATION.md) - Framework examples

### Configuration & Setup

- [🔒 API Key Management](#-api-key-management)
  - 🔑 [API Key Management](./docs/API_KEY_MANAGEMENT.md) - Authentication setup
  - 📝 [API Key Quick Reference](./docs/API_KEY_QUICK_REFERENCE.md) - Quick cheat sheet
- [🤖 OpenRouter Integration](#-openrouter-integration)
- [⚡ Rate Limiting & Performance](#-rate-limiting--performance)

### Advanced Topics

- [🧪 Testing](#-testing)
- [🛡️ Security Features](#-security-features)
  - 🛡️ [Security Guide](./docs/SECURITY.md) - Authentication and security best practices
- [📈 Deployment](#-deployment)
  - 🚀 [Production Setup](./docs/PRODUCTION_KEYS_SETUP.md) - Production configuration
- [📦 Releases & Versioning](#-packages--versioning-with-conventional-commits)
  - 🔖 [Conventional Commits](./docs/CONVENTIONAL_COMMITS.md) - Commit format guide
  - 📊 [Versioning Guide](./docs/VERSIONING.md) - Semantic versioning details
- [🤝 Contributing](#-contributing)

### Support & Resources

- [🔗 Links](#-links)
- [👨‍💻 Author](#-author)
- 📋 [Complete Project Index](./docs/COMPLETE_PROJECT_INDEX.md) - Full documentation index
- 🎯 [Project Purpose](./docs/PURPOSE.md) - Vision and architecture alignment

---

## ✨ Features

- **ES6 Modules** - Modern JavaScript with import/export syntax
- **Modular Architecture** - Clean separation of concerns with dedicated directories
- **Express.js Framework** - Fast, unopinionated, minimalist web framework
- **AI Integration Ready** - Full OpenRouter AI service implementation
- **Configuration Management** - Centralized config with environment validation
- **Security First** - Helmet.js for security headers and CORS support
- **Request Logging** - Morgan middleware with environment-specific formatting
- **Service Layer** - Dedicated services for external API integration
- **Utility Functions** - Common helpers for validation, logging, and responses
- **Testing Suite** - Jest testing framework with ES6 module support
- **Development Tools** - Nodemon for auto-restart during development
- **Error Handling** - Comprehensive error middleware and async handlers
- **Graceful Shutdown** - Proper server shutdown handling

## 📁 Project Structure

```
pulse-server/
├── server.js              # Server startup and configuration
├── app.js                 # Express app configuration and middleware
├── package.json           # Dependencies and scripts
├── jest.config.json       # Jest testing configuration
├── .env.local            # Environment variables (create from .env.example)
├── .gitignore            # Git ignore rules
├── config/
│   └── index.js          # Application configuration
├── routes/
│   ├── api.js            # Main API router
│   ├── ai.js             # AI/OpenRouter integration routes
│   ├── enrichment.js     # Repository enrichment & analysis routes
│   └── github.js         # GitHub data endpoints
├── middleware/
│   └── index.js          # Custom middleware functions
├── services/
│   ├── openRouterService.js # OpenRouter AI service
│   └── githubService.js   # GitHub GraphQL service
├── utils/
│   └── index.js          # Utility functions and helpers
├── docs/                 # 📚 Documentation
│   ├── PURPOSE.md        # Project vision and architecture alignment
│   ├── QUICK_START.md    # Getting started guide
│   └── API_GUIDE.md      # Complete API endpoint documentation
└── tests/
    └── server.test.js    # Test suites
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pulse-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📓 Documentation

Complete documentation is available in the `docs/` directory:

### Quick Start (Beginners)

Start here! [**QUICK_START.md**](./docs/QUICK_START.md) covers:

- ✅ Environment setup
- ✅ First API call examples
- ✅ Common tasks with real examples
- ✅ Debugging tips
- ✅ Frontend integration example

### API Reference (Developers)

[**API_GUIDE.md**](./docs/API_GUIDE.md) provides:

- 📋 All available endpoints
- 🔍 Detailed parameter documentation
- 💬 Request/response examples in multiple languages (JavaScript, PowerShell, Python)
- ❌ Error handling guide
- 🎯 Best practices
- 🔧 Environment configuration
- 🚀 Advanced usage

### Security Guide (DevOps/Security)

[**SECURITY.md**](./docs/SECURITY.md) covers:

- 🔐 API Key authentication setup
- 🛑 Rate limiting configuration
- 🚨 Production security recommendations
- 🔒 Best practices for API keys
- 📊 Monitoring and logging
- ✅ Security checklist

### Frontend Integration (Frontend Developers)

[**FRONTEND_INTEGRATION.md**](./docs/FRONTEND_INTEGRATION.md) provides:

- 🎯 How to add API key authentication
- 💻 Framework-specific examples (React, Vue, Angular, Svelte)
- 🔄 Error handling patterns
- 📊 Rate limiting strategies
- 📝 Environment configuration
- 🐛 Troubleshooting guide

### Quick Reference (Everyone)

[**API_KEY_QUICK_REFERENCE.md**](./docs/API_KEY_QUICK_REFERENCE.md) - One-page cheat sheet:

- ⚡ Minimal authentication examples
- 📊 Response headers reference
- ⚠️ Error codes and solutions
- 🚀 Rate limit details
- 💡 Pro tips

### Project Vision (Stakeholders)

[**PURPOSE.md**](./docs/PURPOSE.md) explains:

- 🎯 Project goals and vision
- 🏗️ Architecture alignment
- 🤖 AI capabilities
- 📊 Use cases
- 💡 Implementation benefits

## 🔄 Workflow Overview

```
Frontend Application
        ↓
POST /api/enrichment
  {owner, name, scope, task}
        ↓
Backend Server
  ├─ Fetch GitHub data (GraphQL)
  ├─ Send to OpenRouter AI
  └─ Return enriched analysis
        ↓
Formatted JSON Response
  {success, data, metadata}
        ↓
Display Results to User
```

## 🔗 Key Endpoints

### Repository Enrichment (Primary)

**POST** `/api/enrichment` - Unified endpoint for repository analysis

- Task: `analyze` - Get AI-powered repository analysis
- Task: `summarize-issues` - Get AI summary of issues

See [API_GUIDE.md](./docs/API_GUIDE.md#4-repository-enrichment-primary-endpoint) for details.

## 🔍 Frontend Contract

The frontend communicates with the backend using this unified contract:

```javascript
// Request
POST /api/enrichment
{
  "owner": "username",
  "name": "repo-name",
  "scope": "repo",
  "task": "analyze" | "summarize-issues",
  "question": "optional custom question"
}

// Response
{
  "success": true,
  "data": {
    "repository": { /* repo details */ },
    "analysis": "AI-generated insights",
    "metadata": { /* metadata */ }
  }
}
```

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run test suite

## 📊 API Endpoints

### Core Endpoints

- **GET /** - Welcome message and server information
- **GET /health** - Health check endpoint
- **GET /api** - API information and available routes

### Enrichment Endpoints (Main Feature)

- **POST /api/enrichment** - Unified repository analysis endpoint
  - Task: `analyze` - AI-powered repository analysis
  - Task: `summarize-issues` - AI summary of repository issues

### AI Endpoints

- **POST /api/ai/llm** - AI chat/completion endpoint
- **GET /ai/models** - List available AI models

### GitHub Data Endpoints

- **POST /api/github/repository** - Get raw GitHub repository data
- Additional GitHub endpoints for issues, PRs, users, etc.

**📖 For complete endpoint documentation, see [API_GUIDE.md](./docs/API_GUIDE.md)**

## 🔒 API Key Management

### Overview

Pulse Server uses **API Key Authentication** to secure all `/api` endpoints. This ensures that only authorized clients can access your server's functionality.

### Key Types

1. **Development Keys** - For local testing and development
2. **Staging Keys** - For pre-production environment
3. **Production Keys** - For live deployment (must be securely generated)

### Generating Production API Keys

Use the built-in API key generator:

```bash
# Generate 1 production key
node utils/generateApiKey.js prod 1

# Generate 3 production keys
node utils/generateApiKey.js prod 3

# Generate 5 staging keys
node utils/generateApiKey.js staging 5
```

**Output example:**

```
🔑 Generating 3 API key(s) for prod environment:

1. sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61
2. sk-prod-9eeb3cb562a4a9af2d03caf58c55c7aa9b0551e1430d4010
3. sk-prod-46cd217ba5cc7773c36d5e8b667ba2567cbd635201dca541
```

### How to Use API Keys

#### Option 1: Header Method (Recommended)

```bash
curl -H "X-API-Key: sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61" \
  http://localhost:3000/api/enrichment
```

#### Option 2: Query Parameter

```bash
curl "http://localhost:3000/api/enrichment?api_key=sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61"
```

### Configuration

Create a `.env.local` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# API Key Authentication
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-dev-abc123def456,sk-dev-xyz789uvw012

# GitHub Configuration
GITHUB_TOKEN=your_github_pat_here
GITHUB_GRAPHQL_API_BASE_URL=https://api.github.com/graphql
GITHUB_REST_API_BASE_URL=https://api.github.com

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
DEFAULT_AI_MODEL=deepseek/deepseek-chat-v3.1:free
MAX_TOKENS=1000
TEMPERATURE=0.7

# CORS Configuration (restrict in production)
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### Production Deployment

For production, create a `.env.production` file with generated keys:

```env
NODE_ENV=production
PORT=3000

# ⚠️ IMPORTANT: Generate NEW keys for production
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-prod-3c96ecbbe2b83a2130d69d25579b5361ca7ead272c478f61,sk-prod-9eeb3cb562a4a9af2d03caf58c55c7aa9b0551e1430d4010

# Restrict CORS to your domain only
CORS_ORIGIN=https://yourdomain.com

# Use your production GitHub token
GITHUB_TOKEN=github_pat_production_token_here

# Use production OpenRouter key
OPENROUTER_API_KEY=sk-or-production-key-here
```

### Security Best Practices

✅ **DO:**

- Generate new keys for each environment (dev, staging, prod)
- Store keys in `.env.local` or environment variables (never in version control)
- Use HTTPS in production (never send keys over HTTP)
- Rotate keys regularly
- Use restrictive CORS settings in production
- Log all authentication failures
- Monitor rate limit usage

❌ **DON'T:**

- Commit `.env.local` or `.env.production` files to git
- Hardcode API keys in your application
- Reuse development keys in production
- Share API keys via email or Slack
- Expose API keys in client-side code
- Leave API_KEY_AUTH_ENABLED=false in production

**📖 See [API_KEY_MANAGEMENT.md](./docs/API_KEY_MANAGEMENT.md) for detailed key management guide**

**📖 See [SECURITY.md](./docs/SECURITY.md) for complete security configuration**

**📖 See [QUICK_START.md](./docs/QUICK_START.md#setup) for detailed setup instructions**

## 🤖 OpenRouter Integration

### Overview

Pulse Server is fully integrated with **OpenRouter AI**, a unified platform for accessing multiple AI models including:

- OpenAI GPT models
- Anthropic Claude
- Google Gemini
- Meta Llama
- DeepSeek
- And 50+ more models

### Features

1. **AI Chat Completions** - Direct access to multiple AI models via unified API
2. **Repository Analysis** - AI-powered code quality and repository health analysis
3. **Issue Summarization** - Automatic summarization of repository issues
4. **Flexible Model Selection** - Switch between different AI models via configuration
5. **Cost Optimization** - Use free-tier models for development and testing
6. **Token Management** - Configurable max tokens and temperature settings

### Setup

1. **Get an OpenRouter API key**

   - Visit [OpenRouter.ai](https://openrouter.ai)
   - Sign up and create an API key
   - Free credits available for testing

2. **Add credentials to `.env.local`**

   ```env
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   DEFAULT_AI_MODEL=deepseek/deepseek-chat-v3.1:free
   ```

3. **Choose your model**
   - Free models: `deepseek/deepseek-chat-v3.1:free`, `meta-llama/llama-2-70b-chat`
   - Premium models: `gpt-4`, `claude-3-opus`, `gemini-pro`
   - See [OpenRouter models](https://openrouter.ai/models) for full list

### Available AI Endpoints

#### 1. Repository Analysis

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-prod-xxxxx" \
  -d '{
    "owner": "facebook",
    "name": "react",
    "scope": "repo",
    "task": "analyze",
    "question": "What is the overall code quality and architecture?"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "repository": {
      "name": "react",
      "url": "https://github.com/facebook/react",
      "stars": 220000,
      "language": "JavaScript"
    },
    "analysis": "React is a well-architected JavaScript library with excellent code organization..."
  }
}
```

#### 2. Issue Summarization

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-prod-xxxxx" \
  -d '{
    "owner": "facebook",
    "name": "react",
    "scope": "repo",
    "task": "summarize-issues",
    "question": "What are the main themes in recent issues?"
  }'
```

#### 3. AI Chat Completion

```bash
curl -X POST http://localhost:3000/api/ai/llm \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk-prod-xxxxx" \
  -d '{
    "message": "Explain React hooks and their benefits",
    "model": "gpt-4"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "React hooks are functions that let you use state and other React features...",
    "model": "gpt-4"
  },
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 145,
    "total_tokens": 157
  }
}
```

### Configuration Examples

#### Development Setup (Free Models)

```env
OPENROUTER_API_KEY=sk-or-v1-xxxx
DEFAULT_AI_MODEL=deepseek/deepseek-chat-v3.1:free
MAX_TOKENS=500
TEMPERATURE=0.7
```

#### Production Setup (Premium Models)

```env
OPENROUTER_API_KEY=sk-or-v1-prod-xxxxx
DEFAULT_AI_MODEL=gpt-4
MAX_TOKENS=2000
TEMPERATURE=0.5
```

#### Research/Experimental (Claude 3)

```env
OPENROUTER_API_KEY=sk-or-v1-xxxx
DEFAULT_AI_MODEL=anthropic/claude-3-opus
MAX_TOKENS=4000
TEMPERATURE=0.8
```

### Cost Optimization Tips

| Strategy            | Benefits          | Trade-offs               |
| ------------------- | ----------------- | ------------------------ |
| **Use Free Models** | No cost           | Slightly lower quality   |
| **Batch Requests**  | Fewer API calls   | Slightly delayed results |
| **Cache Results**   | Reduced API calls | Stale data risk          |
| **Limit Tokens**    | Lower cost        | Truncated responses      |
| **Temperature=0.5** | Consistency       | Less creativity          |

### Troubleshooting

**Issue: 503 Service Unavailable**

- OpenRouter API key not configured
- Solution: Check OPENROUTER_API_KEY in .env.local

**Issue: Rate Limited**

- Too many requests to OpenRouter
- Solution: Reduce request frequency or upgrade plan

**Issue: Token Limit Exceeded**

- Response too long for configured MAX_TOKENS
- Solution: Increase MAX_TOKENS or ask shorter questions

**📖 See [API_GUIDE.md](./docs/API_GUIDE.md#4-repository-enrichment-primary-endpoint) for complete examples**

**📖 See [QUICK_START.md](./docs/QUICK_START.md) for setup guide**

## ⚡ Rate Limiting & Performance

### Overview

Pulse Server implements a **two-tier rate limiting system** to protect your API and ensure fair usage:

| Tier                | Type           | Limit        | Window     |
| ------------------- | -------------- | ------------ | ---------- |
| **Unauthenticated** | Per IP Address | 100 requests | 15 minutes |
| **Authenticated**   | Per API Key    | 500 requests | 15 minutes |

### Rate Limit Headers

Every response includes rate limit information:

```
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1699439400000
```

### Response Codes

- **200 OK** - Request successful
- **429 Too Many Requests** - Rate limit exceeded
- **401 Unauthorized** - Missing or invalid API key
- **403 Forbidden** - API key not authorized

### Monitor Rate Limit Usage

```javascript
// JavaScript example
const response = await fetch("/api/enrichment", {
  headers: { "X-API-Key": "sk-prod-xxxxx" },
});

const remaining = response.headers.get("X-RateLimit-Remaining");
const limit = response.headers.get("X-RateLimit-Limit");
const reset = new Date(parseInt(response.headers.get("X-RateLimit-Reset")));

console.log(`Requests: ${remaining}/${limit}`);
console.log(`Reset at: ${reset.toLocaleString()}`);

if (remaining < 50) {
  console.warn("⚠️ Approaching rate limit!");
}
```

### Handling Rate Limits

```javascript
async function callApiWithRetry(endpoint, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(endpoint, {
      headers: { "X-API-Key": "sk-prod-xxxxx" },
    });

    if (response.status === 429) {
      const reset = parseInt(response.headers.get("X-RateLimit-Reset"));
      const delayMs = reset - Date.now();

      if (attempt < maxRetries) {
        console.log(`Rate limited. Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}
```

### Performance Tips

| Optimization         | Impact              | Implementation           |
| -------------------- | ------------------- | ------------------------ |
| **Use API Keys**     | 5x higher limit     | Always authenticate      |
| **Batch Requests**   | Fewer API calls     | Group related operations |
| **Cache Results**    | Eliminate calls     | Store analysis results   |
| **Reduce Frequency** | Better distribution | Implement backoff        |
| **Connection Reuse** | Lower overhead      | Use keep-alive           |

### Configuration

Customize rate limiting in `config/index.js`:

```javascript
rateLimit: {
  windowMs: 15 * 60 * 1000,      // 15 minutes
  max: 100,                        // per IP
  maxPerApiKey: 500,               // per authenticated key
}
```

### Monitoring

Enable logging to track rate limit events:

```env
LOG_LEVEL=info
```

Check logs for:

- `Rate limit exceeded` - Too many requests from IP/key
- `API Key authenticated` - Successful API key validation
- `Invalid API key` - Failed authentication

**📖 See [SECURITY.md](./docs/SECURITY.md#rate-limiting) for detailed rate limiting guide**

## 🧪 Testing

### Run Test Suite

```bash
npm test
```

### Test Coverage

The project includes comprehensive tests for:

- ✅ Server startup and health checks
- ✅ API endpoint responses
- ✅ API key authentication (401/403 responses)
- ✅ Rate limiting enforcement
- ✅ Error handling
- ✅ Route availability
- ✅ CORS configuration
- ✅ Security headers

### Test Results

```
  Server
    ✓ GET / should return welcome message (35 ms)
    ✓ GET /health should return health status (8 ms)
    ✓ GET /api should return API info (6 ms)
    ✓ GET /api/ai/models should return AI models info (605 ms)
    ✓ POST /api/ai/llm should work with valid message (1611 ms)
    ✓ POST /api/ai/llm should return error when message is missing (6 ms)
    ✓ POST /api/ai/llm should handle invalid model gracefully (165 ms)
    ✓ GET /nonexistent should return 404 (5 ms)
    ✓ Server should handle CORS properly (5 ms)
    ✓ Server should have security headers (7 ms)
    ✓ GET /api/github/status should return GitHub service status (7 ms)

Test Suites: 1 passed, 1 total
Tests: 11 passed, 11 total
```

### Custom Testing

```bash
# Test specific endpoint
curl -H "X-API-Key: sk-dev-abc123" http://localhost:3000/api/enrichment

# Check rate limit headers
curl -I -H "X-API-Key: sk-dev-abc123" http://localhost:3000/api/enrichment

# Test without API key (should fail with 401)
curl http://localhost:3000/api/enrichment
```

### Debug Testing

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- server.test.js

# Watch mode for development
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🛡️ Security Features

- **API Key Authentication** - Secure API endpoints with API key validation
- **Rate Limiting** - Automatic rate limiting per IP/API key to prevent abuse
- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Input Validation** - Built-in Express.js body parsing with size limits
- **Error Handling** - Comprehensive error middleware
- **Request Logging** - Audit trail for authentication failures and rate limit events

📖 See [SECURITY.md](./docs/SECURITY.md) for complete security configuration and best practices.

## 📝 Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow ESLint configuration (when added)
- Write descriptive commit messages

### Adding New Routes

1. Create route files in the `routes/` directory
2. Import and use in `routes/api.js`
3. Add corresponding tests in `tests/`

### Environment Management

- Never commit `.env.local` files
- Use `.env.example` for documenting required variables
- Validate environment variables on startup

## 📈 Deployment

### Production Checklist

Before deploying to production, ensure:

**Security:**

- [ ] API_KEY_AUTH_ENABLED=true
- [ ] Generate new production API keys (not from development)
- [ ] Store API keys securely (environment variables, secrets manager)
- [ ] HTTPS enabled and HTTP redirects to HTTPS
- [ ] CORS_ORIGIN restricted to your domain(s)
- [ ] Error messages don't leak sensitive information

**Configuration:**

- [ ] NODE_ENV=production
- [ ] NODE_ENV set via environment variable (not .env file)
- [ ] All required environment variables configured
- [ ] Database connections tested
- [ ] External API keys configured (GitHub, OpenRouter)

**Infrastructure:**

- [ ] Process manager (PM2, systemd) configured
- [ ] Reverse proxy (Nginx, Apache) configured
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Logging and monitoring configured
- [ ] Backup and disaster recovery plan

**Monitoring:**

- [ ] Error logging enabled
- [ ] Request logging enabled
- [ ] Rate limit monitoring
- [ ] API key usage tracking
- [ ] Alerts configured for failures

**Performance:**

- [ ] Set up caching (Redis if needed)
- [ ] Enable gzip compression
- [ ] Configure connection pooling
- [ ] Load testing completed
- [ ] Response times acceptable

### Environment Setup

**Local Development:**

```bash
npm install
npm run dev
```

**Staging Environment:**

```env
NODE_ENV=staging
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-staging-xxxxx,sk-staging-yyyyy
```

**Production Environment:**

```env
NODE_ENV=production
API_KEY_AUTH_ENABLED=true
API_KEYS=sk-prod-xxxxx,sk-prod-yyyyy,sk-prod-zzzzz
CORS_ORIGIN=https://yourdomain.com
```

### Docker Deployment

#### Basic Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

#### Docker Compose Example

```yaml
version: "3.8"

services:
  pulse-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - API_KEY_AUTH_ENABLED=true
      - API_KEYS=${API_KEYS}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
```

#### Build and Run

```bash
# Build image
docker build -t pulse-server:latest .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e API_KEYS=sk-prod-xxxxx \
  -e GITHUB_TOKEN=xxx \
  -e OPENROUTER_API_KEY=xxx \
  pulse-server:latest

# Using Docker Compose
docker-compose up -d
```

### Deployment Platforms

**Heroku:**

```bash
heroku create pulse-server
heroku config:set NODE_ENV=production
heroku config:set API_KEYS=sk-prod-xxxxx
git push heroku main
```

**AWS Lambda/Serverless:**

```bash
serverless deploy function --function api
```

**DigitalOcean/VPS:**

```bash
# SSH into server
ssh user@server

# Clone repository
git clone <repo>
cd pulse-server

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "pulse-server" -- start
pm2 save
```

**Vercel (Node.js API):**

```bash
vercel deploy
```

### Monitoring & Logging

**Enable logging:**

```env
LOG_LEVEL=info
```

**Log files to check:**

- Application logs: `npm start` output
- Access logs: Morgan HTTP request logs
- Error logs: Check system error output
- Rate limit events: Search for "429" status codes

**Monitoring solutions:**

- DataDog
- New Relic
- Sentry (error tracking)
- PM2 Plus (process monitoring)
- ELK Stack (logging)

### Scaling Considerations

**Horizontal Scaling:**

- Load balance across multiple instances
- Share rate limit counters (Redis)
- Use centralized logging

**Vertical Scaling:**

- Increase server resources
- Optimize database queries
- Cache frequently accessed data

**Performance Optimization:**

- Enable gzip compression
- Set appropriate cache headers
- Use CDN for static assets
- Monitor and optimize slow endpoints

**📖 See [QUICK_START.md](./docs/QUICK_START.md) for deployment examples**

**📖 See [SECURITY.md](./docs/SECURITY.md) for security deployment guide**

## � CI/CD Pipeline with Drone CI

This project uses **Drone CI** for automated testing, building, and deployment with a **build-and-copy** approach and **PM2** process management.

### Pipeline Overview

| Event            | Pipeline       | Actions                                   |
| ---------------- | -------------- | ----------------------------------------- |
| **PR Created**   | Test + PR Lint | Run tests, validate conventional commits  |
| **PR Merged**    | Auto-Release   | Create version, update CHANGELOG          |
| **Tag Pushed**   | Deploy         | Build, copy, deploy to production via PM2 |
| **Main Updated** | Build & Deploy | Full deployment pipeline                  |

### Quick CI/CD Setup

```bash
# 1. Make changes and commit (conventional format)
npm run commit

# 2. Push and create PR
git push origin feat/new-feature

# 3. CI automatically:
#    - Validates commit format
#    - Runs all tests
#    - Lints PR title

# 4. After PR merge to main:
#    - Auto-creates release (v1.1.0)
#    - Builds application
#    - Deploys to production via PM2
#    - Sends success notification
```

### Deployment Architecture

```
GitHub Push → Drone CI → Build & Test → Deploy to Server
                                ↓
                         Copy files via SCP
                                ↓
                         Install dependencies
                                ↓
                      PM2 reload (zero-downtime)
                                ↓
                         Health checks
                                ↓
                    Telegram notification
```

### Required Secrets

Configure in Drone CI settings:

```
deploy_host         # Server hostname
deploy_username     # SSH username
deploy_ssh_key      # SSH private key
github_token        # GitHub token
telegram_token      # Telegram bot token
telegram_chat_id    # Telegram chat ID
```

### PM2 Process Management

**Configuration:** `ecosystem.config.js`

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Zero-downtime reload
pm2 reload ecosystem.config.js --env production

# View logs
pm2 logs pulse-server

# Monitor status
pm2 monit

# Save configuration
pm2 save
```

**Features:**

- ✅ Cluster mode with 2 instances
- ✅ Auto-restart on failure
- ✅ Health checks every 30 seconds
- ✅ Graceful shutdown
- ✅ Memory limit: 500MB
- ✅ JSON logging

**📖 See [CI_CD_PIPELINE.md](./docs/CI_CD_PIPELINE.md) for complete CI/CD documentation**

---

## �📦 Releases & Versioning with Conventional Commits

This project follows **Semantic Versioning** (MAJOR.MINOR.PATCH) with **Conventional Commits** for automatic version determination.

### Current Release

**Version:** `1.0.0` | **Released:** November 8, 2025

### Quick Release Workflow

```bash
# 1. Make changes and commit using conventional format
npm run commit
# Follow interactive prompts for: type, scope, description

# 2. Create automatic release (version bumped based on commits)
npm run release
# Analyzes commits, updates version, updates CHANGELOG.md, creates git tag

# 3. Push to remote
git push origin main --tags
```

### Version Release Process

#### Automatic Release Based on Commits

```bash
# Automatic: Analyzes commits since last tag
npm run release
# Example: feat commits → MINOR bump (1.0.0 → 1.1.0)

# Explicit: Force specific version type
npm run release:major    # Breaking changes (1.0.0 → 2.0.0)
npm run release:minor    # New features (1.0.0 → 1.1.0)
npm run release:patch    # Bug fixes (1.0.0 → 1.0.1)
npm run release:beta     # Pre-release (1.0.0 → 1.0.1-beta.0)
```

#### Commit Types for Version Bumping

| Commit Type             | Version Bump | Example                     |
| ----------------------- | ------------ | --------------------------- |
| `feat`                  | MINOR        | `feat(api): add endpoint`   |
| `fix`                   | PATCH        | `fix(auth): prevent bug`    |
| `BREAKING CHANGE`       | MAJOR        | `BREAKING CHANGE: redesign` |
| `docs`, `test`, `chore` | NONE         | No version bump             |

#### Make a Conventional Commit

**Interactive (Recommended):**

```bash
npm run commit
# 1. Select type (feat, fix, docs, etc.)
# 2. Select scope (api, auth, security, etc.)
# 3. Enter description
# 4. Confirm
```

**Manual:**

```bash
git commit -m "feat(api): add new endpoint"
git commit -m "fix(auth): validate JWT claims"
git commit -m "docs: update README"

# Breaking change:
git commit -m "feat(api): redesign response format

BREAKING CHANGE: Response structure changed from
{ success, data } to { ok, result }"
```

### Versioning Strategy

| Type      | Increment | Example       | Commit Type     |
| --------- | --------- | ------------- | --------------- |
| **MAJOR** | X.0.0     | 1.0.0 → 2.0.0 | BREAKING CHANGE |
| **MINOR** | x.Y.0     | 1.0.0 → 1.1.0 | feat            |
| **PATCH** | x.y.Z     | 1.0.0 → 1.0.1 | fix / perf      |

### Changelog

The `docs/CHANGELOG.md` is automatically updated with each release:

```markdown
## [1.1.0] - 2025-11-08

### Features

- **api**: add AI vision endpoint for image analysis

### Bug Fixes

- **rate-limit**: prevent counter overflow
```

### Pre-release Versions

```bash
# Create beta release
npm run release:beta
# Result: 1.0.0 → 1.0.1-beta.0

# RC (Release Candidate)
npm run release:beta
npm run release:beta  # Creates 1.0.1-beta.1
```

### Upcoming Releases

**v1.1.0** (Planned - Q1 2026)

- AI Vision endpoint for image analysis
- Claude 3 Opus support
- Enhanced rate limiting

**v1.2.0** (Planned - Q2 2026)

- Webhook support
- Advanced rate limiting analytics

**v2.0.0** (Planned - Q3 2026)

- JWT authentication
- Horizontal scaling support
- Database persistence

### Release Checklist

Before releasing, verify:

- [ ] All tests passing (`npm test`)

- [ ] CHANGELOG.md updated
- [ ] Version in package.json updated
- [ ] Documentation updated
- [ ] Git tag created
- [ ] Security audit completed

**📖 See [RELEASES.md](./docs/RELEASES.md) for detailed versioning guide**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit your changes: `git commit -am 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

### Documentation

- 📚 [Quick Start Guide](./docs/QUICK_START.md) - Get started in minutes
- 📖 [API Reference](./docs/API_GUIDE.md) - Complete endpoint documentation
- 🔐 [Security Guide](./docs/SECURITY.md) - Authentication, rate limiting, and best practices
- 📦 [Releases & Versioning](./docs/RELEASES.md) - Release process and semantic versioning
- � [Conventional Commits](./docs/CONVENTIONAL_COMMITS.md) - Commit format for automatic versioning
- 🔄 [Commit Workflow](./docs/COMMIT_WORKFLOW.md) - Complete workflow with automated releases
- �🔑 [API Key Management](./docs/API_KEY_MANAGEMENT.md) - Generating, rotating, and managing API keys
- 💻 [Frontend Integration](./docs/FRONTEND_INTEGRATION.md) - Framework examples and patterns
- ⚡ [Quick Reference](./docs/API_KEY_QUICK_REFERENCE.md) - One-page cheat sheet
- 🎯 [Project Purpose](./docs/PURPOSE.md) - Vision and architecture
- 📋 [Changelog](./docs/CHANGELOG.md) - Complete release history

### External Resources

- [Express.js Documentation](https://expressjs.com/)
- [OpenRouter AI](https://openrouter.ai/)
- [Node.js Documentation](https://nodejs.org/)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)

## 👨‍💻 Author

**🫡 Nelaka Withanage**

- **GitHub**: [@NelakaWith](https://github.com/NelakaWith)
- **LinkedIn**: [in/nelaka-withanage](https://www.linkedin.com/in/nelaka-withanage/)
- **Portfolio**: [nelakawith.netlify.app](https://nelakawith.netlify.app/)

---

**Built with ❤️ for AI-powered applications**
