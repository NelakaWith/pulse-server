import axios from "axios";

const baseURL = "http://localhost:3000";

async function testAPIEndpoints() {
  console.log("🧪 Testing Pulse Server API Endpoints...\n");

  try {
    // Test health endpoint
    console.log("1️⃣ Testing Health Endpoint...");
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log("✅ Health check passed:", healthResponse.data.status);

    // Test root endpoint
    console.log("\n2️⃣ Testing Root Endpoint...");
    const rootResponse = await axios.get(`${baseURL}/`);
    console.log("✅ Root endpoint passed:", rootResponse.data.message);

    // Test API info endpoint
    console.log("\n3️⃣ Testing API Info Endpoint...");
    const apiResponse = await axios.get(`${baseURL}/api`);
    console.log("✅ API info passed:", apiResponse.data.message);
    console.log("📋 Available routes:", apiResponse.data.availableRoutes);

    // Test AI models endpoint
    console.log("\n4️⃣ Testing AI Models Endpoint...");
    const modelsResponse = await axios.get(`${baseURL}/api/ai/models`);
    console.log("✅ AI models endpoint passed");
    console.log(
      `📊 Found ${modelsResponse.data.data?.data?.length || 0} models`
    );

    // Test AI chat endpoint
    console.log("\n5️⃣ Testing AI Chat Endpoint...");
    const chatResponse = await axios.post(`${baseURL}/api/ai/llm`, {
      message: 'Say "API test successful" in exactly those words.',
    });
    console.log("✅ AI chat endpoint passed");
    console.log(`💬 AI Response: ${chatResponse.data.data.content}`);
    console.log(`📊 Token usage:`, chatResponse.data.usage);

    console.log("\n🎉 All API endpoints are working perfectly!");
  } catch (error) {
    console.log("❌ API test failed:");
    console.log(`Error: ${error.response?.data?.error || error.message}`);
    console.log(`Status: ${error.response?.status || "Unknown"}`);
  }
}

// Run the API tests
testAPIEndpoints();
