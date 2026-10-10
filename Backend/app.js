require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./models/db");
const { notFoundHandler, errorHandler } = require("./middleswares/errorMiddleware");

// app init
const app = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

// cors
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cartify.netlify.app",
  "https://caartify.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

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

// routes
app.use("/api/auth", require("./router/authRouter"));
app.use("/api/admin", require("./router/adminRouter"));
app.use("/api/products", require("./router/productsRouter"));

// ping
app.get("/", (req, res) => {
  res.send("API running...");
});

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// server startup
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
