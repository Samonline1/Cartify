// routes/authRouter.js

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const isProduction = process.env.NODE_ENV === "production";


// signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign({ email: user.email }, "process.env.JWT_SECRET");

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,          // HTTPS only in production
      sameSite: isProduction ? "none" : "lax"
    });

    res.json({ msg: "Signup success", user });

  } catch (err) {
    res.status(500).json({ msg: "Error", err });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ email: user.email }, "process.env.JWT_SECRET");

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,          // HTTPS only in production
      sameSite: isProduction ? "none" : "lax"
    });

    res.json({ msg: "Login success", user });
    console.log(user.content);


  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
});

// logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out" });

});

module.exports = router;
