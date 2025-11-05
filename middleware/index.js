// Authentication middleware example
const auth = (req, res, next) => {
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

// Rate limiting middleware example
const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const ipRequests = requests.get(ip);
    const validRequests = ipRequests.filter((time) => time > windowStart);

    if (validRequests.length >= max) {
      return res.status(429).json({
        success: false,
        error: "Too many requests from this IP, please try again later.",
      });
    }

    validRequests.push(now);
    requests.set(ip, validRequests);

    next();
  };
};

// Request validation middleware
const validateRequest = (schema) => {
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

module.exports = {
  auth,
  rateLimit,
  validateRequest,
};
