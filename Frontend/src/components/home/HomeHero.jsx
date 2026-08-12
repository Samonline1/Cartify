import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  MdLaptopMac,
  MdTabletMac,
  MdDirectionsCar,
  MdSportsSoccer,
} from "react-icons/md";
import { BsSearch, BsSmartwatch } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

import { PiArmchairFill } from "react-icons/pi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const HomeHero = ({ product, products, activeIndex, onPrev, onNext, onDotClick, onOpenProduct }) => {
  if (!product) return null;

    // quick links
  const shortcuts = [
    {
      label: "Smartphones",
      bg: "bg-blue-500",
      Icon: HiOutlineDevicePhoneMobile,
      link: "/category/smartphones",
    },
    {
      label: "Laptops",
      bg: "bg-indigo-500",
      Icon: MdLaptopMac,
      link: "/category/laptops",
    },
    {
      label: "Furniture",
      bg: "bg-amber-500",
      Icon: PiArmchairFill,
      link: "/category/furniture",
    },
    {
      label: "Groceries",
      bg: "bg-green-500",
      Icon: RiShoppingBag3Line,
      link: "/category/groceries",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-t from-blue-500 to-blue-400">

  {/* SHORTCUTS */}

        <div 
        className="mt-3 px-5 -mx-1 overflow-x-auto scrollbar-hide lg:hidden">
          <div className="flex gap-2 px-1 pb-1">
            {shortcuts.map((s) => (
              <button
                key={s.label}
                onClick={() => navigate(s.link)}
                className="group flex h-[72px] min-w-[93px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-white px-2 shadow-sm transition active:scale-95"
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

  <div className="relative mx-auto flex h-[300px] max-w-[1600px] overflow-hidden sm:h-[400px] lg:h-[470px]">

    {/* LEFT */}
    <div className="relative z-10 flex w-full items-center px-6 sm:px-10 lg:w-1/2 lg:px-20">
      <div className="max-w-xl text-white">

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur-md sm:mb-4">
          <Sparkles size={14} />
          Today's Deal
        </div>

        <h3 className="max-w-lg text-3xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
          {product.title}
        </h3>

        <p className="mt-3 max-w-md line-clamp-2 text-sm leading-relaxed text-white/80 sm:text-base">
          {product.description}
        </p>
      </div>
    </div>

    {/* RIGHT */}
    <div
      className="absolute right-0 top-0 h-full w-[55%] cursor-pointer lg:w-1/2"
      onClick={() => onOpenProduct(product)}
    >

      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-full w-full object-contain object-center opacity-50 lg:opacity-95 transition-transform duration-700 hover:scale-105"
      />
    </div>

    {/* Navigation */}
    {products.length > 1 && (
      <>
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:scale-105 sm:flex"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:scale-105 sm:flex"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-7 bg-yellow-400"
                  : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </>
    )}
  </div>
</section>
  );
};

export default HomeHero;
