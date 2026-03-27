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
    <div className="lg:hidden w-full bg-gradient-to-b from-blue-400 to-blue-300 text-slate-900 shadow-md">
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2 text-xs text-white">
          <button
            onClick={() => navigate("/")}
            className="text-xl text-white rounded-full tracking-tight rounded-full "
            style={{ fontFamily: "'Brush Script MT', cursive", fontSize: "1.6rem", fontWeight: 700 }}
          >
            Cartify
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs"
            >
              <div className="h-4 w-4 rounded-full bg-white/70 border border-white/50" />
              <span className="font-semibold text-white">Profile</span>
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs"
            >
              <LuShoppingCart className="text-sm" />
           
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.link)}
              className="min-w-[96px] max-w-[96px] h-16 bg-white rounded-xl shadow-sm px-3 py-2 flex flex-col items-center justify-center gap-1"
            >
              <span className={`h-8 w-8 ${s.bg} rounded-lg flex items-center justify-center text-lg text-white`}>
                <s.Icon />
              </span>
              <span className="text-[11px] font-semibold truncate w-full text-center">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
          <BsSearch className="text-slate-500 mr-2" />
          <input
            className="flex-1 text-sm outline-none"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 bg-white-400 text-slate-900 font-semibold rounded-full bg-yellow-400"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;
