// Database connection: MongoDB Mongoose with Public DNS resolution
const mongoose = require("mongoose");
const dns = require("dns");

// Force Google & Cloudflare public DNS to fix Render querySrv ETIMEOUT
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Cartify",
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4 to avoid IPv6 DNS timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;