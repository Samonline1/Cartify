import React, { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [checkoutData, setCheckoutData] = useState([]);
  const [checkoutTotalValue, setCheckoutTotalValue] = useState(0);
  const [activeTab, setActiveTab] = useState("cart");
  const [showThankYou, setShowThankYou] = useState(false);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/products/cart/all");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchTotal = async () => {
    try {
      const res = await API.get("/products/cart/total");
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching total:", err);
    }
  };

  const checkoutItems = async () => {
    try {
      const res = await API.get("/products/checkout/all");
      const purchases = res.data || [];
      const enriched = await Promise.all(
        purchases.map(async (item) => {
          try {
            const productRes = await API.get(`/products/${item.product}`);
            return {
              ...item,
              title: productRes.data.title,
              thumbnail: productRes.data.thumbnail
            };
          } catch (error) {
            return item;
          }
        })
      );
      setCheckoutData(enriched);
    } catch (err) {
      console.error("Error fetching checkout:", err);
    }
  };

  const checkoutTotal = async () => {
    try {
      const res = await API.get("/products/checkout/total");
      setCheckoutTotalValue(res.data.total);
    } catch (err) {
      console.error("Error fetching checkout total:", err);
    }
  };

  const checkout = async () => {
    try {
      const res = await API.post("/products/checkout");
      await fetchCart();
      await fetchTotal();
      await checkoutItems();
      await checkoutTotal();
      setActiveTab("purchased");
      setShowThankYou(true);
      toast.success(res.data?.msg || "Checkout successful", {
        position: "bottom-center",
        autoClose: 5000
      });
    } catch (error) {
      console.error("Error checkout:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await API.delete(`/products/cart/${id}`);
      toast.success(res.data?.msg || "Product removed!", {
        position: "bottom-center",
        autoClose: 5000
      });
      fetchCart();
      fetchTotal();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchTotal();
    checkoutItems();
    checkoutTotal();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-slate-900 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3 bg-white rounded-full p-2 shadow-md border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("cart")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === "cart"
                ? "bg-slate-900 text-white"
                : "bg-transparent text-slate-700"
            }`}
          >
            Cart
          </button>
          <button
            onClick={() => setActiveTab("purchased")}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              activeTab === "purchased"
                ? "bg-slate-900 text-white"
                : "bg-transparent text-slate-700"
            }`}
          >
            Purchased
          </button>
        </div>

        {activeTab === "cart" ? (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 text-sm font-semibold border-b">
                Your Cart ({cart.length})
              </div>

              <div className="divide-y">
                {cart.length > 0 ? (
                  [...cart].reverse().map((item) => (
                    <div
                      onClick={() => navigate(`/search/${item.title}/${item.id}`)}
                      key={item.id}
                      className="flex items-center justify-between px-6 py-5"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-16 w-16 object-contain"
                        />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <p className="font-semibold">₹{(item.price * item.quantity * 80).toFixed(0)}</p>
                        <p
                          className="text-red-800 font-bold cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                        >
                          X
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-500">
                    Your cart is empty
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{(total * 80).toFixed(0)}</span>
              </div>
            </div>

            <div>
              <button
                onClick={checkout}
                className="bg-yellow-400 rounded-full px-5 py-2 font-semibold"
              >
                Checkout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 text-sm font-semibold border-b">
                Purchased ({checkoutData.length})
              </div>

              <div className="divide-y">
                {checkoutData.length > 0 ? (
                  [...checkoutData].reverse().map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex items-center justify-between px-6 py-5"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.thumbnail}
                          alt={item.title || `Product ${item.product}`}
                          className="h-16 w-16 rounded-xl bg-slate-100 object-contain"
                        />
                        <div>
                          <p className="font-semibold">
                            {item.title || `Product #${item.product}`}
                          </p>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-slate-500">
                            Purchased: {new Date(item.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold">₹{(item.price * item.quantity * 80).toFixed(0)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-500">
                    No purchased items yet
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl">
              <div className="flex justify-between text-lg font-semibold">
                <span>Purchased Total</span>
                <span>₹{(checkoutTotalValue * 80).toFixed(0)}</span>
              </div>
            </div>
          </>
        )}

        {showThankYou && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 px-5 py-4 max-w-xs w-full text-center space-y-3">
              <p className="font-semibold text-slate-900">Thank you for your purchase</p>
              <button
                onClick={() => setShowThankYou(false)}
                className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
