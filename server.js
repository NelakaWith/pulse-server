import app from "./app.js";
import { config, isDevelopment } from "./config/index.js";

const PORT = config.port;

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);

  if (isDevelopment) {
    console.log(
      `🔑 OpenRouter configured: ${config.openRouter.apiKey ? "✅" : "❌"}`
    );
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});

export default server;
