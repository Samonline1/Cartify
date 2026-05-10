import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import API from "../api"


const swatchColors = ["#f1239e", "#2663ff", "#f97316", "#0ea5e9"];
const sizes = ["S", "M", "L"];

// product view
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWakeNotice, setShowWakeNotice] = useState(() => {
    return sessionStorage.getItem("server-warmed-up") !== "true";
  });
  const [activeImage, setActiveImage] = useState("");
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState(swatchColors[0]);


  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        const data = await res.data;        
        setProduct(data);
        setActiveImage(data.images?.[0] || data.thumbnail);
        sessionStorage.setItem("server-warmed-up", "true");
        setShowWakeNotice(false);
      } catch (e) {
        console.error("No products found...", e);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  async function addtoCart(id) {

  // console.log(id);
  
  if (!id) return;

  try {
    const res = await API.post(
      `/products/cart/${id}`
    );

    // console.log(res.data);

    const { msg, item } = res.data;

    toast.success(msg || "Added to cart!", {
      position: "bottom-center",
      autoClose: 5000
    });

  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white text-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          {showWakeNotice && (
            <p className="mb-4 text-sm text-amber-600">
              Waking up server, first load may take a few seconds.
            </p>
          )}
          <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-full bg-slate-200 rounded-3xl aspect-[4/5]" />
            <div className="flex gap-3 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 w-16 rounded-2xl bg-slate-200 shrink-0"
                />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="h-8 w-32 bg-slate-200 rounded-full" />
            <div className="h-4 w-40 bg-slate-200 rounded-full" />
            <div className="h-10 w-5/6 bg-slate-200 rounded-2xl" />
            <div className="h-4 w-48 bg-slate-200 rounded-full" />

            <div className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 rounded-full" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-8 rounded-full bg-slate-200"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-12 bg-slate-200 rounded-full" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 rounded-md bg-slate-200"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-24 bg-slate-200 rounded-full" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>

            <div className="mt-2 h-12 w-full sm:w-40 bg-slate-200 rounded-full" />
          </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        Product not found.
      </div>
    );
  }

  const discounted =
    (product.price / 100) * product.discountPercentage + product.price;

  return (
    <div className="w-full min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col lg:flex-row gap-10">
        {/* Gallery */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative w-full bg-slate-50 rounded-3xl shadow overflow-hidden flex items-center justify-center aspect-[4/5]">
            <img
              src={activeImage}
              alt={product.title}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`h-16 w-16 rounded-2xl border ${
                  activeImage === img ? "border-slate-900" : "border-slate-200"
                } overflow-hidden flex items-center justify-center bg-white`}
              >
                <img
                  src={img}
                  alt={product.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-3xl font-black">₹{(product.price * 80).toFixed(0)}</p>
          <p className="text-sm text-slate-500">Free shipping over ₹50</p>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            {product.title || "Handcrafted ceramic vase."}
          </h1>
          <p className="text-sm text-slate-600">
            Minimal form · Timeless elegance
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Color</p>
            <div className="flex gap-2">
              {swatchColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveColor(c)}
                  className={`h-8 w-8 rounded-full border ${
                    activeColor === c ? "border-slate-900 scale-110" : "border-slate-200"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Size</p>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSize(s)}
                  className={`h-10 w-10 rounded-md border text-sm font-semibold ${
                    activeSize === s
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-900 border-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 line-through">
              ₹{(discounted * 80).toFixed(0)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
              {product.discountPercentage}% off
            </span>
          </div>

          <button
            onClick={() => addtoCart(product.id)}
            className="mt-2 w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
