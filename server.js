import createApp from "./app.js";
import { config, isDevelopment } from "./config/index.js";

const PORT = config.port;

async function startServer() {
  try {
    // Create the app
    const app = await createApp();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
      console.log(` Environment: ${config.nodeEnv}`);

      if (isDevelopment) {
        console.log(
          `🔑 OpenRouter configured: ${config.openRouter.apiKey ? "✅" : "❌"}`
        );
      }
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log("🛑 Shutdown signal received, shutting down gracefully");
      server.close(() => {
        console.log("✅ Process terminated");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
const server = await startServer();

export default server;
