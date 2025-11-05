import express from "express";
import aiRoutes from "./ai.js";

const router = express.Router();

// Use route modules
router.use("/ai", aiRoutes);

// Base API route
router.get("/", (req, res) => {
  res.json({
    message: "Pulse Server API",
    version: "1.0.0",
    description: "Ready for OpenRouter AI integration",
    availableRoutes: [
      "GET /api - API information",
      "POST /api/ai/llm - AI chat endpoint (coming soon)",
      "GET /api/ai/models - Available AI models",
    ],
  });
});

export default router;
