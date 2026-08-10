const CategoryRail = ({
  categories,
  activeIndex,
  onCategoryClick,
  onPrev,
  onNext,
  formatCategory,
}) => {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Explore
            </p>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">Shop by Category</h2>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-500"
            style={{ transform: `translateX(-${activeIndex * 240}px)` }}
          >
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryClick(category)}
                className="group flex min-w-[105px] flex-col items-center"
              >
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-50 transition duration-300 group-hover:-translate-y-1 group-hover:bg-blue-100 group-hover:shadow-md sm:h-28 sm:w-28">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="mt-3 max-w-[110px] truncate text-center text-xs font-semibold text-slate-700 sm:text-sm">
                  {formatCategory(category.name)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryRail;
