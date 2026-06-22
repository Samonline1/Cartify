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
app.set("trust proxy", 1);

// cors

const allowedOrigins = [
  "http://localhost:5173",    
  "http://localhost:3000",          
  "https://cartify.netlify.app",
  "https://caartify.netlify.app",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// routes
app.use("/api/auth", require("./router/authRouter"));
app.use("/api/admin", require("./router/adminRouter"));
app.use("/api/products", require("./router/productsRouter"));


// ping
app.get("/", (req, res) => {
  res.send("API running...");
});

// listen
const port = process.env.PORT;

if (!port) {
  throw new Error("PORT is not configured");
}

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
