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

const { parseQuery } = require("../search/queryParser")
const { searchProductsService } = require("../search/productSearchService")



async function askSearch(req, res) {
  try {
    const query = req.query.q || "";

    const parsedQuery = await parseQuery(query);

    const products = await searchProductsService(parsedQuery);


    // console.log("filter", filters)
        // console.log("products", products)

    res.json({
      query,
      filters: parsedQuery,
      total: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error searching", error: err.message });
  }
}

async function search(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ msg: "Query is required" });
    const products = await searchProducts(q);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error searching products", error: err.message });
  }
}

async function category(req, res) {
  try {
    const products = await getProductsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching category products", error: err.message });
  }
}

async function product(req, res) {
  try {
    const product = await getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Product not found", error: err.message });
  }
}

async function addToCart(req, res) {
  try {
    const productId = Number(req.params.id);
    const user = await upsertCartItem(req.user.email, productId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "added to cart", cart: user.cart });
  } catch {
    res.status(500).json({ msg: "Error updating cart" });
  }
}

async function deleteFromCart(req, res) {
  try {
    const updatedUser = await removeCartItem(req.user.email, Number(req.params.id));
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "Removed from cart", cart: updatedUser.cart });
  } catch {
    res.status(500).json({ msg: "Error removing item" });
  }
}

async function checkout(req, res) {
  try {
    const result = await checkoutCart(req.user.email);
    if (result.status !== 200) return res.status(result.status).json({ msg: result.msg });
    res.status(200).json({ msg: result.msg });
  } catch {
    res.status(500).json({ msg: "Error checkout!" });
  }
}

async function cartAll(req, res) {
  try {
    const cart = await buildCartView(req.user.email);
    if (!cart) return res.status(404).json({ msg: "User not found" });
    res.json(cart);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
}

async function cartTotal(req, res) {
  try {
    const total = await getCartTotal(req.user.email);
    if (total == null) return res.status(404).json({ msg: "User not found" });
    res.json({ total });
  } catch (error) {
    res.status(500).json({ msg: "err calculating total!", error });
  }
}

async function checkoutAll(req, res) {
  try {
    const purchased = await getCheckoutHistory(req.user.email);
    if (purchased == null) return res.status(404).json({ msg: "User not found" });
    res.json(purchased);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
}

async function checkoutTotal(req, res) {
  try {
    const total = await getCheckoutTotal(req.user.email);
    if (total == null) return res.status(404).json({ msg: "User not found" });
    res.json({ total });
  } catch (error) {
    res.status(500).json({ msg: "err calculating purchased!", error });
  }
}

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
  askSearch
};
