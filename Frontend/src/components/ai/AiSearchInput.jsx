import {
    Search,
    Plus,
    ChevronDown,
    X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

const searchOptions = [
    {
        value: "ask",
        label: "Ask Search",
        description: "Search using natural language",
    },
    {
        value: "rating",
        label: "Rating",
        description: "Check a product rating",
    },
    {
        value: "compare",
        label: "Compare",
        description: "Compare up to 3 products",
    },
];

const AiSearchInput = ({
    selectedType,
    onTypeChange,
    onSearch,
    loading,

    input,
    onInputChange,

    selectedProducts = [],
    onRemoveProduct,
}) => {
    const [showOptions, setShowOptions] = useState(false);
    const inputRef = useRef(null);

    const selectedOption =
        searchOptions.find(
            (option) => option.value === selectedType
        ) || searchOptions[0];

    const handleSubmit = () => {
        if (!input?.trim() || loading) return;

        onSearch(input.trim());

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    const handleTypeChange = (type) => {
        onTypeChange(type);
        setShowOptions(false);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    useEffect(() => {
        if (!loading) {
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [loading, selectedType]);

    const isCompareFull =
        selectedType === "compare" &&
        selectedProducts.length >= 3;

    return (
        <div className="relative mx-auto w-full max-w-4xl">


            {/* SEARCH CONTROLS */}

            <div className="relative">

                {/* Selected products */}
                {selectedType === "compare" && selectedProducts.length > 0 && (
                    <div className="mb-2 flex gap-2 overflow-x-auto scrollbar-hide">

                        {selectedProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="
                        flex shrink-0 items-center gap-2
                        rounded-xl
                        border border-blue-100
                        bg-blue-50/80
                        px-2.5 py-1.5
                    "
                            >
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-8 w-8 rounded-lg object-cover"
                                />

                                <div className="max-w-[120px]">
                                    <p className="truncate text-xs font-semibold text-blue-900">
                                        {product.title}
                                    </p>

                                    <p className="text-[10px] text-blue-500">
                                        Product {index + 1}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onRemoveProduct(product.id)}
                                    className="
                            rounded-full p-1
                            text-slate-400
                            transition
                            hover:bg-white
                            hover:text-red-500
                        "
                                >
                                    <X size={13} />
                                </button>
                            </div>
                        ))}

                    </div>
                )}

                {/* Selected rating product */}
                {selectedType === "rating" && selectedProducts.length === 1 && (
                    <div
                        className="
                mb-2 flex items-center gap-2
                rounded-xl
                border border-yellow-200
                bg-yellow-50/80
                px-3 py-2
            "
                    >
                        <img
                            src={selectedProducts[0].thumbnail}
                            alt={selectedProducts[0].title}
                            className="h-8 w-8 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-800">
                                {selectedProducts[0].title}
                            </p>

                            <p className="text-[10px] text-yellow-600">
                                Selected for rating
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                onRemoveProduct(selectedProducts[0].id)
                            }
                            className="
                    rounded-full p-1
                    text-slate-400
                    transition
                    hover:bg-white
                    hover:text-red-500
                "
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* INPUT ROW */}
                <div
                    className="
            relative flex items-center gap-1
            rounded-2xl
            border border-slate-200
            bg-white
            p-1.5
            shadow-[0_8px_30px_rgba(15,23,42,0.08)]
            transition-all duration-200
            focus-within:border-blue-400
            focus-within:shadow-[0_8px_30px_rgba(37,99,235,0.12)]
        "
                >

                    {/* Type selector */}
                    <div className="relative shrink-0">

                        <button
                            type="button"
                            onClick={() =>
                                setShowOptions((previous) => !previous)
                            }
                            className="
                    flex h-10 items-center gap-1.5
                    rounded-xl
                    px-2.5
                    text-slate-500
                    transition
                    hover:bg-blue-50
                    hover:text-blue-600
                "
                            aria-label="Select search type"
                        >


                            <span className="hidden text-xs font-semibold sm:block">
                                {selectedOption.label}
                            </span>

                            <ChevronDown
                                size={14}
                                className={`
                        transition-transform duration-200
                        ${showOptions ? "rotate-180 text-blue-600" : ""}
                    `}
                            />
                        </button>

                        {/* SEARCH TYPE MENU */}
                        {showOptions && (
                            <>
                                {/* Mobile backdrop */}
                                <div
                                    className="fixed inset-0 z-[9998]"
                                    onClick={() => setShowOptions(false)}
                                />

                                <div
                                    className="
                            absolute
                            bottom-full
                            left-0
                            z-[9999]
                            mb-2
                            w-[260px]
                            overflow-hidden
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            p-1.5
                            shadow-[0_20px_50px_rgba(15,23,42,0.18)]
                        "
                                >

                                    <div className="px-3 py-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Search mode
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Choose how Cartify should search
                                        </p>
                                    </div>

                                    {searchOptions.map((option) => {
                                        const active =
                                            selectedType === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    handleTypeChange(option.value)
                                                }
                                                className={`
                                        w-full rounded-xl px-3 py-2.5
                                        text-left transition
                                        ${active
                                                        ? "bg-blue-50"
                                                        : "hover:bg-slate-50"
                                                    }
                                    `}
                                            >
                                                <div className="flex items-center justify-between">

                                                    <span
                                                        className={`
                                                text-sm font-semibold
                                                ${active
                                                                ? "text-blue-700"
                                                                : "text-slate-700"
                                                            }
                                            `}
                                                    >
                                                        {option.label}
                                                    </span>

                                                    {active && (
                                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                                                            SELECTED
                                                        </span>
                                                    )}

                                                </div>

                                                <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                                                    {option.description}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                    </div>


                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200" />


                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={input || ""}
                        onChange={(e) => {
                            onInputChange(e.target.value);

                            requestAnimationFrame(() => {
                                inputRef.current?.focus();
                            });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        disabled={loading || isCompareFull}
                        placeholder={
                            isCompareFull
                                ? "Maximum 3 products selected"
                                : selectedType === "ask"
                                    ? "Try: gaming phone under ₹20,000"
                                    : selectedType === "rating"
                                        ? "Search a product..."
                                        : "Search for another product..."
                        }
                        className="
                min-w-0
                flex-1
                bg-transparent
                px-2
                py-2.5
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
            "
                    />


                    {/* Search button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            !input?.trim() ||
                            loading ||
                            isCompareFull
                        }
                        className="
                flex h-10 shrink-0
                items-center justify-center
                gap-1.5
                rounded-xl
                bg-blue-600
                px-3
                text-xs
                font-bold
                text-white
                shadow-sm
                transition-all
                hover:bg-blue-700
                hover:shadow-md
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-40
            "
                    >
                        <Search size={15} />

                        <span className=" sm:inline">
                            {loading ? "Searching..." : "Search"}
                        </span>
                    </button>

                </div>


                {/* Current mode indicator */}
                <div className="mt-2 flex items-center justify-center gap-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                    <span className="text-[10px] font-medium text-slate-400">
                        {selectedOption.label}
                    </span>

                    <span className="text-[10px] text-slate-300">
                        ·
                    </span>

                    <span className="text-[10px] text-slate-400">
                        {selectedOption.description}
                    </span>

                </div>

            </div>

        </div>
    );
};

export default AiSearchInput;
