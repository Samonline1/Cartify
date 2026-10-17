// Admin controller: admin auth, metrics, users, products
const asyncHandler = require("../utils/asyncHandler");
const {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getUsersList,
  getUserDetails,
  deleteUser: removeUser,
  getAdminProducts,
} = require("../services/adminService");
const { generateToken, sendTokenCookie, clearTokenCookie } = require("../utils/tokenUtils");
const { resetRateLimit } = require("../services/rateLimiterService");

// Admin login
const login = asyncHandler(async (req, res) => {
  const user = await loginAdmin(req.body);
  // Issue token
  const token = generateToken(user);
  sendTokenCookie(res, token);

  // Reset strikes on success
  if (req.rateLimitKey) {
    await resetRateLimit(req.rateLimitKey);
  }

  res.status(200).json({
    msg: "Admin login success",
    user: { name: user.name, email: user.email, role: user.role },
  });
});

// Admin logout
const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  clearTokenCookie(res);
  res.status(200).json({ msg: "Admin logged out" });
});

// Admin profile
const getMe = asyncHandler(async (req, res) => {
  const user = await getAdminProfile(req.user.email);
  res.status(200).json({ user });
});

// Dashboard stats (cached)
const getDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  res.status(200).json({ stats });
});

// List users
const getUsers = asyncHandler(async (req, res) => {
  const users = await getUsersList(req.query.q);
  res.status(200).json({ users });
});

// User detail
const getUser = asyncHandler(async (req, res) => {
  const user = await getUserDetails(req.params.id);
  res.status(200).json({ user });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  await removeUser(req.params.id);
  res.status(200).json({ msg: "User deleted" });
});

// Admin products
const getProducts = asyncHandler(async (req, res) => {
  const { q = "", category = "", sort = "title" } = req.query;
  const products = await getAdminProducts({ q, category, sort });
  res.status(200).json({ products });
});

module.exports = {
  login,
  logout,
  getMe,
  getDashboard,
  getUsers,
  getUser,
  deleteUser,
  getProducts,
};
