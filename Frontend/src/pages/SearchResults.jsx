import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";
import ProductQuickView from "../components/ProductQuickView"
import { Eye } from "lucide-react";
import { useProductSearch } from "../hooks/queries/useProductSearch";
import { useAuth } from "../AuthContext";


// search page
const SearchResults = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [open, setOpen] = useState(false);
  const { data: products = [], isLoading } = useProductSearch(name);

  // pagination calc

  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(0);


  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;


const matching = useMemo(() => {
    if (!Array.isArray(products) || !name?.trim()) {
        return [];
    }

    const search = name.trim().toLowerCase();

    return products.filter((p) => {
        const title = p?.title;

        if (typeof title !== "string") {
            return false;
        }

        return title
            .toLowerCase()
            .split(/\s+/)
            .some((word) => word.startsWith(search));
    });
}, [name, products]);

  const pages = Math.ceil(matching.length / pageSize);


  const paginatedProducts = matching?.slice(startIndex, endIndex);

  // add cart
  async function addtoCart(id) {

    if (!id) return;

    try {
      const res = await API.post(
        `/products/cart/${id}`);

      const { msg } = res.data;

      toast.success(msg || "Added to cart!", {
        autoClose: 5000
      });

      await refreshAuth();

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
          <p className="text-sm text-slate-500">Search results for  <span className=" font-bold text-slate-900">"{name}"</span></p>

          {/* Pagination */}
          <div className="flex">
            <Pagination
              currentPage={currentPage}
              pages={pages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>


        <ProductQuickView
          open={open}
          productId={selectedProduct}
          onClose={() => setOpen(false)}
        />


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
          ) : Array.isArray(paginatedProducts) && paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (

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
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-2 flex-1 text-base font-semibold text-slate-900">
                        {product?.title}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setOpen(true);
                        }}
                        className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
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
