// Admin routes
const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleswares/middlesware");
const { adminLoginLimiter } = require("../middleswares/rateLimiterMiddleware");
const adminController = require("../controllers/adminController");

// Admin login (rate limited)
router.post("/login", adminLoginLimiter, adminController.login);

// Admin logout
router.post("/logout", adminController.logout);

// Admin profile
router.get("/me", isLoggedIn, isAdmin, adminController.getMe);

// Dashboard metrics (cached)
router.get("/dashboard", isLoggedIn, isAdmin, adminController.getDashboard);

// List users
router.get("/users", isLoggedIn, isAdmin, adminController.getUsers);

// User details
router.get("/users/:id", isLoggedIn, isAdmin, adminController.getUser);

// Delete user
router.delete("/users/:id", isLoggedIn, isAdmin, adminController.deleteUser);

// Admin products
router.get("/products", isLoggedIn, isAdmin, adminController.getProducts);

module.exports = router;
