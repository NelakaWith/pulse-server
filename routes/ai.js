const express = require("express");
const router = express.Router();
// const axios = require('axios'); // Uncomment when implementing OpenRouter integration

// Placeholder for future OpenRouter AI integration
router.post("/llm", async (req, res) => {
  try {
    // TODO: Implement OpenRouter AI chat endpoint
    res.status(501).json({
      success: false,
      message: "AI chat endpoint not yet implemented",
      note: "This will integrate with OpenRouter AI in the future",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Placeholder for AI model information
router.get("/models", async (req, res) => {
  try {
    // TODO: Fetch available models from OpenRouter
    res.json({
      success: true,
      message: "Available AI models endpoint",
      note: "This will list OpenRouter AI models in the future",
      placeholder_models: [
        "anthropic/claude-3-haiku",
        "openai/gpt-3.5-turbo",
        "meta-llama/llama-2-70b-chat",
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

module.exports = router;
