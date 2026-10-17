const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const ApiError = require("../utils/ApiError");
const { getAllProducts, searchProducts } = require("./catalogService");

async function loginAdmin({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await userModel.findOne({ email });
  if (!user || user.role !== "admin") {
    throw new ApiError(400, "Admin not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(400, "Wrong password");
  }

  return user;
}

async function getAdminProfile(email) {
  const user = await userModel.findOne({ email }).select("-password");
  if (!user) {
    throw new ApiError(404, "Admin not found");
  }
  return user;
}

async function getDashboardStats() {
  const [users, admins, products] = await Promise.all([
    userModel.find({}).select("-password"),
    userModel.countDocuments({ role: "admin" }),
    getAllProducts(0),
  ]);

  const customers = users.filter((user) => user.role !== "admin");
  const totalCartItems = users.reduce((sum, user) => {
    return sum + (user.cart || []).reduce((cartSum, item) => cartSum + (item.quantity || 0), 0);
  }, 0);

  const purchasedItems = users.flatMap((user) => user.purchased || []);
  const totalOrders = purchasedItems.length;
  const totalRevenue = purchasedItems.reduce(
    (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)),
    0
  );

  const categories = [...new Set(products.map((product) => product.category))].length;

  return {
    totalUsers: customers.length,
    totalAdmins: admins,
    totalProducts: products.length,
    totalCategories: categories,
    totalCartItems,
    totalOrders,
    totalRevenue,
  };
}

async function getUsersList(query = "") {
  const q = (query || "").trim().toLowerCase();
  const users = await userModel.find({}).select("-password");

  const filtered = q
    ? users.filter((user) => {
        const haystack = `${user.name || ""} ${user.email || ""}`.toLowerCase();
        return haystack.includes(q);
      })
    : users;

  return filtered.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    cartCount: (user.cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
    purchasedCount: (user.purchased || []).reduce((sum) => sum + 1, 0),
  }));
}

async function getUserDetails(id) {
  const user = await userModel.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
}

async function deleteUser(id) {
  const user = await userModel.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Admin users cannot be deleted");
  }

  await userModel.findByIdAndDelete(id);
}

async function getAdminProducts({ q = "", category = "", sort = "title" }) {
  let products = q ? await searchProducts(q) : await getAllProducts(0);

  if (category) {
    products = products.filter((product) => product.category === category);
  }

  const sorters = {
    title: (a, b) => a.title.localeCompare(b.title),
    price: (a, b) => a.price - b.price,
    rating: (a, b) => b.rating - a.rating,
    stock: (a, b) => b.stock - a.stock,
  };

  products = products.sort(sorters[sort] || sorters.title);

  return products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    rating: product.rating,
    stock: product.stock,
    category: product.category,
    thumbnail: product.thumbnail,
  }));
}

module.exports = {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getUsersList,
  getUserDetails,
  deleteUser,
  getAdminProducts,
};
