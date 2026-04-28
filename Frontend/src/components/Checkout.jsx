import React, { useEffect, useState } from "react";
import API from "../api";

const Checkout = () => {
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        const res = await API.get("/products/checkout/all");
        setCheckoutItems(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error loading checkout items:", error);
        setCheckoutItems([]);
      }
    };

    loadCheckout();
  }, []);

  const safeCheckoutItems = Array.isArray(checkoutItems) ? checkoutItems : [];
  const itemsTotal = safeCheckoutItems.reduce((acc, item) => acc + (item.price || 0) * 80, 0);
  const shipping = safeCheckoutItems.length ? 0 : 0;
  const vat = itemsTotal * 0.0535;
  const orderTotal = itemsTotal + vat + shipping;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 text-slate-900 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white rounded-3xl border border-slate-200 shadow-lg px-6 py-5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Checkout ({safeCheckoutItems.length} item{safeCheckoutItems.length !== 1 ? "s" : ""})
          </h1>
          <p className="text-sm text-slate-500">Secure • Encrypted • Fast</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 items-start">
          <div className="space-y-4">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Review items</h2>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  In stock
                </span>
              </div>

              <div className="space-y-4">
                {safeCheckoutItems.map((item) => (
                  <div
                    key={item.product || item.id}
                    className="flex gap-4 items-start p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition"
                  >
                    <div className="h-24 w-24 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.thumbnail || item.img}
                        alt={item.title || `Product ${item.product}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-semibold text-sm sm:text-base line-clamp-2">
                        {item.title || `Product #${item.product}`}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-900">₹{((item.price || 0) * 80).toFixed(0)}</span>
                      </div>
                      <p className="text-xs text-slate-500">Purchased item</p>
                    </div>
                    <div className="text-sm text-slate-600">Qty: {item.quantity || 1}</div>
                  </div>
                ))}

                {!safeCheckoutItems.length && (
                  <p className="text-slate-500 text-sm">No items to checkout. Add products to your cart first.</p>
                )}
              </div>
            </section>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 p-6 space-y-5 sticky top-10">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{itemsTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(0)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>V.A.T (5.35%)</span>
                <span>₹{vat.toFixed(0)}</span>
              </div>
              <div className="border-t border-white/15 pt-3 flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹{orderTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
