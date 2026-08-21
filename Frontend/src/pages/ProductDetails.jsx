import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { Share2 } from "lucide-react";
import { useAuth } from "../AuthContext";

const swatchColors = ["#f1239e", "#2663ff", "#f97316", "#0ea5e9"];
const sizes = ["S", "M", "L"];

// product view
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState(swatchColors[0]);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        const data = await res.data;
        setProduct(data);
        setActiveImage(data.images?.[0] || data.thumbnail);
      } catch (e) {
        console.error("No products found...", e);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this product",
          text: "I found this product on Cartify",
          url,
        });
      } catch (error) {
        // User cancelled the share dialog
        toast.error("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  async function addtoCart(id) {
    if (!id) return;

    try {
      const res = await API.post(`/products/cart/${id}`);

      const { msg, cart } = res.data;

      toast.success(msg || "Added to cart!", {
        autoClose: 5000,
      });

      await refreshAuth();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data.msg, {
          autoClose: 5000,
        });

        navigate("/login");
        return;
      }

      toast.error("Something went wrong", {
        autoClose: 5000,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white text-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
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
            <div className="relative h-full w-full">
              {/* Share button */}
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <img
                src={activeImage}
                alt={product.title}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`h-16 w-16 rounded-2xl border ${activeImage === img ? "border-slate-900" : "border-slate-200"
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
          <p className="text-3xl font-black">
            ₹{(product.price * 80).toFixed(0)}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            {product.title || "Handcrafted ceramic vase."}
          </h1>
          <p className="text-sm text-slate-600">
            Minimal form · Timeless elegance
          </p>

          <p className="text-sm text-slate-500">Free shipping over ₹50</p>
          <p className="text-sm text-slate-500">
            {product.shippingInformation}
          </p>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Color</p>
            <div className="flex gap-2">
              {swatchColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveColor(c)}
                  className={`h-8 w-8 rounded-full border ${activeColor === c
                    ? "border-slate-900 scale-110"
                    : "border-slate-200"
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
                  className={`h-10 w-10 rounded-md border text-sm font-semibold ${activeSize === s
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
            className="shine mt-2 w-full sm:w-auto px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">

        <div className="border-t border-slate-100 pt-10">

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                Customer feedback
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Reviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                What customers are saying about this product
              </p>
            </div>

            {/* Rating summary */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">

              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">
                  {product.rating?.toFixed(1)}
                </p>

                <div className="flex text-sm text-yellow-500">
                  {"★★★★★"}
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <p className="text-xs font-semibold text-slate-500">
                {product.reviews?.length || 0} reviews
              </p>

            </div>

          </div>


          {/* Reviews list */}
          {product.reviews?.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">

              {product.reviews.map((review, index) => (
                <div
                  key={`${review.reviewerEmail}-${index}`}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >

                  {/* User */}
                  <div className="flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-600">
                        {review.reviewerName?.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {review.reviewerName}
                        </p>

                        <p className="truncate text-[11px] text-slate-400">
                          {review.reviewerEmail
                            ? `${review.reviewerEmail.split("@")[0]}@cartify.com`
                            : "customer@cartify.com"}
                        </p>
                      </div>

                    </div>

                    {/* Rating */}
                    <div className="flex shrink-0 items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1">
                      <span className="text-xs text-yellow-500">★</span>

                      <span className="text-xs font-black text-slate-700">
                        {review.rating}
                      </span>
                    </div>

                  </div>


                  {/* Comment */}
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>


                  {/* Date */}
                  <p className="mt-4 text-[11px] font-medium text-slate-400">
                    {new Date(review.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                </div>
              ))}

            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-slate-50 px-6 py-10 text-center">
              <p className="font-bold text-slate-700">
                No reviews yet
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Be the first to review this product.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
