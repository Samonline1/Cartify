// Token utilities: JWT sign & HttpOnly cookie management
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET;

// Sign token (7d expiry)
function generateToken(user) {
  if (!jwtSecret) {
    throw new Error("JWT secret not configured");
  }

  return jwt.sign(
    {
      email: user.email,
      id: user._id.toString(),
      role: user.role || "user",
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

// Set cookie (HttpOnly)
function sendTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

// Clear cookie
function clearTokenCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}

module.exports = {
  generateToken,
  sendTokenCookie,
  clearTokenCookie,
};
