import { openRouterService } from "./services/openRouterService.js";
import { config } from "./config/index.js";

async function testOpenRouterConnection() {
  console.log("🧪 Testing OpenRouter Connection...");
  console.log(
    `📋 API Key configured: ${config.openRouter.apiKey ? "✅" : "❌"}`
  );
  console.log(`🤖 Default Model: ${config.openRouter.defaultModel}`);
  console.log(`🌐 Base URL: ${config.openRouter.baseUrl}`);

  if (!openRouterService.isConfigured()) {
    console.log("❌ OpenRouter API key is not configured");
    return;
  }

  try {
    console.log("\n🔍 Testing AI chat completion...");
    const result = await openRouterService.chatCompletion(
      'Hello! Please respond with just "Connection successful" to test the API.',
      config.openRouter.defaultModel
    );

    if (result.success) {
      console.log("✅ Chat completion successful!");
      console.log(
        `💬 Response: ${
          result.data.choices[0]?.message?.content || "No content"
        }`
      );
      console.log(`📊 Usage:`, result.usage);
    } else {
      console.log("❌ Chat completion failed:");
      console.log(`Error: ${result.error}`);
      console.log(`Status: ${result.status}`);
    }

    console.log("\n🔍 Testing models endpoint...");
    const modelsResult = await openRouterService.getModels();

    if (modelsResult.success) {
      console.log("✅ Models endpoint successful!");
      console.log(
        `📋 Available models: ${
          modelsResult.data.data?.length || 0
        } models found`
      );

      // Show first few models
      if (modelsResult.data.data && modelsResult.data.data.length > 0) {
        console.log("🎯 First 5 models:");
        modelsResult.data.data.slice(0, 5).forEach((model, index) => {
          console.log(`  ${index + 1}. ${model.id}`);
        });
      }
    } else {
      console.log("❌ Models endpoint failed:");
      console.log(`Error: ${modelsResult.error}`);
    }
  } catch (error) {
    console.log("❌ Test failed with error:");
    console.log(error.message);
  }
}

// Run the test
testOpenRouterConnection();
