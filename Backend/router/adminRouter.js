const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleswares/middlesware");
const adminController = require("../controllers/adminController");

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);

router.get("/me", isLoggedIn, isAdmin, adminController.getMe);
router.get("/dashboard", isLoggedIn, isAdmin, adminController.getDashboard);
router.get("/users", isLoggedIn, isAdmin, adminController.getUsers);
router.get("/users/:id", isLoggedIn, isAdmin, adminController.getUser);
router.delete("/users/:id", isLoggedIn, isAdmin, adminController.deleteUser);
router.get("/products", isLoggedIn, isAdmin, adminController.getProducts);

module.exports = router;
