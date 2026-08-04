import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsSearch } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { CgProfile } from "react-icons/cg";



// navbar
const Navbar = () => {
  // search text
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();


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
  };


  console.log(user)

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

          <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl bg-white px-1.5 shadow-sm sm:h-12 sm:rounded-2xl">

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
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-yellow-400 px-3 text-sm font-bold text-blue-900 transition hover:bg-yellow-300 active:scale-95 sm:h-10 sm:px-4"
            >
              <span className="hidden sm:inline">
                Search
              </span>

              <BsSearch className="sm:hidden" />
            </button>

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
