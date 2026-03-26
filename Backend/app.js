const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// app init
const app = express();

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
app.listen(3000, () => {
  console.log("Server running on 3000");
});
