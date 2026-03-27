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
        setProducts(productData.products);
      } catch (error) {
        console.error("Failed to load trending products", error);
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

  const quickTiles = products.slice(0, 12);
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
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-48 sm:h-56 lg:h-64 w-full rounded-xl overflow-hidden bg-gray-200 border border-gray-200 flex items-center justify-center">
          <img
            onClick={() => navigate(mainHero.href)}
            className="w-full h-full object-cover object-top cursor-pointer"
            src={mainHero.src}
            alt={mainHero.title}
            loading="lazy"
          />
          <button
            onClick={() => navigate(mainHero.href)}
            className="absolute right-3 bottom-3 bg-white text-gray-900 px-3 py-2 rounded-md border border-gray-200"
          >
            →
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-2 w-2 rounded-full ${idx === heroIndex ? "bg-white" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="rounded-xl bg-white border border-gray-200 p-5 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 overflow-hidden">
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="px-3 py-1 rounded-md bg-white border border-gray-200 font-semibold">
                  Categories
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  {mainHero.title}
                </h1>
                <p className="text-gray-700 max-w-md">
                  {mainHero.subtitle}
                </p>
                <button
                  onClick={() => navigate(mainHero.href)}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold"
                >
                  View All Products
                </button>
              </div>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${quickIndex * 100}%)` }}
                >
                  {quickSlides.map((slide, idx) => (
                    <div key={idx} className="min-w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {slide.map((tile) => (
                        <div
                          key={tile.id}
                          className="rounded-lg bg-white border border-gray-200 cursor-pointer p-3 flex items-center gap-3"
                          onClick={() => navigate(`/search/${tile.title}/${tile.id}`)}
                        >
                          <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                            <img
                              src={tile.thumbnail}
                              alt={tile.title}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold line-clamp-2">{tile.title}</p>
                            <p className="text-gray-500 text-xs">₹{(tile.price * 80).toFixed(0)}</p>
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(8, 16).map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex gap-3 items-center cursor-pointer"
              onClick={() => navigate(`/search/${p.title}/${p.id}`)}
            >
              <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{p.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">₹{(p.price * 80).toFixed(0)}</span>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                    {p.discountPercentage}% off
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
