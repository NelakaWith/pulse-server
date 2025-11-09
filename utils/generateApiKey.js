import crypto from "crypto";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Generate a secure random API key
 * Format: sk-[environment]-[random]
 *n
 * @param {string} environment - Environment prefix (prod, staging, dev)
 * @returns {string} A secure random API key
 *
 * @example
 * generateApiKey('prod') // sk-prod-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 */
export function generateApiKey(environment = "dev") {
  const prefix = `sk-${environment}`;
  const randomBytes = crypto.randomBytes(24).toString("hex");
  return `${prefix}-${randomBytes}`;
}

/**
 * Generate multiple API keys
 *
 * @param {number} count - Number of keys to generate
 * @param {string} environment - Environment prefix
 * @returns {string[]} Array of secure random API keys
 *
 * @example
 * generateApiKeys(3, 'prod')
 * Generates an array of API keys with the format:
 * 'sk-{environment}-{randomHex}'
 * Example:
 * [
 *   'sk-prod-<randomHex>',
 *   'sk-prod-<randomHex>',
 *   'sk-prod-<randomHex>'
 *  ]
 */
export function generateApiKeys(count = 1, environment = "dev") {
  return Array.from({ length: count }, () => generateApiKey(environment));
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid format
 */
export function isValidApiKeyFormat(apiKey) {
  // Check if starts with 'sk-' and has valid format
  return /^sk-[a-z0-9]+-[a-f0-9]{48}$/.test(apiKey);
}

/**
 * Hash API key for secure storage (one-way)
 * @param {string} apiKey - API key to hash
 * @returns {string} SHA-256 hash
 */
export function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

// CLI: Generate keys when run directly
const __filename = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const environment = process.argv[2] || "dev";
  const count = parseInt(process.argv[3]) || 1;

  console.log(
    `\n🔑 Generating ${count} API key(s) for ${environment} environment:\n`
  );

  const keys = generateApiKeys(count, environment);
  keys.forEach((key, index) => {
    console.log(`${index + 1}. ${key}`);
  });

  console.log("\n📝 Add these to your .env file:");
  console.log(`API_KEYS=${keys.join(",")}\n`);

  console.log("🔒 Hashed versions (for database storage):");
  keys.forEach((key) => {
    console.log(`   ${hashApiKey(key)}`);
  });

  console.log("");
}
