const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const userModel = require("../models/user");
const { isLoggedIn, isAdmin } = require("../middleswares/middlesware");

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET;
const productsApiBase = process.env.CATALOG_BASE_URL || "";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(400).json({ msg: "Admin not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    if (!jwtSecret) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      jwtSecret
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      msg: "Admin login success",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ msg: "Error processing admin login" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res.json({ msg: "Admin logged out" });
});

router.get("/me", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email }).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Error loading admin profile" });
  }
});

router.get("/dashboard", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const [users, admins] = await Promise.all([
      userModel.find({}).select("-password"),
      userModel.countDocuments({ role: "admin" }),
    ]);

    const customers = users.filter((user) => user.role !== "admin");
    const totalCartItems = users.reduce((sum, user) => {
      return sum + (user.cart || []).reduce((cartSum, item) => cartSum + (item.quantity || 0), 0);
    }, 0);
    const purchasedItems = users.flatMap((user) => user.purchased || []);
    const totalOrders = purchasedItems.length;
    const totalRevenue = purchasedItems.reduce(
      (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)),
      0
    );

    const productsResponse = await axios.get(`${productsApiBase}?limit=0`);
    const products = productsResponse.data.products || [];
    const categories = [...new Set(products.map((product) => product.category))].length;

    res.json({
      stats: {
        totalUsers: customers.length,
        totalAdmins: admins,
        totalProducts: products.length,
        totalCategories: categories,
        totalCartItems,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Error loading dashboard" });
  }
});

router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const q = (req.query.q || "").trim().toLowerCase();
    const users = await userModel.find({}).select("-password");

    const filtered = q
      ? users.filter((user) => {
          const haystack = `${user.name || ""} ${user.email || ""}`.toLowerCase();
          return haystack.includes(q);
        })
      : users;

    const mapped = filtered.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cartCount: (user.cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
      purchasedCount: (user.purchased || []).reduce((sum) => sum + 1, 0),
    }));

    res.json({ users: mapped });
  } catch (err) {
    res.status(500).json({ msg: "Error loading users" });
  }
});

router.get("/users/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Error loading user" });
  }
});

router.delete("/users/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ msg: "Admin users cannot be deleted" });
    }

    await userModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user" });
  }
});

router.get("/products", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { q = "", category = "", sort = "title" } = req.query;
    const url = q
      ? `${productsApiBase}/search?q=${encodeURIComponent(q)}`
      : `${productsApiBase}?limit=0`;

    const response = await axios.get(url);
    let products = response.data.products || [];

    if (category) {
      products = products.filter((product) => product.category === category);
    }

    const sorters = {
      title: (a, b) => a.title.localeCompare(b.title),
      price: (a, b) => a.price - b.price,
      rating: (a, b) => b.rating - a.rating,
      stock: (a, b) => b.stock - a.stock,
    };

    products = products.sort(sorters[sort] || sorters.title);

    res.json({
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        rating: product.rating,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: "Error loading products" });
  }
});

module.exports = router;
