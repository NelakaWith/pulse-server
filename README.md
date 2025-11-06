# 🚀 Pulse Server

An AI-powered Express.js server designed for seamless integration with OpenRouter AI services. Built with modern Node.js practices and ready for production deployment.

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

## � Documentation

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
- �🔧 Environment configuration
- 🚀 Advanced usage

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

## 🔒 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

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

# Logging
LOG_LEVEL=info
```

**📖 See [QUICK_START.md](./docs/QUICK_START.md#setup) for detailed setup instructions**

## 🤖 OpenRouter Integration

This server is fully integrated with OpenRouter AI. Features include:

1. **AI Chat Completions** - Direct access to multiple AI models
2. **Repository Analysis** - AI-powered code quality and repository health analysis
3. **Issue Summarization** - Automatic summarization of repository issues
4. **Flexible Model Selection** - Switch between different AI models via configuration

To enable AI features:

1. **Get an OpenRouter API key** from [OpenRouter.ai](https://openrouter.ai)
2. **Add your API key** to `.env.local` (OPENROUTER_API_KEY)
3. **Start using AI endpoints** - See [QUICK_START.md](./docs/QUICK_START.md) for examples

### Example: Analyze a Repository with AI

```bash
curl -X POST http://localhost:3000/api/enrichment \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "facebook",
    "name": "react",
    "scope": "repo",
    "task": "analyze",
    "question": "What is the overall code quality?"
  }'
```

**📖 See [API_GUIDE.md](./docs/API_GUIDE.md#4-repository-enrichment-primary-endpoint) for complete examples**

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The project includes comprehensive tests for:

- Server startup and health checks
- API endpoint responses
- Error handling
- Route availability

## 🛡️ Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Input Validation** - Built-in Express.js body parsing with size limits
- **Error Handling** - Comprehensive error middleware

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

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL certificates
- [ ] Configure logging
- [ ] Set up monitoring

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

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
- 🎯 [Project Purpose](./docs/PURPOSE.md) - Vision and architecture

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
