import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce } from "react-toastify";
import API from "../api"

// search page
const SearchResults = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]); // keep an array to avoid map errors
  const navigate = useNavigate();

  useEffect(() => {
  const searchResults = async () => {
    try {
      const res = await toast.promise(
        API.get(`/products/search?q=${name}`),
        {
          loading: "Loading products...",
          error: "Failed to load products",
          success: "Products loaded successfully",
        }
      );
      console.log(res.data);

      // normalise: backend may respond with {products: []} or []
      const normalised = Array.isArray(res.data)
        ? res.data
        : res.data?.products ?? [];
      setProducts(normalised);

    } catch (error) {
      console.error("No products found...", error);
      setProducts([]); // stay array to keep render safe
    }
  };

  if (name) searchResults();
}, [name]);

  // add cart
  async function addtoCart(id) {

  console.log(id);
  
  if (!id) return;

  try {
    const res = await API.post(
      `/products/cart/${id}`
    );

    console.log(res.data);

    const { msg, item } = res.data;


    toast.success(msg || "Added to cart!", {
      position: "bottom-center",
      autoClose: 5000
    });

  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

  return (
    <div className="w-full min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Search results for</p>
          <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(products) && products.length > 0 ? (
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
                      â­ {product.rating} Â· {product.reviews?.length || 0}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">
                        â‚¹{(product.price * 80).toFixed(0)}
                      </span>
                      <span className="text-sm line-through text-slate-400">
                        â‚¹{(
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
              No products found for "{name}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
