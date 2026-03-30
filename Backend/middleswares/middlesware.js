// middleware/auth.js

const jwt = require("jsonwebtoken");

// auth guard
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "Not logged in" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = data;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}

module.exports = isLoggedIn;
