import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsSearch } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { CgProfile } from "react-icons/cg";
import { useProductByName } from "../hooks/queries/useProductName";

// navbar
const Navbar = () => {
  // search text
  const [input, setInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const { data: product, isLoading, error } = useProductByName(debouncedSearch);

  const filter = product?.filter((p) =>
    p.title
      .toLowerCase()
      .split(" ")
      .some((word) => word.startsWith(debouncedSearch.toLowerCase())),
  );


  // debounce trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  // category list
  const categories = [
    "smartphones",
    "laptops",
    "fragrances",
    "skin-care",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting",
  ];

  // trigger search
  const searchProducts = (search) => {
    if (!search.trim()) {
      toast.error("Type something to search");
      return;
    }
    navigate(`/search/${search.trim()}`);
    setInput("");
  };

  // product  details
  const openProductInfo = (id) => {
    const name = input;
    if (!id) {
      toast.error("Type something to search");
      return;
    }
    navigate(`/search/${name}/${id}`);

    setInput("");
    setDebouncedSearch("");
  };

  // render nav
  return (
    <nav className="sticky top-0 z-30 bg-gradient-to-b from-blue-500 to-blue-400 shadow-md">
      <div className="mx-auto w-full px-3 py-3 sm:px-5 lg:px-8">
        {/* MAIN NAV */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            className="shrink-0 rounded-xl px-1 text-white transition hover:scale-[1.02]"
            style={{
              fontFamily: "'Brush Script MT', cursive",
              fontSize: "1.9rem",
              fontWeight: 700,
            }}
          >
            Cartify
          </button>

          {/* Search */}

          <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-2xl border border-white/20 bg-white px-2 shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-yellow-300 sm:h-12">
            <BsSearch className="ml-3 shrink-0 text-slate-400" />

            <input
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
              placeholder="Search products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchProducts(input);
                }
              }}
            />

            <button
              onClick={() => searchProducts(input)}
              className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-300 px-4 text-sm font-bold text-blue-900 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
            >
              <span className="hidden sm:block">Search</span>
              <BsSearch className="sm:hidden" />
            </button>

            {/*  DROPDOWN */}

            {input.trim() && (
              <div className="absolute left-0 top-[110%] z-50 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl .scrollbar-hide">

                {/*loading */}

                {isLoading && (
                  <div className="space-y-3 p-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="flex animate-pulse items-center gap-3 rounded-xl p-2"
                      >
                        <div className="h-12 w-12 rounded-lg bg-slate-200" />

                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-2/3 rounded bg-slate-200" />
                          <div className="h-3 w-1/3 rounded bg-slate-100" />
                        </div>

                        <div className="h-4 w-10 rounded bg-slate-200" />
                      </div>
                    ))}
                  </div>
                )}

                {/*   Error   */}

                {!isLoading && error && (
                  <div className="flex flex-col items-center gap-2 p-8 text-center">
                    <div className="text-3xl">⚠️</div>

                    <p className="font-semibold text-slate-700">
                      Something went wrong
                    </p>

                    <p className="text-sm text-slate-500">
                      Unable to fetch products.
                    </p>
                  </div>
                )}

                {/*   Empty   */}

                {!isLoading &&
                  !error &&
                  filter?.length === 0 && (
                    <div className="flex flex-col items-center gap-2 p-8 text-center">
                      <div className="text-3xl">
                        <BsSearch className="sm:hidden" />

                      </div>

                      <p className="font-semibold text-slate-700">
                        No products found
                      </p>

                      <p className="text-sm text-slate-500">
                        Try another keyword.
                      </p>
                    </div>
                  )}

                {/*   Results   */}

                {!isLoading &&
                  !error &&
                  filter?.length > 0 && (
                    <div className="max-h-96 overflow-y-auto p-2 scrollbar-hide">

                      {filter.slice(0, 6).map((item) => (

                        <button
                          key={item.id}
                          onClick={() => openProductInfo(item.id)}
                          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-blue-50 scroll"
                        >

                          {/* Thumbnail */}

                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-14 w-14 rounded-xl border  border-slate-300/80 object-cover"
                          />

                          {/* Info */}

                          <div className="min-w-0 flex-1">

                            <p className="truncate font-semibold text-slate-800">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {item.brand}
                            </p>

                          </div>

                          {/* Price */}

                          <div className="text-right">

                            <p className="font-bold text-blue-600">
                              <p>₹{(item.price * 88).toFixed(0)}</p>
                            </p>

                            <p className="text-xs text-yellow-500">
                              ⭐ {item.rating}
                            </p>

                          </div>

                        </button>

                      ))}

                      {/* Footer */}

                      <button
                        onClick={() => searchProducts(input)}
                        className="mt-2 flex w-full items-center justify-center rounded-xl border border-blue-100 bg-blue-50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        View all results →
                      </button>

                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Profile */}

          <button
            onClick={() => navigate("/profile")}
            className="hidden h-11 shrink-0 items-center gap-2 rounded-xl bg-white/15 px-3 text-white backdrop-blur transition hover:bg-white/25 sm:flex"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-300 text-xs font-black text-blue-700">
              <CgProfile />
            </div>

            <span className="text-sm font-bold">
              {user ? user?.name : "Login"}
            </span>
          </button>

          {/* Cart */}

          <button
            onClick={() => navigate("/cart")}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-blue-900 shadow-sm transition hover:bg-yellow-300 active:scale-95"
            aria-label="Shopping cart"
          >
            <LuShoppingCart className="text-xl" />

            {/* cart badge */}

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {user ? user?.cart?.length : ""}
            </span>
          </button>
        </div>

        {/* CATEGORY NAV */}

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* All products */}

          <a
            href="/"
            className="shrink-0 rounded-lg bg-yellow-400 px-4 py-2 text-xs font-bold capitalize text-blue-900 shadow-sm transition hover:bg-yellow-300 sm:text-sm"
          >
            All
          </a>

          {categories.map((category) => (
            <a
              key={category}
              href={`/category/${category}`}
              className="shrink-0 rounded-lg border border-white/40 bg-white px-4 py-2 text-xs font-semibold capitalize text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-white hover:bg-yellow-50 hover:text-blue-600 sm:text-sm"
            >
              {category.replace(/-/g, " ")}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
