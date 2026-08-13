const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleswares/middlesware");
const productsController = require("../controllers/productsController");

router.get("/cart/all", isLoggedIn, productsController.cartAll);
router.get("/cart/total", isLoggedIn, productsController.cartTotal);
router.get("/checkout/all", isLoggedIn, productsController.checkoutAll);
router.get("/checkout/total", isLoggedIn, productsController.checkoutTotal);
router.post("/checkout", isLoggedIn, productsController.checkout);
router.post("/cart/:id", isLoggedIn, productsController.addToCart);
router.delete("/cart/:id", isLoggedIn, productsController.deleteFromCart);
router.get("/search", productsController.search);
router.get("/category/:category", productsController.category);
router.get("/asksearch", productsController.askSearch);
router.get("/:id", productsController.product);

module.exports = router;
