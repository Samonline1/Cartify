// middleware/auth.js

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// auth guard
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  // console.log("ck token", token);
  

  if (!token) {
    return res.status(401).json({ msg: "Not logged in" });
  }

  try {
    if (!jwtSecret) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }

    const data = jwt.verify(token, jwtSecret);
    req.user = data;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }

  next();
}

function isAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }

  next();
}

module.exports = { isLoggedIn, isAdmin };
