const asyncHandler = require("../utils/asyncHandler");
const { signupUser, loginUser, getUserById } = require("../services/authService");
const { generateToken, sendTokenCookie, clearTokenCookie } = require("../utils/tokenUtils");

const signup = asyncHandler(async (req, res) => {
  const { user, safeUser } = await signupUser(req.body);
  const token = generateToken(user);
  sendTokenCookie(res, token);

  res.status(200).json({
    msg: "Login success",
    user: safeUser,
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, safeUser } = await loginUser(req.body);
  const token = generateToken(user);
  sendTokenCookie(res, token);

  res.status(200).json({
    msg: "Login success",
    user: safeUser,
  });
});

const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ msg: "Logged out" });
});

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
