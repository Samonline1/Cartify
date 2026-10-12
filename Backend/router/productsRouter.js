// Product & Cart routes
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleswares/middlesware");
const { searchLimiter } = require("../middleswares/rateLimiterMiddleware");
const productsController = require("../controllers/productsController");

// Cart view (cached)
router.get("/cart/all", isLoggedIn, productsController.cartAll);

// Cart total (cached)
router.get("/cart/total", isLoggedIn, productsController.cartTotal);

// Order history
router.get("/checkout/all", isLoggedIn, productsController.checkoutAll);

// Order total
router.get("/checkout/total", isLoggedIn, productsController.checkoutTotal);

// Order checkout
router.post("/checkout", isLoggedIn, productsController.checkout);

// Add item
router.post("/cart/:id", isLoggedIn, productsController.addToCart);

// Delete item
router.delete("/cart/:id", isLoggedIn, productsController.deleteFromCart);

// Search catalog (rate limited & cached)
router.get("/search", searchLimiter, productsController.search);

// Category filter (cached)
router.get("/category/:category", productsController.category);

// AI search (rate limited & cached)
router.get("/asksearch", searchLimiter, productsController.askSearch);

// Single product (cached)
router.get("/:id", productsController.product);

module.exports = router;
