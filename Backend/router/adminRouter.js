const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET;

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
    res.status(500).json({ msg: "Error", err });
  }
});

module.exports = router;
