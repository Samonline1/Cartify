// Centralized error middleware
const ApiError = require("../utils/ApiError");

// Global error handler
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode) || 500;
  const message = err.message || "Internal Server Error";

  // Standard JSON response
  res.status(statusCode).json({
    msg: message,
    success: false,
    errors: err.errors || [],
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

// 404 handler
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
