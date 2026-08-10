import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HomeHero = ({ product, products, activeIndex, onPrev, onNext, onDotClick, onOpenProduct }) => {
  if (!product) return null;

  return (
    <section className="relative overflow-hidden bg-blue-600">
      <div className="relative mx-auto h-[300px] max-w-[1600px] overflow-hidden sm:h-[400px] lg:h-[470px]">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-95 transition-all duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/45 to-transparent" />

        <div className="relative z-10 flex h-full items-center px-6 sm:px-10 lg:px-20">
          <div className="max-w-xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur-md">
              <Sparkles size={14} />
              Today's Deal
            </div>

            <h1 className="max-w-lg text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {product.title}
            </h1>

            <p className="mt-3 max-w-md line-clamp-2 text-sm text-white/80 sm:text-base">
              {product.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenProduct(product)}
                className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-blue-950 transition hover:bg-yellow-300 hover:shadow-lg active:scale-95"
              >
                Shop Now
                <ArrowRight className="ml-2 inline" size={16} />
              </button>

              <span className="rounded-xl bg-white/15 px-4 py-3 text-sm font-bold backdrop-blur">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            </div>
          </div>
        </div>

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
                    index === activeIndex ? "w-7 bg-yellow-400" : "w-2 bg-white/60"
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
