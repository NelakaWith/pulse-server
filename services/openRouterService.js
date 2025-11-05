import axios from "axios";
import { config } from "../config/index.js";

class OpenRouterService {
  constructor() {
    this.apiKey = config.openRouter.apiKey;
    this.baseUrl = config.openRouter.baseUrl;
    this.defaultModel = config.openRouter.defaultModel;
    this.maxTokens = config.openRouter.maxTokens;
    this.temperature = config.openRouter.temperature;
  }

  /**
   * Send a chat completion request to OpenRouter
   * @param {string} message - The user message
   * @param {string} model - The AI model to use (optional)
   * @param {Object} options - Additional options (optional)
   * @returns {Promise<Object>} The AI response
   */
  async chatCompletion(message, model = null, options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is not configured");
    }

    const requestBody = {
      model: model || this.defaultModel,
      messages: [{ role: "user", content: message }],
      max_tokens: options.maxTokens || this.maxTokens,
      temperature: options.temperature || this.temperature,
      ...options,
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Pulse Server",
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return {
        success: true,
        data: response.data,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error(
        "OpenRouter API Error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        error: error.response?.data?.error || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Get available models from OpenRouter
   * @returns {Promise<Object>} List of available models
   */
  async getModels() {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is not configured");
    }

    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "OpenRouter Models API Error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        error: error.response?.data?.error || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  /**
   * Check if the service is properly configured
   * @returns {boolean} True if API key is configured
   */
  isConfigured() {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
export default OpenRouterService;
