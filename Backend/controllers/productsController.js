// Products controller: catalog, search, cart, checkout
const {
  searchProducts,
  getProductsByCategory,
  getProductById,
} = require("../services/catalogService");
const {
  upsertCartItem,
  removeCartItem,
  buildCartView,
  checkoutCart,
  getCartTotal,
  getCheckoutHistory,
  getCheckoutTotal,
} = require("../services/cartService");

const { parseQuery } = require("../search/queryParser");
const { searchProductsService } = require("../search/productSearchService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const cacheService = require("../services/cacheService");

// TTL configuration
const ASK_SEARCH_TTL = 60 * 60; // 1 hour

// AI search (cached)
const askSearch = asyncHandler(async (req, res) => {
  const query = (req.query.q || "").trim();
  const cacheKey = `catalog:ask:${query.toLowerCase()}`;

  // Cache lookup
  const result = await cacheService.getOrSet(cacheKey, ASK_SEARCH_TTL, async () => {
    const parsedQuery = await parseQuery(query);
    const products = await searchProductsService(parsedQuery);

    return {
      query,
      filters: parsedQuery,
      total: products.length,
      products,
    };
  });

  res.status(200).json(result);
});

// Search query (cached)
const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ApiError(400, "Query is required");
  const products = await searchProducts(q);
  res.status(200).json(products);
});

// Category list (cached)
const category = asyncHandler(async (req, res) => {
  const products = await getProductsByCategory(req.params.category);
  res.status(200).json(products);
});

// Single product (cached)
const product = asyncHandler(async (req, res) => {
  const item = await getProductById(req.params.id);
  if (!item) throw new ApiError(404, "Product not found");
  res.status(200).json(item);
});

// Add to cart
const addToCart = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) throw new ApiError(400, "Invalid product ID");
  const user = await upsertCartItem(req.user.email, productId);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({ msg: "added to cart", cart: user.cart });
});

// Delete from cart
const deleteFromCart = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) throw new ApiError(400, "Invalid product ID");
  const updatedUser = await removeCartItem(req.user.email, productId);
  if (!updatedUser) throw new ApiError(404, "User not found");
  res.status(200).json({ msg: "Removed from cart", cart: updatedUser.cart });
});

// Checkout order
const checkout = asyncHandler(async (req, res) => {
  const result = await checkoutCart(req.user.email);
  if (result.status !== 200) throw new ApiError(result.status, result.msg);
  res.status(200).json({ msg: result.msg });
});

// Full cart view (solves N+1)
const cartAll = asyncHandler(async (req, res) => {
  const cart = await buildCartView(req.user.email);
  if (!cart) throw new ApiError(404, "User not found");
  res.status(200).json(cart);
});

// Cart total
const cartTotal = asyncHandler(async (req, res) => {
  const total = await getCartTotal(req.user.email);
  if (total == null) throw new ApiError(404, "User not found");
  res.status(200).json({ total });
});

// Order history
const checkoutAll = asyncHandler(async (req, res) => {
  const purchased = await getCheckoutHistory(req.user.email);
  if (purchased == null) throw new ApiError(404, "User not found");
  res.status(200).json(purchased);
});

// Order total
const checkoutTotal = asyncHandler(async (req, res) => {
  const total = await getCheckoutTotal(req.user.email);
  if (total == null) throw new ApiError(404, "User not found");
  res.status(200).json({ total });
});

module.exports = {
  search,
  category,
  product,
  addToCart,
  deleteFromCart,
  checkout,
  cartAll,
  cartTotal,
  checkoutAll,
  checkoutTotal,
  askSearch,
};
