import { parseAnalysisIntoSections } from "../routes/enrichment.js";

describe("parseAnalysisIntoSections", () => {
  test("parses sections correctly", () => {
    const sample = `Overview:\nThis is an overview.\n\nCode Quality:\nGood modularization.\n\nHealth Metrics:\nActive contributors: 2\n\nAreas for Improvement:\nAdd tests.\n\nRecommendations:\nAdd CI.`;
    const result = parseAnalysisIntoSections(sample);
    // console.log('parse result:', result);
    expect(result.overview).toContain("This is an overview");
    expect(result.codeQuality).toContain("Good modularization");
    expect(result.healthMetrics).toContain("Active contributors");
    expect(result.areasForImprovement).toContain("Add tests");
    expect(result.recommendations).toContain("Add CI");
    expect(result.raw).toBeDefined();
  });
});
