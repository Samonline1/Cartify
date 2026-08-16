import { ChevronLeft, ChevronRight, Star, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

const AskSearchResults = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(0);

    if (!data) return null;

    const {
        query,
        filters = {},
        products = [],
        total = 0,
    } = data;

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const PRODUCTS_PER_PAGE = 4;

    const totalPages = Math.max(
        1,
        Math.ceil(products.length / PRODUCTS_PER_PAGE)
    );

    const startIndex = currentPage * PRODUCTS_PER_PAGE;

    const currentProducts = products.slice(
        startIndex,
        startIndex + PRODUCTS_PER_PAGE
    );

    const goNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goPrevious = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // --------------------------------------------------
    // Filters
    // --------------------------------------------------

    const filterTags = [];

    if (filters.category) {
        filterTags.push({
            label: "Category",
            value: filters.category,
        });
    }

    if (filters.minPrice !== null && filters.minPrice !== undefined) {
        filterTags.push({
            label: "Min price",
            value: `₹${filters.minPrice}`,
        });
    }

    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
        filterTags.push({
            label: "Under",
            value: `₹${filters.maxPrice}`,
        });
    }

    if (filters.minRating !== null && filters.minRating !== undefined) {
        filterTags.push({
            label: "Rating",
            value: `${filters.minRating}+ ⭐`,
        });
    }

    if (filters.sortBy) {
        filterTags.push({
            label: "Sort",
            value: filters.sortBy.replaceAll("_", " "),
        });
    }

    filters.features?.forEach((feature) => {
        filterTags.push({
            label: "Feature",
            value: feature,
        });
    });

    return (
        <div className="mx-auto w-full max-w-6xl space-y-5">


                {/* SEARCH SUMMARY */}

            <div className="rounded-2xl py-5 ">

               <div className="flex items-start gap-3">

    {/* Message */}
    <div className="max-w-[85%]">

        <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
<div className="flex gap-2">



{/* Assistant Avatar */}
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
        <Sparkles size={15} />
    </div>
    
          <div>
              <p className="text-sm leading-6 text-slate-700">
                I found{" "}
                <span className="font-semibold text-slate-900">
                    {total} product{total !== 1 ? "s" : ""}
                </span>{" "}
                matching your search for{" "}
                <span className="font-semibold text-blue-600">
                    "{query}"
                </span>
                .
            </p>


              {/* Filters */}
            {filterTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {filterTags.map((filter, index) => (
                        <span
                            key={`${filter.label}-${index}`}
                            className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
                        >
                            {filter.label}:{" "}
                            <span className="font-semibold text-slate-800">
                                {filter.value}
                            </span>
                        </span>
                    ))}
                </div>
            )}
            
          </div>

          </div>


        </div>

    </div>
</div>



            </div>



                {/* PRODUCTS */}

            {products.length === 0 ? (

                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                    <p className="text-lg font-bold text-slate-800">
                        No products found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                    </p>

                </div>

            ) : (

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    {/* HEADER */}

                    <div className="mb-4 flex items-center justify-between">

                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Matching Products
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Showing{" "}
                                {startIndex + 1}
                                {" - "}
                                {Math.min(
                                    startIndex + PRODUCTS_PER_PAGE,
                                    products.length
                                )}{" "}
                                of {products.length}
                            </p>
                        </div>


                        {/* PAGINATION */}

                        <div className="flex items-center gap-2">

                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                {currentPage + 1} / {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={goPrevious}
                                disabled={currentPage === 0}
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg border border-slate-200
                                    bg-white text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                "
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={goNext}
                                disabled={currentPage === totalPages - 1}
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg border border-slate-200
                                    bg-white text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-30
                                "
                            >
                                <ChevronRight size={16} />
                            </button>

                        </div>

                    </div>


                        {/* HORIZONTAL PRODUCT SCROLLER */}

                    <div className="overflow-x-auto scrollbar-hide">

                        <div className="flex min-w-max gap-4 pb-2">

                            {currentProducts.map((product) => (

                                <div
                                    key={product.id}
                                    className="
                                        w-[230px]
                                        shrink-0
                                        overflow-hidden
                                        rounded-2xl
                                        border border-slate-200
                                        bg-white
                                        transition
                                        hover:-translate-y-1
                                        hover:border-blue-200
                                        hover:shadow-lg
                                    "
                                >

                                    {/* IMAGE */}

                                    <div className="flex h-44 items-center justify-center bg-slate-50 p-4">

                                        <img
                                            src={
                                                product.images?.[0] ||
                                                product.thumbnail
                                            }
                                            alt={product.title}
                                            loading="lazy"
                                            className="
                                                h-full
                                                w-full
                                                object-contain
                                                transition
                                                duration-300
                                                hover:scale-105
                                            "
                                        />

                                    </div>


                                    {/* PRODUCT INFO */}

                                    <div className="p-4">

                                        {/* Brand */}

                                        {product.brand && (
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                {product.brand}
                                            </p>
                                        )}


                                        {/* Title */}

                                        <h4 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-bold text-slate-900">
                                            {product.title}
                                        </h4>


                                        {/* Rating */}

                                        <div className="mt-2 flex items-center gap-1">

                                            <Star
                                                size={14}
                                                fill="currentColor"
                                                className="text-yellow-400"
                                            />

                                            <span className="text-xs font-bold text-slate-700">
                                                {product.rating}
                                            </span>

                                            <span className="text-[11px] text-slate-400">
                                                / 5
                                            </span>

                                        </div>


                                        {/* PRICE */}

                                        <div className="mt-3 flex items-center gap-2">

                                            <span className="text-lg font-black text-blue-600">
                                                ₹{(product.price * 88).toFixed(0)}
                                            </span>

                                            {product.discountPercentage > 0 && (
                                                <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
                                                    {product.discountPercentage.toFixed(
                                                        0
                                                    )}
                                                    % OFF
                                                </span>
                                            )}

                                        </div>


                                        {/* STOCK */}

                                        <div className="mt-3 flex items-center justify-between">

                                            <span
                                                className={`
                                                    text-[11px] font-semibold
                                                    ${
                                                        product.stock > 0
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                    }
                                                `}
                                            >
                                                {product.availabilityStatus}
                                            </span>

                                            {product.returnPolicy && (
                                                <span className="text-[10px] text-slate-400">
                                                    {product.returnPolicy}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AskSearchResults;