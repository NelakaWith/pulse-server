const request = require("supertest");
const app = require("../server");

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

  test("GET /nonexistent should return 404", async () => {
    const response = await request(app).get("/nonexistent").expect(404);

    expect(response.body.error).toBe("Route not found");
  });
});
