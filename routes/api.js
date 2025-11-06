import express from "express";
import aiRoutes from "./ai.js";
import githubRoutes from "./github.js";

const router = express.Router();

// Use route modules
router.use("/ai", aiRoutes);
router.use("/github", githubRoutes);

// Base API route
router.get("/", (req, res) => {
  res.json({
    message: "Pulse Server API",
    version: "1.0.0",
    description: "AI-powered server with GitHub integration",
    availableRoutes: [
      "GET /api - API information",
      "POST /api/ai/llm - AI chat endpoint",
      "GET /api/ai/models - Available AI models",
      "GET /api/github/status - Check GitHub service status",
      "GET /api/github/repository/:owner/:name - Get repository info",
      "GET /api/github/repository/:owner/:name/issues - Get repository issues",
      "GET /api/github/repository/:owner/:name/pulls - Get repository pull requests",
      "GET /api/github/user/:login/repositories - Get user repositories",
      "GET /api/github/search/repositories?q=query - Search repositories",
    ],
  });
});

export default router;
