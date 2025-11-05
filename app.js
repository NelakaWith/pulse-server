import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import configuration
import { config, isDevelopment } from "./config/index.js";

// Import route modules
import apiRoutes from "./routes/api.js";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/index.js";

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors(config.cors)); // Enable CORS with configuration
app.use(morgan(isDevelopment ? "dev" : "combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

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
    description: "AI-powered server ready for OpenRouter integration",
    version: "1.0.0",
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

export default app;
