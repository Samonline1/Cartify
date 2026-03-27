import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsSearch } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

// navbar
const Navbar = () => {
  // search text
  const [input, setInput] = useState("");
  const navigate = useNavigate();

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




  // render nav
  return (
    <nav className="sticky top-0 z-30 bg-gradient-to-b from-blue-400 to-blue-300 backdrop-blur">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-15 py-3 space-y-2">
        <div className="flex items-center gap-3 text-sm text-white">
          <button
            onClick={() => navigate("/")}
            className="h-11 px-4 rounded-full text-white tracking-tight flex items-center"
            style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "1.7rem", fontWeight: 700 }}
          >
            Cartify
          </button>
          <div className="flex flex-1 items-center h-11 bg-white/20 rounded-full px-3 shadow-sm">
            <input
              className="flex-1 h-full text-sm sm:text-base outline-none px-3"
              placeholder="Search products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchProducts(input)}
            />
            <button
              onClick={() => searchProducts(input)}
              className="h-9 bg-white text-slate-900 font-semibold rounded-full flex items-center"
            >
              <BsSearch className="text-slate-500 mx-2" />
            </button>
          </div>
          <div className="flex gap-3">
            <button
                onClick={() => navigate("/profile")}
            className="h-11 flex items-center gap-2 px-3 bg-white/20 rounded-full cursor-pointer"
          >
            <div className="h-5 w-5 rounded-full bg-white/70 border border-white/50" />
            <span className="font-semibold text-white text-sm">
              Profile
            </span>
          </button>
          <button
            onClick={() => navigate("/cart")}
              className="flex items-center bg-white/20 rounded-full "
          >
            <LuShoppingCart className="text-2xl px-1" />
          </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 text-xs sm:text-sm">
          {categories.map((category) => (
            <a
              key={category}
              href={`/category/${category}`}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 whitespace-nowrap"
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
