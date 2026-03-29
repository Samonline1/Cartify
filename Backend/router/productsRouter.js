// routes/productRouter.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const userModel = require("../models/user");
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
  console.log(req.params.id);
  
  try {
    const productId = Number(req.params.id); // don't convert to Number if using ObjectId

    const user = await userModel.findOne({ email: req.user.email });

    // check if product already exists in cart
    const existingItem = user.cart.find(
      (item) => item.product === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();

    res.json({ msg: "added to cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating cart" });
  }
});


 
// remove cart
 
router.delete("/cart/:id", isLoggedIn, async (req, res) => {
  try {
    const productId = req.params.id;

    // console.log("product id", productId);
    
    // console.log("user", req.user);
    

    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.user.email }, // find by email
      {
        $pull: {
          cart: { product: productId }
        }
      },
      { new: true } 
    );

    // console.log("user", updatedUser);
    
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Removed from cart",
      cart: updatedUser.cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error removing item" });
  }
});


 
// full cart
 
router.get("/cart/all", isLoggedIn, async (req, res) => {

  // console.log(req.body);
  
     if (!req.user) {
      return res.status(401).json({ msg: "Not logged in" });
      console.log(req.user);
    }

  try {

    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const cartItems = user.cart;
    // console.log(cartItems);
    

    const promises = cartItems.map(async (item) => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${item.product}`
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

    // console.log(results);
    

    res.json(fullCart);

  } catch (error) {
    console.error("CART ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


 
// cart total

 
router.get("/cart/total", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
    .findOne({ email: req.user.email })
    

    // console.log(user.cart.map(p => p.product));

    const validItems = user.cart.filter(item => item.product);
    // console.log(validItems.map(p => p.product));

  const promises = validItems.map(item =>
    axios.get(`https://dummyjson.com/products/${item.product}`)
  );

  const responses = await Promise.all(promises);

  // console.log(responses);


  let total = 0;

  responses.forEach((r, i) => {
    total += r.data.price * user.cart[i].quantity;
  });

  res.json({ total });
  } catch (error) {
    // console.error(error);
    res.status(501).json({msg: "err calculating total!", error})
  }
});


module.exports = router;
