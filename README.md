# 🚀 Pulse Server

An AI-powered Express.js server designed for seamless integration with OpenRouter AI services. Built with modern Node.js practices and ready for production deployment.

## ✨ Features

- **Express.js Framework** - Fast, unopinionated, minimalist web framework
- **AI Integration Ready** - Pre-configured for OpenRouter AI services
- **Security First** - Helmet.js for security headers and CORS support
- **Request Logging** - Morgan middleware for comprehensive logging
- **Environment Configuration** - dotenv for secure environment management
- **Testing Suite** - Jest testing framework with supertest integration
- **Development Tools** - Nodemon for auto-restart during development
- **Modular Architecture** - Clean separation of routes and middleware

## 📁 Project Structure

```
pulse-server/
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── .env.local            # Environment variables (create from .env.example)
├── .gitignore            # Git ignore rules
├── routes/
│   ├── api.js            # Main API router
│   └── ai.js             # AI/OpenRouter integration routes
├── middleware/
│   └── index.js          # Custom middleware functions
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

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run test suite

## 📊 API Endpoints

### Core Endpoints

- **GET /** - Welcome message and server information
- **GET /health** - Health check endpoint
- **GET /api** - API information and available routes

### AI Endpoints (Coming Soon)

- **POST /api/ai/llm** - AI chat/completion endpoint
- **GET /api/ai/models** - List available AI models

## 🔒 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# AI Model Configuration
DEFAULT_AI_MODEL=anthropic/claude-3-haiku
MAX_TOKENS=1000
TEMPERATURE=0.7
```

## 🤖 OpenRouter Integration

This server is pre-configured for OpenRouter AI integration. To enable AI features:

1. **Get an OpenRouter API key** from [OpenRouter.ai](https://openrouter.ai)
2. **Add your API key** to the `.env.local` file
3. **Implement the AI endpoints** in `routes/ai.js`

### Example AI Implementation

```javascript
// Example implementation for the /api/ai/llm endpoint
router.post("/llm", async (req, res) => {
  try {
    const { message, model = process.env.DEFAULT_AI_MODEL } = req.body;

    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: model,
        messages: [{ role: "user", content: message }],
        max_tokens: parseInt(process.env.MAX_TOKENS),
        temperature: parseFloat(process.env.TEMPERATURE),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
```

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

- [Express.js Documentation](https://expressjs.com/)
- [OpenRouter AI](https://openrouter.ai/)
- [Node.js Documentation](https://nodejs.org/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for AI-powered applications**
