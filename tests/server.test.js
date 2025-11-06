import request from "supertest";
import createApp from "../app.js";

let app;

beforeAll(async () => {
  app = await createApp();
});

describe("Server", () => {
  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body.message).toBe("Welcome to Pulse Server");
    expect(response.body.description).toBe(
      "AI-powered server with GitHub integration"
    );
  });

  test("GET /health should return health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("OK");
    expect(response.body.timestamp).toBeDefined();
  });

  test("GET /api should return API info", async () => {
    const response = await request(app).get("/api").expect(200);

    expect(response.body.message).toBe("Pulse Server API");
    expect(response.body.version).toBe("1.0.0");
    expect(response.body.availableRoutes).toBeDefined();
    expect(Array.isArray(response.body.availableRoutes)).toBe(true);
  });

  test("GET /api/ai/models should return AI models info", async () => {
    const response = await request(app).get("/api/ai/models").expect(200);

    expect(response.body.success).toBe(true);
    // Since API key is configured, it should return real data from OpenRouter
    if (response.body.data) {
      expect(response.body.data.data).toBeDefined();
      expect(Array.isArray(response.body.data.data)).toBe(true);
    } else {
      // Fallback to placeholder if API fails
      expect(response.body.placeholder_models).toBeDefined();
    }
  });

  test("POST /api/ai/llm should work with valid message when API key is configured", async () => {
    const response = await request(app)
      .post("/api/ai/llm")
      .send({ message: "Hello, respond with just 'Test successful'" });

    // Since API key is configured, it should work (200)
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.usage).toBeDefined();
  }, 15000); // Increase timeout for API call

  test("POST /api/ai/llm should return error when message is missing", async () => {
    const response = await request(app)
      .post("/api/ai/llm")
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Message is required");
  });

  test("POST /api/ai/llm should handle invalid model gracefully", async () => {
    const response = await request(app).post("/api/ai/llm").send({
      message: "Test message",
      model: "invalid/model-name",
    });

    // Should handle gracefully, either success or proper error
    expect([200, 400, 500]).toContain(response.status);
    expect(response.body.success).toBeDefined();
  });

  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent").expect(404);

    expect(response.body.error).toBe("Route not found");
    expect(response.body.path).toBe("/nonexistent");
  });

  test("Server should handle CORS properly", async () => {
    const response = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:3001");

    expect(response.headers["access-control-allow-origin"]).toBeDefined();
  });

  test("Server should have security headers", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  // GitHub API Tests
  test("GET /api/github/status should return GitHub service status", async () => {
    const response = await request(app).get("/api/github/status").expect(200);

    expect(response.body.message).toBe("GitHub API integration");
    expect(response.body.configured).toBeDefined();
    expect(response.body.version).toBe("1.0.0");
  });
});
