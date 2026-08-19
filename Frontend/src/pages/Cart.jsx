import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCartItems, useCartTotal } from "../hooks/queries/useCartData";
import { useCheckoutItems, useCheckoutTotal } from "../hooks/queries/useCheckoutData";
import { useCartCheckout } from "../hooks/mutations/useCartCheckout";
import { useDeleteCartItem } from "../hooks/mutations/useDeleteCartItem";
import { useAuth } from "../AuthContext";


const Cart = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const [showThankYou, setShowThankYou] = useState(false);
  const [checkoutLoad, setCheckOutLoad] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState(0);
  const { refreshAuth } = useAuth();



  const navigate = useNavigate();
  const { data: cart = [], refetch: refetchCart } = useCartItems();
  const { data: total = 0, refetch: refetchTotal } = useCartTotal();
  const { data: checkoutData = [], refetch: refetchCheckoutItems } = useCheckoutItems();
  const { data: checkoutTotalValue = 0, refetch: refetchCheckoutTotal } = useCheckoutTotal();
  const checkoutMutation = useCartCheckout();
  const deleteItemMutation = useDeleteCartItem();

  const checkout = async () => {
    setCheckOutLoad(true);

    checkoutMutation.mutate(undefined, {
      onSuccess: async (data) => {
        setActiveTab("purchased");
        setCheckOutLoad(false);
        setShowThankYou(true);

        toast.success(data?.msg || "Checkout successful", {
          autoClose: 5000,
        });

        // Refresh data after success UI is already shown
        await Promise.all([
          refetchCart(),
          refetchTotal(),
          refetchCheckoutItems(),
          refetchCheckoutTotal(),
          refreshAuth(),
        ]);
      },

      onError: (error) => {
        console.error("Error checkout:", error);
        setCheckOutLoad(false);
        toast.error("Checkout failed");
      },
    });
  };


  const checkoutMessages = [
    {
      title: "Cross-checking your account",
      description: "Verifying your account details...",
    },
    {
      title: "Confirming your address",
      description: "Checking your delivery information...",
    },
    {
      title: "Securing your order",
      description: "Finalizing your purchase...",
    },
  ];

  useEffect(() => {
    if (!checkoutLoad) {
      setCheckoutMessage(0);
      return;
    }

    const interval = setInterval(() => {
      setCheckoutMessage((prev) =>
        prev === checkoutMessages.length - 1 ? 0 : prev + 1
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [checkoutLoad]);

  const deleteItem = async (id) => {
    deleteItemMutation.mutate(id, {
      onSuccess: async (data) => {
        toast.success(data?.msg || "Product removed!", {
          autoClose: 5000,
        });

        await refetchCart();
        await refetchTotal();
      },
      onError: (err) => {
        console.error("Error removing item:", err);
        toast.error("Could not remove product");
      },
    });
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );


  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-7 text-slate-900 sm:px-6 lg:px-10 lg:py-10">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-500">
              Cartify
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              {activeTab === "cart"
                ? "Your shopping cart"
                : "Your purchases"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {activeTab === "cart"
                ? "Review your items before checking out."
                : "Everything you've purchased from Cartify."}
            </p>
          </div>


          {/* Tabs */}

          <div className="flex w-fit items-center rounded-2xl border border-blue-100 bg-white p-1.5 shadow-sm">

            <button
              onClick={() => setActiveTab("cart")}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${activeTab === "cart"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-500"
                }`}
            >
              Cart
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeTab === "cart"
                  ? "bg-white/20 text-white"
                  : "bg-blue-50 text-blue-500"
                  }`}
              >
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("purchased")}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${activeTab === "purchased"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-500"
                }`}
            >
              Purchased
            </button>

          </div>
        </div>


        {/* CART */}

        {activeTab === "cart" && (
          <>
            {cart.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

                {/* Products */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">

                    <div>
                      <h2 className="font-black text-slate-900">
                        Shopping bag
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        {cartCount}{" "}
                        {cartCount === 1 ? "item" : "items"} in your cart
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                      🛒
                    </div>

                  </div>


                  <div className="divide-y divide-slate-100">

                    {[...cart].reverse().map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          navigate(`/search/${item.title}/${item.id}`)
                        }
                        className="group cursor-pointer px-5 py-5 transition hover:bg-blue-50/40 sm:px-7"
                      >

                        <div className="flex gap-4">

                          {/* Image */}

                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-3 sm:h-28 sm:w-28">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>


                          {/* Details */}

                          <div className="flex min-w-0 flex-1 flex-col justify-between">

                            <div className="flex justify-between gap-3">

                              <div className="min-w-0">
                                <h3 className="line-clamp-2 font-bold leading-5 text-slate-800 group-hover:text-blue-500">
                                  {item.title}
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                  Quantity:{" "}
                                  <span className="font-semibold text-slate-600">
                                    {item.quantity}
                                  </span>
                                </p>
                              </div>

                              {/* Remove */}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteItem(item.id);
                                }}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                                aria-label="Remove product"
                              >
                                ×
                              </button>

                            </div>


                            <div className="mt-4 flex items-end justify-between gap-3">

                              <p className="text-xs font-medium text-slate-400">
                                ₹{(item.price * 80).toFixed(0)} each
                              </p>

                              <p className="font-black text-slate-900">
                                ₹
                                {(
                                  item.price *
                                  item.quantity *
                                  80
                                ).toFixed(0)}
                              </p>

                            </div>

                          </div>

                        </div>
                      </div>
                    ))}

                  </div>
                </section>


                {/* ORDER SUMMARY */}

                <aside className="h-fit lg:sticky lg:top-6">

                  <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                    {/* Yellow top */}

                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-7 text-white">

                      <div className="absolute -right-10 -top-16 h-36 w-36 rounded-full border-[25px] border-white/10" />

                      <div className="relative">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-100">
                          Order summary
                        </p>

                        <h2 className="mt-2 text-2xl font-black">
                          Almost yours!
                        </h2>
                      </div>

                    </div>


                    <div className="p-6">

                      <div className="space-y-4">

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">
                            Items
                          </span>

                          <span className="font-semibold text-slate-800">
                            {cartCount}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">
                            Subtotal
                          </span>

                          <span className="font-semibold text-slate-800">
                            ₹{(total * 80).toFixed(0)}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">
                            Delivery
                          </span>

                          <span className="font-bold text-green-500">
                            FREE
                          </span>
                        </div>

                      </div>


                      <div className="my-5 border-t border-dashed border-slate-200" />


                      <div className="flex items-end justify-between">

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Total
                          </p>

                          <p className="mt-1 text-3xl font-black text-slate-900">
                            ₹{(total * 80).toFixed(0)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-yellow-100 px-3 py-2 text-xs font-bold text-yellow-700">
                          Best price
                        </div>

                      </div>


                      <button
                        onClick={checkout}
                        className="mt-6 w-full rounded-xl bg-yellow-400 px-5 py-4 text-sm font-black text-blue-900 shadow-[0_4px_0px_#ca8a04] transition hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_6px_0px_#ca8a04] active:translate-y-0 active:shadow-[0_2px_0px_#ca8a04]"
                      >
                        Proceed to Checkout →
                      </button>


                      <button
                        onClick={() => navigate("/")}
                        className="mt-3 w-full rounded-xl py-3 text-sm font-bold text-blue-500 transition hover:bg-blue-50"
                      >
                        Continue shopping
                      </button>

                    </div>
                  </div>


                  {/* Trust */}

                  <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                        🔒
                      </div>

                      <div>
                        <p className="text-xs font-bold text-blue-800">
                          Safe & simple checkout
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-600/70">
                          Your shopping experience stays simple with Cartify.
                        </p>
                      </div>

                    </div>

                  </div>

                </aside>

              </div>
            ) : (

              //  EMPTY CART

              <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                <div className="relative flex min-h-[430px] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">

                  <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-blue-50" />

                  <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-yellow-50" />

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
                    🛒
                  </div>

                  <h2 className="relative mt-7 text-2xl font-black text-slate-900">
                    Your cart is waiting
                  </h2>

                  <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Looks like you haven't added anything yet.
                    Find something you love and bring it here.
                  </p>

                  <button
                    onClick={() => navigate("/")}
                    className="relative mt-7 rounded-xl bg-blue-500 px-7 py-3.5 font-bold text-white shadow-[0_4px_0px_#2563eb] transition hover:-translate-y-0.5 hover:bg-blue-600 active:translate-y-0"
                  >
                    Start Shopping →
                  </button>

                </div>

              </div>
            )}
          </>
        )}

        {checkoutLoad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white text-center shadow-2xl">

              {/* Top */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 px-6 py-8">

                <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-white/10" />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-300 shadow-lg">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                </div>

                <h2 className="relative mt-5 text-2xl font-black text-white">
                  Almost there...
                </h2>

                <p className="relative mt-1 text-sm text-blue-50">
                  We're getting your order ready.
                </p>

              </div>


              {/* Live status */}
              <div className="px-6 py-7">

                <div
                  key={checkoutMessage}
                  className="flex items-center gap-4 rounded-2xl bg-blue-50 px-4 py-4 text-left"
                >

                  {/* Spinner */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                  </div>

                  {/* Changing text */}
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800">
                      {checkoutMessages[checkoutMessage].title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {checkoutMessages[checkoutMessage].description}
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-xs text-slate-400">
                  Please don't close this window.
                </p>

              </div>

            </div>
          </div>
        )}
        {/* PURCHASED */}

        {activeTab === "purchased" && (
          <>

            {checkoutData.length > 0 ? (

              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

                {/* Purchased list */}

                <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">

                    <div>
                      <h2 className="font-black text-slate-900">
                        Purchase history
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        {checkoutData.length}{" "}
                        {checkoutData.length === 1
                          ? "purchase"
                          : "purchases"}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-lg">
                      ✓
                    </div>

                  </div>


                  <div className="divide-y divide-slate-100">

                    {[...checkoutData].reverse().map((item, index) => (

                      <div
                        key={`${item.product}-${index}`}
                        className="px-5 py-5 sm:px-7"
                      >

                        <div className="flex gap-4">

                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-50 p-3">
                            <img
                              src={item.thumbnail}
                              alt={item.title || `Product ${item.product}`}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </div>


                          <div className="flex min-w-0 flex-1 flex-col justify-between">

                            <div className="flex justify-between gap-3">

                              <div className="min-w-0">

                                <h3 className="line-clamp-2 font-bold text-slate-800">
                                  {item.name ||
                                    `Product #${item.product}`}
                                </h3>

                                <div className="mt-2 flex flex-wrap items-center gap-2">

                                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-500">
                                    Qty: {item.quantity}
                                  </span>

                                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                                    Purchased
                                  </span>

                                </div>

                              </div>

                            </div>


                            <div className="mt-4 flex items-end justify-between gap-3">

                              <p className="text-xs text-slate-400">
                                {new Date(
                                  item.purchasedAt
                                ).toLocaleDateString()}
                              </p>

                              <p className="font-black text-slate-900">
                                ₹
                                {(
                                  item.price *
                                  item.quantity *
                                  80
                                ).toFixed(0)}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>
                </section>


                {/* Purchased summary */}

                <aside className="h-fit lg:sticky lg:top-6">

                  <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-7 text-white">

                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-100">
                        Shopping history
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        You've got great taste.
                      </h2>

                    </div>

                    <div className="p-6">

                      <p className="text-sm text-slate-500">
                        Total spent
                      </p>

                      <p className="mt-1 text-3xl font-black text-slate-900">
                        ₹{(checkoutTotalValue * 80).toFixed(0)}
                      </p>

                      <div className="my-5 border-t border-dashed border-slate-200" />

                      <div className="flex items-center gap-3 rounded-xl bg-yellow-50 p-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-200">
                          🛍️
                        </div>

                        <p className="text-xs font-semibold leading-5 text-yellow-800">
                          Keep discovering products you'll love.
                        </p>

                      </div>

                      <button
                        onClick={() => navigate("/")}
                        className="mt-4 w-full rounded-xl bg-blue-500 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600"
                      >
                        Continue Shopping →
                      </button>

                    </div>

                  </div>

                </aside>

              </div>

            ) : (

              //  NO PURCHASES

              <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

                <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-16 text-center">

                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-50 text-4xl">
                    🛍️
                  </div>

                  <h2 className="mt-7 text-2xl font-black text-slate-900">
                    No purchases yet
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Your purchased products will appear here after
                    you complete a checkout.
                  </p>

                  <button
                    onClick={() => navigate("/")}
                    className="mt-7 rounded-xl bg-blue-500 px-7 py-3.5 font-bold text-white shadow-[0_4px_0px_#2563eb] transition hover:-translate-y-0.5 hover:bg-blue-600"
                  >
                    Explore Products →
                  </button>

                </div>

              </div>

            )}

          </>
        )}

      </div>


      {/* THANK YOU MODAL */}

      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 px-4 backdrop-blur-sm">

          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white text-center shadow-2xl">

            {/* Top */}

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 px-6 py-8">

              <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-300 text-2xl shadow-lg">
                ✓
              </div>

              <h2 className="relative mt-4 text-2xl font-black text-white">
                Order complete!
              </h2>

              <p className="relative mt-1 text-sm text-blue-50">
                Thanks for shopping with Cartify.
              </p>

            </div>


            <div className="p-6">

              <p className="text-sm leading-6 text-slate-500">
                Your purchase has been added to your order history.
              </p>

              <button
                onClick={() => setShowThankYou(false)}
                className="mt-5 w-full rounded-xl bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600"
              >
                View Purchases
              </button>

            </div>

          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
