import { Logger } from "../utils/index.js";
import { config } from "../config/index.js";

// API Key validation middleware
export const validateApiKey = (req, res, next) => {
  // Skip validation if API key auth is disabled
  if (!config.apiKey.enabled) {
    return next();
  }

  // Get API key from header or query parameter
  const apiKey = req.header("X-API-Key") || req.query.api_key;

  if (!apiKey) {
    Logger.warn(`API request rejected: Missing API key from ${req.ip}`);
    return res.status(401).json({
      success: false,
      error:
        "Access denied. API key required. Provide via X-API-Key header or ?api_key=xxx query parameter.",
    });
  }

  // Validate API key
  if (!config.apiKey.keys.includes(apiKey)) {
    Logger.warn(`API request rejected: Invalid API key from ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: "Invalid API key.",
    });
  }

  // Store API key in request for rate limiting differentiation
  req.apiKey = apiKey;
  Logger.debug(
    `API request authenticated with key: ${apiKey.substring(0, 10)}...`
  );

  next();
};

// Authentication middleware example
export const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
    });
  }

  try {
    // In a real app, you would verify the JWT token here
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;

    // For now, just pass through
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid token.",
    });
  }
};

// Enhanced rate limiting middleware with API key support
// Track all active intervals for cleanup
const activeIntervals = [];

export const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map(); // Map to track requests: "ip" or "apiKey" -> [timestamps]
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    const windowStart = now - windowMs;

    for (const [key, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter((time) => time > windowStart);

      if (validTimestamps.length > 0) {
        requests.set(key, validTimestamps);
      } else {
        requests.delete(key);
      }
    }
  }, windowMs);

  // Track this interval
  activeIntervals.push(cleanupInterval);

  const middleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const identifier = req.apiKey ? `key:${req.apiKey}` : `ip:${ip}`; // Use API key if available
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }

    const identifierRequests = requests.get(identifier);
    const validRequests = identifierRequests.filter(
      (time) => time > windowStart
    );

    // Use higher limit for authenticated API keys
    const limit = req.apiKey ? config.rateLimit.maxPerApiKey : max;

    if (validRequests.length >= limit) {
      Logger.warn(
        `Rate limit exceeded for ${identifier}: ${validRequests.length}/${limit} requests in ${windowMs}ms`
      );
      return res.status(429).json({
        success: false,
        error: `Too many requests. Limit: ${limit} requests per ${Math.round(
          windowMs / 1000 / 60
        )} minutes.`,
        retryAfter: Math.ceil((windowMs - (now - validRequests[0])) / 1000),
      });
    }

    validRequests.push(now);
    requests.set(identifier, validRequests);

    // Add rate limit info to response headers
    res.set("X-RateLimit-Limit", limit.toString());
    res.set("X-RateLimit-Remaining", (limit - validRequests.length).toString());
    res.set(
      "X-RateLimit-Reset",
      new Date(validRequests[0] + windowMs).toISOString()
    );

    next();
  };

  middleware.cleanup = () => {
    clearInterval(cleanupInterval);
    const index = activeIntervals.indexOf(cleanupInterval);
    if (index > -1) {
      activeIntervals.splice(index, 1);
    }
  };

  return middleware;
};

// Export a function to cleanup all active intervals
export const cleanupAllRateLimits = () => {
  activeIntervals.forEach((interval) => clearInterval(interval));
  activeIntervals.length = 0;
};

// Request validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    next();
  };
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  Logger.error(`Error Handler: ${err.stack || err}`);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

// 404 handler middleware
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
};
