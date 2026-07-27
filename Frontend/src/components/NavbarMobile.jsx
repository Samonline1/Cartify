import { useState } from "react";
import toast from "react-hot-toast";
import { BsSearch, BsSmartwatch } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { MdLaptopMac, MdTabletMac, MdDirectionsCar, MdSportsSoccer } from "react-icons/md";
import { PiArmchairFill } from "react-icons/pi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// mobile nav
const NavbarMobile = () => {
  // search text
  const [query, setQuery] = useState("");
  const navigate = useNavigate();



  // quick links
  const shortcuts = [
    { label: "Smartphones", bg: "bg-blue-500", Icon: HiOutlineDevicePhoneMobile, link: "/category/smartphones" },
    { label: "Laptops", bg: "bg-indigo-500", Icon: MdLaptopMac, link: "/category/laptops" },
    { label: "Furniture", bg: "bg-amber-500", Icon: PiArmchairFill, link: "/category/furniture" },
    { label: "Groceries", bg: "bg-green-500", Icon: RiShoppingBag3Line, link: "/category/groceries" },
    { label: "Sports", bg: "bg-lime-500", Icon: MdSportsSoccer, link: "/category/sports-accessories" },
    { label: "Tablets", bg: "bg-red-500", Icon: MdTabletMac, link: "/category/tablets" },
    { label: "Vehicles", bg: "bg-yellow-500", Icon: MdDirectionsCar, link: "/category/vehicle" }

  ];


  // do search
  const handleSearch = () => {
    if (!query.trim()) {
      toast.error("Type something to search");
      return;
    }
    navigate(`/search/${query.trim()}`);
  };


  // render mobile nav
  return (
   <div className="lg:hidden w-full bg-gradient-to-b from-blue-500 to-blue-400 text-slate-900 shadow-md">

  <div className="px-4 py-3">

        {/* TOP BAR */}

    <div className="flex items-center justify-between">

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
            U
          </div>

          <span className="text-xs font-bold">
            Profile
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

    <div className="mt-3 flex h-11 items-center rounded-xl bg-white px-1.5 shadow-sm">

      <BsSearch className="ml-3 shrink-0 text-slate-400" />

      <input
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <button
        onClick={handleSearch}
        className="flex h-9 items-center rounded-lg bg-yellow-400 px-4 text-xs font-black text-blue-900 transition hover:bg-yellow-300 active:scale-95"
      >
        Search
      </button>

    </div>


        {/* SHORTCUTS */}
   

    <div className="mt-3 -mx-1 overflow-x-auto scrollbar-hide">

      <div className="flex gap-2 px-1 pb-1">

        {shortcuts.map((s) => (

          <button
            key={s.label}
            onClick={() => navigate(s.link)}
            className="group flex h-[72px] min-w-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-white px-2 shadow-sm transition active:scale-95"
          >

            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${s.bg} text-sm text-white shadow-sm transition group-hover:scale-105`}
            >
              <s.Icon />
            </span>

            <span className="w-full truncate text-center text-[10px] font-bold capitalize text-slate-700">
              {s.label}
            </span>

          </button>

        ))}

      </div>

    </div>

  </div>

</div>
  );
};

export default NavbarMobile;
