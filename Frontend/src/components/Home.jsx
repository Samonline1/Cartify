import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// home page
const Home = () => {
  const navigate = useNavigate();

  const heroBanners = [
    {
      src: "https://images-eu.ssl-images-amazon.com/images/G/31/img24/Media/BAU/PC_Hero_1x-toys._CB582765723_.jpg",
      href: "/category/vehicle",
      title: "Sequoia Inspiring Musico.",
      subtitle: "Making your dream music come true with Sequoia Sounds",
    },
    {
      src: "https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2025/GW/BAU/Unrec/PC/934044815._CB551384116_.jpg",
      href: "/category/womens-dresses",
      title: "Style Refresh",
      subtitle: "Fresh fits for every mood",
    },
    {
      src: "https://images-eu.ssl-images-amazon.com/images/G/31/2025/LawnGarden/OCTOBER2025/GATEWAY/30thOCT/Door-and-bed-nets-GW-Hero-Pc._CB779327545_.jpg",
      href: "/category/furniture",
      title: "Comfort for Home",
      subtitle: "Curated picks for cozy spaces",
    },
    {
      src: "https://images-eu.ssl-images-amazon.com/images/G/31/img22/CEPC/Jupiter/61/updated/PC_PB_Leadup_ASIN_Date._CB801963094_.jpg",
      href: "/category/mobile-accessories",
      title: "Essential Accessories",
      subtitle: "Keep your devices powered and protected",
    },
    {
      src: "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/uber_new_high._CB537689643_.jpg",
      href: "/category/smartphones",
      title: "Flagship Smartphones",
      subtitle: "Latest launches and top-rated picks",
    },
    {
      src: "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/GW/yesbank/Shampoos__conditioners_pc._CB796616147_.png",
      href: "/category/beauty",
      title: "Beauty Essentials",
      subtitle: "Fresh drops & value bundles",
    },
  ];

  const [products, setProducts] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [quickIndex, setQuickIndex] = useState(0);

  useEffect(() => {
    const trendingProducts = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=30");
        const productData = await res.json();
        setProducts(Array.isArray(productData.products) ? productData.products : []);
      } catch (error) {
        console.error("Failed to load trending products", error);
        setProducts([]);
      }
    };
    trendingProducts();
  }, []);

  useEffect(() => {
    if (!heroBanners.length) return;
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroBanners.length);
    }, 3000);
    return () => clearInterval(id);
  }, [heroBanners.length]);

  const safeProducts = Array.isArray(products) ? products : [];
  const quickTiles = safeProducts.slice(0, 12);
  const quickSlides = [];
  for (let i = 0; i < quickTiles.length; i += 4) {
    quickSlides.push(quickTiles.slice(i, i + 4));
  }

  useEffect(() => {
    if (quickSlides.length <= 1) return;
    const id = setInterval(() => {
      setQuickIndex((prev) => (prev + 1) % quickSlides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [quickSlides.length]);

  const mainHero = heroBanners[heroIndex] || heroBanners[0];

  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-900">
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
  <div className="relative w-full h-[240px] sm:h-[350px] lg:h-[250px] xl:h-[240px] overflow-hidden rounded-3xl bg-gray-200 shadow-lg">
    <img
      onClick={() => navigate(mainHero.href)}
      src={mainHero.src}
      alt={mainHero.title}
      loading="lazy"
      className="h-full w-full cursor-pointer object-cover object-top transition-transform duration-500 hover:scale-105"
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

    {/* Arrow */}
    <button
      onClick={() => navigate(mainHero.href)}
      className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-xl shadow-lg backdrop-blur transition hover:scale-110"
    >
      →
    </button>

    {/* Dots */}
    <div className="absolute bottom-6 left-6 flex gap-2">
      {heroBanners.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setHeroIndex(idx)}
          className={`h-3 w-3 rounded-full transition ${
            idx === heroIndex
              ? "bg-white scale-125"
              : "bg-white/50 hover:bg-white/80"
          }`}
        />
      ))}
    </div>
  </div>
</section>


      <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
<div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
  <div className="grid lg:grid-cols-[1.8fr,1fr]">

    {/* Hero */}
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 lg:p-12 text-white">

      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

      <span className="relative inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-md">
        ✨ Featured Collection
      </span>

      <div className="relative mt-6 max-w-2xl">
        <h1 className="text-4xl lg:text-6xl font-black leading-tight">
          {mainHero.title}
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
          {mainHero.subtitle}
        </p>

        <button
          onClick={() => navigate(mainHero.href)}
          className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
        >
          Shop Now →
        </button>
      </div>

      {/* Slider */}
      <div className="relative mt-10 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out will-change-transform"
          style={{
            transform: `translateX(-${quickIndex * 100}%)`,
          }}
        >
          {quickSlides.map((slide, idx) => (
            <div
              key={idx}
              className="min-w-full grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {slide.map((tile) => (
                <div
                  key={tile.id}
                  onClick={() =>
                    navigate(`/search/${tile.title}/${tile.id}`)
                  }
                  className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">

                    {/* Image */}
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                      <img
                        src={tile.thumbnail}
                        alt={tile.title}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                        {tile.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {tile.brand}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          ₹{(tile.price * 80).toFixed(0)}
                        </span>

                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          {Math.round(tile.discountPercentage)}% OFF
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>

  </div>
</div>



        <div className="mt-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-900">
      Featured Products
    </h2>
  </div>

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
    {safeProducts.slice(8, 16).map((p) => (
      <div
        key={p.id}
        onClick={() => navigate(`/search/${p.title}/${p.id}`)}
        className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Image */}
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={p.thumbnail}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">
            {p.title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
            {p.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₹{(p.price * 80).toFixed(0)}
            </span>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              {p.discountPercentage}% OFF
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      </section>
    </div>
  );
};

export default Home;
