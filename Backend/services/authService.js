const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const ApiError = require("../utils/ApiError");

async function signupUser({ name, username, email, password }) {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existing = await userModel.findOne({ email });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  const displayName = name || username || "";
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name: displayName,
    email,
    password: hash,
  });

  const safeUser = await userModel.findById(user._id).select("-password");
  return { user, safeUser };
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(400, "Wrong password");
  }

  const safeUser = await userModel.findById(user._id).select("-password");
  return { user, safeUser };
}

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
