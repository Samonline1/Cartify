import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// home page
const Home = () => {
  const navigate = useNavigate();

 const heroBanners = [
  {
    src: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=85",
    href: "/category/vehicle",
    title: "Fun Starts Here",
    subtitle: "Discover colorful toys, vehicles, and more for every adventure",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=85",
    href: "/category/womens-dresses",
    title: "Refresh Your Style",
    subtitle: "Find dresses and fashion picks made for every occasion",
  },
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
    href: "/category/furniture",
    title: "Make Home Feel Better",
    subtitle: "Comfortable furniture and beautiful pieces for your space",
  },
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=85",
    href: "/category/mobile-accessories",
    title: "Power Up Your Setup",
    subtitle: "Smart accessories to keep your everyday tech ready",
  },
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=85",
    href: "/category/smartphones",
    title: "Upgrade Your Phone",
    subtitle: "Explore smartphones and the latest mobile technology",
  },
  {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85",
    href: "/category/beauty",
    title: "Beauty Essentials",
    subtitle: "Everyday skincare and beauty products worth discovering",
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
        setProducts(
          Array.isArray(productData.products) ? productData.products : [],
        );
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
  <div className="min-h-screen w-full bg-[#f8fbff] text-slate-900">

      {/* HERO BANNER */}

  <section className="mx-auto w-full max-w-8xl px-3 py-5 sm:px-6 sm:py-5 lg:px-8">

    <div className="relative mx-auto h-[260px] w-full max-w-7xl overflow-hidden rounded-3xl bg-blue-100 shadow-sm sm:h-[360px] lg:h-[390px]">

      <img
        onClick={() => navigate(mainHero.href)}
        src={mainHero.src}
        alt={mainHero.title}
        loading="lazy"
        className="h-full w-full cursor-pointer object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
      />

      {/* Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/75 via-blue-900/30 to-transparent" />

      {/* Hero content */}

      <div className="absolute inset-0 flex items-center">

        <div className="max-w-xl px-6 sm:px-10 lg:px-14">

          <span className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black text-blue-900 shadow-sm sm:text-sm">
            Featured Collection
          </span>

          <h1 className="mt-4 max-w-lg text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {mainHero.title}
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-blue-50 sm:text-base">
            {mainHero.subtitle}
          </p>

          <button
            onClick={() => navigate(mainHero.href)}
            className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-blue-900 shadow-[0_4px_0px_#ca8a04] transition hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0"
          >
            Shop Now →
          </button>

        </div>

      </div>


      {/* Arrow */}

      <button
        onClick={() => navigate(mainHero.href)}
        className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-blue-600 shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white"
        aria-label="Open featured collection"
      >
        →
      </button>


      {/* Dots */}

      <div className="absolute bottom-6 left-6 flex items-center gap-2">

        {heroBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setHeroIndex(idx)}
            aria-label={`Go to banner ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              idx === heroIndex
                ? "w-7 bg-yellow-400"
                : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}

      </div>

    </div>

  </section>


      {/* FEATURED COLLECTION */}

  <section className="mx-auto w-full max-w-8xl px-3 py-2 sm:px-6 sm:py-5 lg:px-8">

    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">

      <div className="grid lg:grid-cols-[0.9fr_1.5fr]">


        {/* LEFT BRAND PANEL */}

        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-7 text-white sm:p-9 lg:p-10">

          {/* Decorative circles */}

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-yellow-300/10" />

          <div className="relative">

            <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
               Cartify Picks
            </span>

            <h2 className="mt-5 max-w-md text-3xl font-black leading-tight sm:text-4xl">
              {mainHero.title}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-blue-50">
              Discover some of the products we're loving right now.
              Great finds, simple shopping.
            </p>

            <button
              onClick={() => navigate(mainHero.href)}
              className="mt-6 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-blue-900 shadow-[0_4px_0px_#ca8a04] transition hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0"
            >
              Explore Collection →
            </button>

          </div>


          {/* Decorative badge */}

          <div className="relative mt-10 hidden w-fit items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-semibold backdrop-blur sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 text-blue-900">
              ✓
            </span>

            Curated for you
          </div>

        </div>


        {/* RIGHT PRODUCT SLIDER */}

        <div className="relative overflow-hidden bg-[#f8fbff] p-5 sm:p-7 lg:p-8">

          <div
            className="flex transition-transform duration-700 ease-in-out will-change-transform"
            style={{
              transform: `translateX(-${quickIndex * 100}%)`,
            }}
          >

            {quickSlides.map((slide, idx) => (

              <div
                key={idx}
                className="grid min-w-full grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4"
              >

                {slide.map((tile) => (

                  <div
                    key={tile.id}
                    onClick={() =>
                      navigate(`/search/${tile.title}/${tile.id}`)
                    }
                    className="group cursor-pointer rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-4"
                  >

                    {/* Product image */}

                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-50">

                      <img
                        src={tile.thumbnail}
                        alt={tile.title}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                      />

                    </div>


                    {/* Product info */}

                    <div className="mt-3">

                      <h3 className="line-clamp-2 text-xs font-bold leading-5 text-slate-800 sm:text-sm">
                        {tile.title}
                      </h3>

                      <p className="mt-1 truncate text-[11px] text-slate-400 sm:text-xs">
                        {tile.brand || "Cartify pick"}
                      </p>


                      <div className="mt-3 flex items-center justify-between gap-2">

                        <span className="text-sm font-black text-blue-600 sm:text-base">
                          ₹{(tile.price * 80).toFixed(0)}
                        </span>

                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-[9px] font-black text-yellow-700 sm:text-[10px]">
                          {Math.round(tile.discountPercentage)}% OFF
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            ))}

          </div>


          {/* Slider controls */}

          <div className="mt-5 flex items-center justify-between">

            <div className="flex gap-1.5">

              {quickSlides.map((_, idx) => (

                <button
                  key={idx}
                  onClick={() => setQuickIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === quickIndex
                      ? "w-6 bg-blue-500"
                      : "w-1.5 bg-blue-100"
                  }`}
                  aria-label={`Go to products slide ${idx + 1}`}
                />

              ))}

            </div>

            <span className="text-xs font-semibold text-slate-400">
              Swipe to explore →
            </span>

          </div>

        </div>

      </div>

    </div>

  </section>


      {/* FEATURED PRODUCTS */}

  <section className="mx-auto w-full max-w-7xl px-3 pb-12 sm:px-6 lg:px-8">

    {/* Heading */}

    <div className="mb-5 flex items-end justify-between">

      <div>

        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-500">
          Handpicked
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Featured Products
        </h2>

      </div>

      <button
        onClick={() => navigate("/")}
        className="hidden rounded-lg px-3 py-2 text-sm font-bold text-blue-500 transition hover:bg-blue-50 sm:block"
      >
        View all →
      </button>

    </div>


    {/* Product grid */}

    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">

      {safeProducts.slice(8, 16).map((p) => (

        <div
          key={p.id}
          onClick={() => navigate(`/search/${p.title}/${p.id}`)}
          className="group cursor-pointer overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
        >

          {/* Image */}

          <div className="relative aspect-square overflow-hidden bg-slate-50">

            <img
              src={p.thumbnail}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            />

            {/* Discount */}

            <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black text-blue-900 shadow-sm">
              {Math.round(p.discountPercentage)}% OFF
            </span>

          </div>


          {/* Product info */}

          <div className="p-3.5 sm:p-4">

            <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-800">
              {p.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
              {p.description}
            </p>


            <div className="mt-4 flex items-center justify-between gap-2">

              <span className="text-base font-black text-slate-900 sm:text-lg">
                ₹{(p.price * 80).toFixed(0)}
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-500 transition group-hover:bg-blue-500 group-hover:text-white">
                →
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
