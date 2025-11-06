import express from "express";
import { openRouterService } from "../services/openRouterService.js";
import { Logger } from "../utils/index.js";

const router = express.Router();

// AI chat completion endpoint
router.post("/llm", async (req, res) => {
  try {
    const { message, model, ...options } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    if (!openRouterService.isConfigured()) {
      return res.status(501).json({
        success: false,
        message: "OpenRouter API key is not configured",
        note: "Please set OPENROUTER_API_KEY in your environment variables",
      });
    }

    const result = await openRouterService.chatCompletion(
      message,
      model,
      options
    );

    if (!result.success) {
      return res.status(result.status || 500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data.choices[0]?.message || result.data,
      usage: result.usage,
    });
  } catch (error) {
    Logger.error(`AI endpoint error: ${error.stack || error}`);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get available AI models
router.get("/models", async (req, res) => {
  try {
    if (!openRouterService.isConfigured()) {
      return res.json({
        success: true,
        message: "Available AI models endpoint",
        note: "OpenRouter API key not configured - showing placeholder models",
        placeholder_models: [
          "anthropic/claude-3-haiku",
          "openai/gpt-3.5-turbo",
          "meta-llama/llama-2-70b-chat",
        ],
      });
    }

    const result = await openRouterService.getModels();

    if (!result.success) {
      return res.status(result.status || 500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    Logger.error(`Models endpoint error: ${error.stack || error}`);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

export default router;
