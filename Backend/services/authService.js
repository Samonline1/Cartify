// Auth service: user creation & credential verification
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const ApiError = require("../utils/ApiError");

// Signup user
async function signupUser({ name, username, email, password }) {
  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Duplicate check
  const existing = await userModel.findOne({ email });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  // Hash password
  const displayName = name || username || "";
  const hash = await bcrypt.hash(password, 10);

  // Create record
  const user = await userModel.create({
    name: displayName,
    email,
    password: hash,
  });

  // Safe user
  const safeUser = await userModel.findById(user._id).select("-password");
  return { user, safeUser };
}

// Login user
async function loginUser({ email, password }) {
  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // Compare hash
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(400, "Wrong password");
  }

  // Safe user
  const safeUser = await userModel.findById(user._id).select("-password");
  return { user, safeUser };
}

// User lookup
async function getUserById(id) {
  const user = await userModel.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
}

module.exports = {
  signupUser,
  loginUser,
  getUserById,
};
