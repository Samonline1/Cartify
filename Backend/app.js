require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./models/db")

// app init
const app = express();

connectDB();

// parsers
app.use(express.json());
app.use(cookieParser());

// cors
app.use(cors({
  origin: true,
  credentials: true
}));

// routes
app.use("/api/auth", require("./router/authRouter"));
app.use("/api/products", require("./router/productsRouter"));


// ping
app.get("/", (req, res) => {
  res.send("API running...");
});

// listen
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
