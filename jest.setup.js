// Jest setup file
// Set NODE_ENV to 'test' during test runs
process.env.NODE_ENV = "test";

// Suppress OpenRouter API error logs during tests
const originalError = console.error;
console.error = (...args) => {
  // Only log errors that are not from expected test scenarios
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("OpenRouter API Error")
  ) {
    // Suppress OpenRouter API errors during tests
    return;
  }
  originalError.call(console, ...args);
};
