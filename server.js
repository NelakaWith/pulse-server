import createApp from "./app.js";
import { config, isDevelopment } from "./config/index.js";
import { Logger } from "./utils/index.js";

const PORT = config.port;

async function startServer() {
  try {
    // Create the app
    const app = await createApp();

    // Start server
    const server = app.listen(PORT, () => {
      Logger.info(`🚀 Server is running on port ${PORT}`);
      Logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      Logger.info(`🌐 API base URL: http://localhost:${PORT}/api`);
      Logger.info(`⚙️  Environment: ${config.nodeEnv}`);

      if (isDevelopment) {
        Logger.info(
          `🔑 OpenRouter configured: ${config.openRouter.apiKey ? "✅" : "❌"}`
        );
      }
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      Logger.info("🛑 Shutdown signal received, shutting down gracefully");
      server.close(() => {
        Logger.info("✅ Process terminated");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    return server;
  } catch (error) {
    Logger.error(`❌ Failed to start server: ${error.stack || error}`);
    process.exit(1);
  }
}

// Start the server
const server = await startServer();

export default server;
