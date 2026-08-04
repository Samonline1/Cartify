const userModel = require("../models/user");
const { getProductById } = require("./catalogService");

async function getUserByEmail(email) {
  return userModel.findOne({ email });
}

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
  return user;
}

async function removeCartItem(email, productId) {
  return userModel.findOneAndUpdate(
    { email },
    { $pull: { cart: { product: productId } } },
    { new: true }
  );
}

async function buildCartView(email) {
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
}

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

  return { status: 200, msg: "Checkout successful" };
}

async function getCartTotal(email) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const items = (user.cart || []).filter((item) => item.product);
  const totals = await Promise.all(items.map(async (item) => {
    const product = await getProductById(item.product);
    return Number(product.price || 0) * Number(item.quantity || 0);
  }));

  return totals.reduce((sum, value) => sum + value, 0);
}

async function getCheckoutHistory(email) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  return user.purchased || [];
}

async function getCheckoutTotal(email) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  return (user.purchased || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

module.exports = {
  upsertCartItem,
  removeCartItem,
  buildCartView,
  checkoutCart,
  getCartTotal,
  getCheckoutHistory,
  getCheckoutTotal,
};
