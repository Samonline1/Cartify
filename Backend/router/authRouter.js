const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleswares/middlesware");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", isLoggedIn, authController.getMe);

module.exports = router;
