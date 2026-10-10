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

const askSearch = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const parsedQuery = await parseQuery(query);
  const products = await searchProductsService(parsedQuery);

  res.status(200).json({
    query,
    filters: parsedQuery,
    total: products.length,
    products,
  });
});

const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ApiError(400, "Query is required");
  const products = await searchProducts(q);
  res.status(200).json(products);
});

const category = asyncHandler(async (req, res) => {
  const products = await getProductsByCategory(req.params.category);
  res.status(200).json(products);
});

const product = asyncHandler(async (req, res) => {
  const item = await getProductById(req.params.id);
  if (!item) throw new ApiError(404, "Product not found");
  res.status(200).json(item);
});

const addToCart = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) throw new ApiError(400, "Invalid product ID");
  const user = await upsertCartItem(req.user.email, productId);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json({ msg: "added to cart", cart: user.cart });
});

const deleteFromCart = asyncHandler(async (req, res) => {
  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) throw new ApiError(400, "Invalid product ID");
  const updatedUser = await removeCartItem(req.user.email, productId);
  if (!updatedUser) throw new ApiError(404, "User not found");
  res.status(200).json({ msg: "Removed from cart", cart: updatedUser.cart });
});

const checkout = asyncHandler(async (req, res) => {
  const result = await checkoutCart(req.user.email);
  if (result.status !== 200) throw new ApiError(result.status, result.msg);
  res.status(200).json({ msg: result.msg });
});

const cartAll = asyncHandler(async (req, res) => {
  const cart = await buildCartView(req.user.email);
  if (!cart) throw new ApiError(404, "User not found");
  res.status(200).json(cart);
});

const cartTotal = asyncHandler(async (req, res) => {
  const total = await getCartTotal(req.user.email);
  if (total == null) throw new ApiError(404, "User not found");
  res.status(200).json({ total });
});

const checkoutAll = asyncHandler(async (req, res) => {
  const purchased = await getCheckoutHistory(req.user.email);
  if (purchased == null) throw new ApiError(404, "User not found");
  res.status(200).json(purchased);
});

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
