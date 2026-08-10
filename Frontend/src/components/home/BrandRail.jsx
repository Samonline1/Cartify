import { Tag } from "lucide-react";

const BrandRail = ({ brands, onBrandClick }) => {
  return (
    <section className="overflow-hidden border-y border-slate-100 bg-white py-5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-4 flex items-center gap-2">
          <Tag size={17} className="text-blue-600" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
            Popular Brands
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandClick(brand)}
              className="flex min-w-[145px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandRail;
