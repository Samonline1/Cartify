const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const ApiError = require("../utils/ApiError");

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return next(new ApiError(401, "Not logged in"));
  }

  try {
    if (!jwtSecret) {
      return next(new ApiError(500, "JWT secret not configured"));
    }

    const data = jwt.verify(token, jwtSecret);
    req.user = data;
    next();
  } catch {
    return next(new ApiError(401, "Invalid token"));
  }
}

function isAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }

  next();
}

module.exports = { isLoggedIn, isAdmin };
