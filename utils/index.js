/**
 * Logger utility with different log levels
 */
export class Logger {
  static info(message, ...args) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static error(message, ...args) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static warn(message, ...args) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  }

  static debug(message, ...args) {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        ...args
      );
    }
  }
}

/**
 * Response helper utilities
 */
export class ResponseHelper {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res,
    error,
    statusCode = 500,
    message = "Internal Server Error"
  ) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      details: typeof error === "string" ? error : error.message,
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(res, message = "Resource not found") {
    return res.status(404).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }

  static badRequest(res, message = "Bad request") {
    return res.status(400).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Validation helper utilities
 */
export class ValidationHelper {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  static isValidLength(value, min = 0, max = Infinity) {
    if (typeof value !== "string") return false;
    return value.length >= min && value.length <= max;
  }

  static sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  }
}

/**
 * Async wrapper for better error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
