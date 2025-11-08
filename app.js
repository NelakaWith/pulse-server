import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import configuration
import { config, isDevelopment } from "./config/index.js";

// Import route modules
import apiRoutes from "./routes/api.js";

// Import middleware
import {
  errorHandler,
  notFoundHandler,
  validateApiKey,
  rateLimit as rateLimitMiddleware,
} from "./middleware/index.js";
import { Logger } from "./utils/index.js";

async function createApp() {
  const app = express();

  // Middleware
  app.use(helmet()); // Security headers
  app.use(cors(config.cors)); // Enable CORS with configuration
  app.use(morgan(isDevelopment ? "dev" : "combined")); // Logging
  app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with limit
  app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

  // Apply rate limiting globally
  app.use(rateLimitMiddleware(config.rateLimit.windowMs, config.rateLimit.max));

  // Log API key configuration on startup
  if (config.apiKey.enabled) {
    Logger.info(`🔐 API Key authentication is ENABLED`);
  } else {
    Logger.info(
      `⚠️  API Key authentication is DISABLED (set API_KEY_AUTH_ENABLED=true to enable)`
    );
  }

  // Apply API key validation to all API routes
  app.use("/api", validateApiKey);

  // Routes
  app.use("/api", apiRoutes);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Welcome to Pulse Server",
      description: "AI-powered server with GitHub integration",
      version: "1.0.0",
      status: "Running with auto-restart enabled! 🔄",
      endpoints: {
        health: "/health",
        api: "/api",
      },
    });
  });

  // 404 handler
  app.use("*", notFoundHandler);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
export default createApp;
