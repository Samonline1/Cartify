// Server entry point
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./models/db");
const { connectRedis } = require("./config/redis");
const { notFoundHandler, errorHandler } = require("./middleswares/errorMiddleware");

// Express init
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Trust proxy
app.set("trust proxy", 1);

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cartify.netlify.app",
  "https://caartify.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Auth routes
app.use("/api/auth", require("./router/authRouter"));

// Admin routes
app.use("/api/admin", require("./router/adminRouter"));

// Product routes
app.use("/api/products", require("./router/productsRouter"));

// Health ping
app.get("/", (req, res) => {
  res.send("API running...");
});

// 404 handler
app.use(notFoundHandler);

// Centralized errors
app.use(errorHandler);

// Port config
const port = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    // Connect MongoDB
    await connectDB();
    // Connect Redis (fail-open)
    await connectRedis();

    // Single listener
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

// Boot server
startServer();

module.exports = app;
