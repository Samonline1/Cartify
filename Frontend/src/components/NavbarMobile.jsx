import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BsSearch, BsSmartwatch } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

import { PiArmchairFill } from "react-icons/pi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { CgProfile } from "react-icons/cg";
import { useProductByName } from "../hooks/queries/useProductName";

// mobile nav
const NavbarMobile = () => {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();
  // search text
  const [input, setInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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


  // do search
  const handleSearch = () => {
    if (!input.trim()) {
      toast.error("Type something to search");
      return;
    }
    navigate(`/search/${input.trim()}`);
    setInput("");
    setDebouncedSearch("");
  };

  // render mobile nav
  return (
    <div className="lg:hidden w-full bg-gradient-to-b from-blue-500 to-blue-400 text-slate-900 shadow-md">
      <div className="px-4 py-3">
        {/* TOP BAR */}

        <div 
        className="flex items-center justify-between">
          {/* Logo */}

          <button
            onClick={() => navigate("/")}
            className="text-white transition active:scale-95"
            style={{
              fontFamily: "'Brush Script MT', cursive",
              fontSize: "1.8rem",
              fontWeight: 700,
            }}
          >
            Cartify
          </button>

          {/* Actions */}

          <div className="flex items-center gap-2">
            {/* Profile */}

            <button
              onClick={() => navigate("/profile")}
              className="flex h-10 items-center gap-2 rounded-xl bg-white/15 px-3 text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 text-[10px] font-black text-blue-700">
                <CgProfile />
              </div>

              <span className="text-sm font-bold">
                {user ? (user?.name).split(" ")[0].slice(0, 8) : "Login"}
              </span>
            </button>

            {/* Cart */}

            <button
              onClick={() => navigate("/cart")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-blue-900 shadow-sm transition hover:bg-yellow-300 active:scale-95"
              aria-label="Shopping cart"
            >
              <LuShoppingCart className="text-lg" />

              {/*  cart count */}
              {/*
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            2
          </span>
          */}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div 
        className="relative flex h-11 min-w-0 flex-1 items-center rounded-2xl bg-white px-2 shadow-lg ring-1 ring-black/5 transition-all duration-200 focus-within:ring-2 focus-within:ring-yellow-300 sm:h-12">
          {/* Search icon */}
          <BsSearch className="ml-3 shrink-0 text-slate-400" />

          {/* Input */}
          <input
            type="text"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
            placeholder="Search products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }

              if (e.key === "Escape") {
                setInput("");
                setDebouncedSearch("");
              }
            }}
          />

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            disabled={!input.trim()}
            className="
      flex
      h-9
      shrink-0
      items-center
      gap-2
      rounded-xl
      bg-gradient-to-r
      from-yellow-400
      to-yellow-300
      px-4
      text-xs
      text-slate-900
      shadow-sm
      transition-all
      duration-200
      hover:scale-[1.03]
      hover:shadow-md
      hover:from-yellow-300
      hover:to-yellow-200
      active:scale-95
      disabled:cursor-not-allowed
      disabled:opacity-50
      disabled:hover:scale-100
      sm:text-sm
    "
          >
            <span>Search</span>
          </button>

          {/* SEARCH SUGGESTIONS */}

          {input.trim() && (
            <div
              className="
        absolute
        left-0
        top-[calc(100%+8px)]
        z-50
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-2xl
        ring-1
        ring-black/5
      "
            >
              {/* ================= HEADER ================= */}

              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isLoading ? "Searching..." : "Suggestions"}
                </p>

                {!isLoading && !error && filter?.length > 0 && (
                  <span className="text-xs font-medium text-slate-400">
                    {Math.min(filter.length, 6)} results
                  </span>
                )}
              </div>

              {/* ================= LOADING ================= */}

              {isLoading && (
                <div className="space-y-1 p-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex animate-pulse items-center gap-3 rounded-xl p-3"
                    >
                      {/* Image skeleton */}
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />

                      {/* Text skeleton */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-3/4 rounded-full bg-slate-200" />
                        <div className="h-3 w-1/3 rounded-full bg-slate-100" />
                      </div>

                      {/* Price skeleton */}
                      <div className="space-y-2">
                        <div className="h-3.5 w-14 rounded-full bg-slate-200" />
                        <div className="ml-auto h-3 w-10 rounded-full bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ================= ERROR ================= */}

              {!isLoading && error && (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                    ⚠️
                  </div>

                  <p className="font-semibold text-slate-800">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    We couldn't load the products.
                  </p>

                  <button
                    type="button"
                    onClick={() => setDebouncedSearch(input)}
                    className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* ================= EMPTY ================= */}

              {!isLoading && !error && filter?.length === 0 && (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <BsSearch className="text-slate-400" />
                  </div>

                  <p className="font-semibold text-slate-800">
                    No products found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try searching for another product.
                  </p>
                </div>
              )}

              {/* ================= RESULTS ================= */}

              {!isLoading && !error && filter?.length > 0 && (
                <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-hide">
                  {filter.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openProductInfo(item.id)}
                      className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  p-3
                  text-left
                  transition-all
                  duration-150
                  hover:bg-blue-50
                  active:scale-[0.99]
                "
                    >
                      {/* Product image */}

                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                        />
                      </div>

                      {/* Product information */}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                          {item.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          {item.brand && (
                            <span className="truncate text-xs text-slate-500">
                              {item.brand}
                            </span>
                          )}

                          <span className="text-slate-300">•</span>

                          <span className="text-xs text-yellow-500">
                            ⭐ {item.rating}
                          </span>
                        </div>
                      </div>

                      {/* Price */}

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-blue-600">
                          ₹{(item.price * 88).toFixed(0)}
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          View
                        </p>
                      </div>
                    </button>
                  ))}

                  {/* ================= VIEW ALL ================= */}

                  <div className="mt-1 border-t border-slate-100 pt-2">
                    <button
                      type="button"
                      onClick={() => searchProducts(input)}
                      className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-50
                  py-3
                  text-sm
                  font-bold
                  text-blue-600
                  transition
                  hover:bg-blue-100
                  hover:text-blue-700
                "
                    >
                      View all results
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
};

export default NavbarMobile;
