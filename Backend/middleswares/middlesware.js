// Auth middleware: JWT verify & role check
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const ApiError = require("../utils/ApiError");

// Verify login
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  // Missing token
  if (!token) {
    return next(new ApiError(401, "Not logged in"));
  }

  try {
    if (!jwtSecret) {
      return next(new ApiError(500, "JWT secret not configured"));
    }

    // Decode JWT
    const data = jwt.verify(token, jwtSecret);
    req.user = data;
    next();
  } catch {
    // Invalid token
    return next(new ApiError(401, "Invalid token"));
  }
}

// Role check: admin
function isAdmin(req, res, next) {
  // Not admin
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }

  next();
}

module.exports = { isLoggedIn, isAdmin };
