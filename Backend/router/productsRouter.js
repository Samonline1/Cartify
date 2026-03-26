// routes/productRouter.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const userModel = require("../models/user");
const postModel = require("../models/posts");
const isLoggedIn = require("../middleswares/middlesware");


// search
router.get("/search", async (req, res) => {
    console.log(req.body);
    
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ msg: "Query is required" });
    }

    const response = await axios.get(
      `https://dummyjson.com/products/search?q=${q}`
    );

    res.json(response.data.products);

  } catch (err) {
    console.log("ji");
    
    res.status(500).json({
      msg: "Error searching products",
      error: err.message
    });
  }
});


 
// by category
 
router.get("/category/:category", async (req, res) => {
  try {
    const response = await axios.get(
      `https://dummyjson.com/products/category/${req.params.category}`
    );

    res.json(response.data.products);

  } catch (err) {
    res.status(500).json({
      msg: "Error fetching category products",
      error: err.message
    });
  }
});


 
// single product
 
router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  
  try {
    const response = await axios.get(
      `https://dummyjson.com/products/${req.params.id}`
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({
      msg: "Product not found",
      error: err.message
    });
  }
});


 
// add cart
 
router.post("/cart/:id", isLoggedIn, async (req, res) => {
  console.log("clciked");
  
  const productId = Number(req.params.id);

  const user = await userModel.findOne({ email: req.user.email });

  let existing = await postModel.findOne({
    user: user._id,
    productId
  });

  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return res.json({ msg: "Quantity increased", item: existing });
  }

  const item = await postModel.create({
    user: user._id,
    productId
  });

  user.content.push(item._id);
  await user.save();

  res.json({ msg: "Added to cart", item });
});


 
// remove cart
 
router.delete("/cart/:id", isLoggedIn, async (req, res) => {
  const productId = Number(req.params.id);

  const user = await userModel.findOne({ email: req.user.email });

  const item = await postModel.findOneAndDelete({
    user: user._id,
    productId
  });

  if (!item) {
    return res.status(404).json({ msg: "Item not in cart" });
  }

  user.content = user.content.filter(
    id => id.toString() !== item._id.toString()
  );

  await user.save();

  res.json({ msg: "Removed from cart" });
});


 
// full cart
 
router.get("/cart/all", isLoggedIn, async (req, res) => {

  console.log(req.body);
  
    if (!req.user) {
      return res.status(401).json({ msg: "Not logged in" });
    }

  try {

    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("content");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const cartItems = user.content;

    const promises = cartItems.map(async (item) => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${item.productId}`
        );

        return {
          ...response.data,
          quantity: item.quantity,
        };
      } catch (err) {
        console.error("Error fetching product:", item.productId);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const fullCart = results.filter(Boolean);

    res.json(fullCart);

  } catch (error) {
    console.error("CART ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


 
// cart total

 
router.get("/cart/total", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("content");

  const promises = user.content.map(item =>
    axios.get(`https://dummyjson.com/products/${item.productId}`)
  );

  const responses = await Promise.all(promises);

  let total = 0;

  responses.forEach((r, i) => {
    total += r.data.price * user.content[i].quantity;
  });

  res.json({ total });
});


module.exports = router;
