// Auth routes
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleswares/middlesware");
const { signupLimiter, loginLimiter } = require("../middleswares/rateLimiterMiddleware");
const authController = require("../controllers/authController");

// User signup (rate limited)
router.post("/signup", signupLimiter, authController.signup);

// User login (rate limited)
router.post("/login", loginLimiter, authController.login);

// User logout
router.get("/logout", authController.logout);

// User profile (auth required)
router.get("/me", isLoggedIn, authController.getMe);

module.exports = router;
