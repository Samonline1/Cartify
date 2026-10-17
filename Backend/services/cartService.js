// Cart service: user cart & checkout operations
const userModel = require("../models/user");
const { getProductById } = require("./catalogService");
const cacheService = require("./cacheService");

// TTL settings
const CART_TTL = 10 * 60;        // 10 minutes (active eviction)
const CHECKOUT_TTL = 30 * 60;    // 30 minutes

// User lookup
async function getUserByEmail(email) {
  return userModel.findOne({ email });
}

// Invalidate cart: evicts view and total
async function invalidateCartCache(email) {
  await Promise.all([
    cacheService.del(`cart:view:${email}`),
    cacheService.del(`cart:total:${email}`),
  ]);
}

// Invalidate checkout: evicts cart, history, and dashboard
async function invalidateCheckoutCache(email) {
  await Promise.all([
    invalidateCartCache(email),
    cacheService.del(`checkout:history:${email}`),
    cacheService.del(`checkout:total:${email}`),
    cacheService.del("admin:dashboard:stats"),
  ]);
}

// Add item
async function upsertCartItem(email, productId) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const existingItem = user.cart.find((item) => item.product === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();
  // Evict cache
  await invalidateCartCache(email);
  return user;
}

// Remove item
async function removeCartItem(email, productId) {
  const updatedUser = await userModel.findOneAndUpdate(
    { email },
    { $pull: { cart: { product: productId } } },
    { new: true }
  );

  // Evict cache
  if (updatedUser) {
    await invalidateCartCache(email);
  }

  return updatedUser;
}

// Build cart (solves N+1 via cached products)
async function buildCartView(email) {
  const cacheKey = `cart:view:${email}`;

  return cacheService.getOrSet(cacheKey, CART_TTL, async () => {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const items = await Promise.all(
      (user.cart || []).map(async (item) => {
        try {
          const product = await getProductById(item.product);
          return { ...product, quantity: item.quantity };
        } catch {
          return null;
        }
      })
    );

    return items.filter(Boolean);
  });
}

// Checkout cart
async function checkoutCart(email) {
  const user = await getUserByEmail(email);
  if (!user) return { status: 404, msg: "User not found" };
  if (!user.cart || !user.cart.length) return { status: 400, msg: "Cart is empty" };

  const purchasedItems = (
    await Promise.all(
      user.cart.map(async (item) => {
        try {
          const product = await getProductById(item.product);
          return {
            name: product.title,
            product: item.product,
            quantity: item.quantity,
            price: product.price,
            purchasedAt: new Date(),
          };
        } catch {
          return null;
        }
      })
    )
  ).filter(Boolean);

  user.purchased = user.purchased || [];
  user.purchased.push(...purchasedItems);
  user.cart = [];
  await user.save();

  // Evict cache
  await invalidateCheckoutCache(email);
  return { status: 200, msg: "Checkout successful" };
}

// Cart total
async function getCartTotal(email) {
  const cacheKey = `cart:total:${email}`;

  return cacheService.getOrSet(cacheKey, CART_TTL, async () => {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const items = (user.cart || []).filter((item) => item.product);
    const totals = await Promise.all(
      items.map(async (item) => {
        const product = await getProductById(item.product);
        return Number(product.price || 0) * Number(item.quantity || 0);
      })
    );

    return totals.reduce((sum, value) => sum + value, 0);
  });
}

// Order history
async function getCheckoutHistory(email) {
  const cacheKey = `checkout:history:${email}`;

  return cacheService.getOrSet(cacheKey, CHECKOUT_TTL, async () => {
    const user = await getUserByEmail(email);
    if (!user) return null;
    return user.purchased || [];
  });
}

// Order total
async function getCheckoutTotal(email) {
  const cacheKey = `checkout:total:${email}`;

  return cacheService.getOrSet(cacheKey, CHECKOUT_TTL, async () => {
    const user = await getUserByEmail(email);
    if (!user) return null;
    return (user.purchased || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  });
}

module.exports = {
  upsertCartItem,
  removeCartItem,
  buildCartView,
  checkoutCart,
  getCartTotal,
  getCheckoutHistory,
  getCheckoutTotal,
  invalidateCartCache,
  invalidateCheckoutCache,
};
