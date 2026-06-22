require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
