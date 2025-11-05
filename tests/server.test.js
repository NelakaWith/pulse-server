import request from "supertest";
import app from "../app.js";

describe("Server", () => {
  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/").expect(200);

    expect(response.body.message).toBe("Welcome to Pulse Server");
    expect(response.body.description).toBe(
      "AI-powered server ready for OpenRouter integration"
    );
  });

  test("GET /health should return health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("OK");
  });

  test("GET /api should return API info", async () => {
    const response = await request(app).get("/api").expect(200);

    expect(response.body.message).toBe("Pulse Server API");
  });

  test("GET /api/ai/models should return AI models info", async () => {
    const response = await request(app).get("/api/ai/models").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.placeholder_models).toBeDefined();
  });

  test("POST /api/ai/llm should return proper error when API key not configured", async () => {
    const response = await request(app)
      .post("/api/ai/llm")
      .send({ message: "test" })
      .expect(501);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("OpenRouter API key is not configured");
  });

  test("POST /api/ai/llm should return error when message is missing", async () => {
    const response = await request(app)
      .post("/api/ai/llm")
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Message is required");
  });

  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent").expect(404);

    expect(response.body.error).toBe("Route not found");
  });
});
