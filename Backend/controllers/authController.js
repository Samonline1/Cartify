// Auth controller: signup, login, logout, me
const asyncHandler = require("../utils/asyncHandler");
const { signupUser, loginUser, getUserById } = require("../services/authService");
const { generateToken, sendTokenCookie, clearTokenCookie } = require("../utils/tokenUtils");
const { resetRateLimit } = require("../services/rateLimiterService");

// Signup handler
const signup = asyncHandler(async (req, res) => {
  // Create user
  const { user, safeUser } = await signupUser(req.body);
  // Issue token
  const token = generateToken(user);
  sendTokenCookie(res, token);

  res.status(200).json({
    msg: "Login success",
    user: safeUser,
  });
});

// Login handler
const login = asyncHandler(async (req, res) => {
  // Verify user
  const { user, safeUser } = await loginUser(req.body);
  // Issue token
  const token = generateToken(user);
  sendTokenCookie(res, token);

  // Reset strikes on success
  if (req.rateLimitKey) {
    await resetRateLimit(req.rateLimitKey);
  }

  res.status(200).json({
    msg: "Login success",
    user: safeUser,
  });
});

// Logout handler
const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  clearTokenCookie(res);
  res.status(200).json({ msg: "Logged out" });
});

// Session profile
const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json({ user });
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
};
