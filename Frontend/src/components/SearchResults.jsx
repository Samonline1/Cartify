import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api"
import NoProducts from "./NoProducts";

// search page
const SearchResults = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]); // keep an array to avoid map errors
  const [isLoading, setIsLoading] = useState(false);
  const [showWakeNotice, setShowWakeNotice] = useState(() => {
    return sessionStorage.getItem("server-warmed-up") !== "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const searchResults = async () => {
      setIsLoading(true);
      try {
        toast.loading("Loading products...", { id: "search" });

        const res = await API.get(`/products/search?q=${name}`);

        const products = Array.isArray(res.data)
          ? res.data
          : res.data?.products ?? [];

        if (products.length === 0) {
          toast.error("No products found", { id: "search" });
        } else {
          toast.success(`${products.length} products found`, { id: "search" });
        }

        // normalise: backend may respond with {products: []} or []
        const normalised = Array.isArray(res.data)
          ? res.data
          : res.data?.products ?? [];
        setProducts(normalised);
        sessionStorage.setItem("server-warmed-up", "true");
        setShowWakeNotice(false);

      } catch (error) {
        toast.error("No products found...", error);
        setProducts([]); // stay array to keep render safe
      } finally {
        setIsLoading(false);
      }
    };

    if (name) searchResults();
  }, [name]);

  // add cart
  async function addtoCart(id) {

    if (!id) return;

    try {
      const res = await API.post(
        `/products/cart/${id}`);

      const { msg, cart } = res.data;

      toast.success(msg || "Added to cart!", {
        autoClose: 5000
      });

    } catch (error) {

      if (error.response?.status === 401) {
        toast.error(error.response.data.msg, {
          autoClose: 5000
        });

        navigate("/login");
        return;
      }

      toast.error("Something went wrong", {
        autoClose: 5000
      });;
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Search results for</p>
          <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
          {isLoading && showWakeNotice && (
            <p className="mt-2 text-sm text-amber-600">
              Waking up server, first load may take a few seconds.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="flex gap-3 p-4">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 bg-slate-200 rounded-xl" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                    <div className="h-3 w-full bg-slate-200 rounded-full" />
                    <div className="h-3 w-5/6 bg-slate-200 rounded-full" />
                    <div className="h-3 w-1/3 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-20 bg-slate-200 rounded-full" />
                      <div className="h-4 w-16 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-3 w-1/2 bg-slate-200 rounded-full" />
                    <div className="mt-1 h-10 w-full bg-slate-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition flex flex-col sm:flex-col"
              >
                <div className="flex gap-3 p-4">
                  <div
                    className="h-24 w-24 sm:h-28 sm:w-28 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() => navigate(`/search/${name}/${product.id}`)}
                  >
                    <img
                      src={product?.images?.[0]}
                      alt={product.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                      ⭐ {product.rating} · {product.reviews?.length || 0}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">
                        ₹{(product.price * 80).toFixed(0)}
                      </span>
                      <span className="text-sm line-through text-slate-400">
                        ₹{(
                          (product.price / 100) * 80 * product.discountPercentage +
                          product.price * 80
                        ).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ships: {product.shippingInformation || "See details"}
                    </p>
                    <button
                      onClick={() => addtoCart(product.id)}
                      className="mt-1 w-full rounded-full bg-slate-900 text-white font-semibold py-2 hover:bg-slate-800 transition"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-700">

              <NoProducts
                title={`No products found for "${name}"`}
                description="Try exploring another category or search for something else."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
