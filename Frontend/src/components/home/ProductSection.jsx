import { ArrowRight, Star } from "lucide-react";

const ProductSection = ({
  title,
  subtitle,
  products,
  formatPrice,
  onProduct,
  highlightDiscount = false,
}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            onClick={() => onProduct(product)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <img
                src={product.thumbnail}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-110"
              />

              {product.discountPercentage > 0 && (
                <span
                  className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-black ${
                    highlightDiscount ? "bg-red-500 text-white" : "bg-yellow-400 text-blue-950"
                  }`}
                >
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-800">
                {product.title}
              </h3>

              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <Star size={13} fill="currentColor" className="text-yellow-500" />
                <span className="font-semibold">{product.rating}</span>
                <span>· {product.brand || "Popular"}</span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-base font-black text-slate-900 sm:text-lg">
                  {formatPrice(product.price)}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
