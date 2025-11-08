/** @type {import('jest').Config} */
const config = {
  transform: {
    "^.+\\.mjs$": "babel-jest",
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^(.{1,2}/.*).js$": "$1",
  },
  // Global test timeout (30 seconds per test)
  testTimeout: 30000,
};

export default config;
