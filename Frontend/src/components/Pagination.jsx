import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, pages, setCurrentPage }) => {
    if (pages <= 1) return null;

    return (
        <div className="mt-10 flex items-center justify-center gap-2">
            {/* Previous */}
            <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 0}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-sm transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FiChevronLeft />

            </button>

            {/* Page Numbers */}
            {[...Array(pages).keys()].map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-medium transition-all
            ${page === currentPage
                            ? "bg-red-600 text-white shadow-md"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-red-500 hover:text-red-600 hover:shadow-sm"
                        }`}
                >
                    {page + 1}
                </button>
            ))}

            {/* Next */}
            <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === pages - 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-sm transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FiChevronRight />
            </button>
        </div>
    );
};

export default Pagination;