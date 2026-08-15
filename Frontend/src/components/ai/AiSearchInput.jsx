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


                {/* SELECTED PRODUCTS */}


            {selectedType === "compare" &&
                selectedProducts.length > 0 && (

                    <div className="mb-3 flex flex-wrap gap-2">

                        {selectedProducts.map((product, index) => (

                            <div
                                key={product.id}
                                className="
                                    flex
                                    max-w-full
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    px-2
                                    py-1.5
                                "
                            >

                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="
                                        h-8
                                        w-8
                                        rounded-lg
                                        object-cover
                                    "
                                />

                                <div className="max-w-[150px]">

                                    <p className="truncate text-xs font-semibold text-blue-900">
                                        {product.title}
                                    </p>

                                    <p className="text-[10px] text-blue-500">
                                        Product {index + 1}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemoveProduct(product.id)
                                    }
                                    className="
                                        ml-1
                                        rounded-full
                                        p-1
                                        text-blue-400
                                        transition
                                        hover:bg-blue-100
                                        hover:text-red-500
                                    "
                                >
                                    <X size={13} />
                                </button>

                            </div>

                        ))}

                    </div>
                )}

            {/* RATING SELECTED PRODUCT */}

            {selectedType === "rating" &&
                selectedProducts.length === 1 && (

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-yellow-200
                            bg-yellow-50
                            px-3
                            py-2
                        "
                    >

                        <img
                            src={selectedProducts[0].thumbnail}
                            alt={selectedProducts[0].title}
                            className="
                                h-9
                                w-9
                                rounded-lg
                                object-cover
                            "
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
                                onRemoveProduct(
                                    selectedProducts[0].id
                                )
                            }
                            className="
                                rounded-full
                                p-1
                                text-slate-400
                                hover:bg-yellow-100
                                hover:text-red-500
                            "
                        >
                            <X size={14} />
                        </button>

                    </div>
                )}


                {/* SEARCH TYPE */}


            <div className="mb-2 flex items-center gap-2">

                <div className="relative">

                    {/* TYPE BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowOptions((previous) => !previous)
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-50
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-slate-700
                            transition
                            hover:border-blue-300
                            hover:bg-blue-50
                        "
                    >

                        <Plus
                            size={14}
                            className="text-blue-600"
                        />

                        <span>
                            {selectedOption.label}
                        </span>

                        <ChevronDown
                            size={14}
                            className={`
                                transition-transform
                                ${
                                    showOptions
                                        ? "rotate-180"
                                        : ""
                                }
                            `}
                        />

                    </button>

        
                        {/* TYPE MENU */}
        

                    {showOptions && (

                        <div
                            className="
                                absolute
                                bottom-full
                                left-0
                                z-[9999]
                                mb-2
                                w-64
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-1.5
                                shadow-2xl
                            "
                        >

                            {searchOptions.map((option) => {

                                const active =
                                    selectedType ===
                                    option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            handleTypeChange(
                                                option.value
                                            )
                                        }
                                        className={`
                                            w-full
                                            rounded-xl
                                            px-3
                                            py-3
                                            text-left
                                            transition

                                            ${
                                                active
                                                    ? "bg-blue-50"
                                                    : "hover:bg-slate-50"
                                            }
                                        `}
                                    >

                                        <div className="flex items-center justify-between">

                                            <span
                                                className={`
                                                    text-sm
                                                    font-semibold
                                                    ${
                                                        active
                                                            ? "text-blue-700"
                                                            : "text-slate-700"
                                                    }
                                                `}
                                            >
                                                {option.label}
                                            </span>

                                            {active && (
                                                <span className="text-[10px] font-bold text-blue-600">
                                                    ACTIVE
                                                </span>
                                            )}

                                        </div>

                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            {option.description}
                                        </p>

                                    </button>
                                );
                            })}

                        </div>
                    )}

                </div>

                <span className="text-[11px] text-slate-400">
                    {selectedOption.description}
                </span>

            </div>


                {/* INPUT */}


            <div
                className="
                    flex
                    items-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-2
                    shadow-lg
                    transition
                    focus-within:border-blue-400
                    focus-within:ring-4
                    focus-within:ring-blue-100
                "
            >

                <Search
                    size={18}
                    className="ml-2 mr-2 shrink-0 text-slate-400"
                />

                <input
                    ref={inputRef}
                    type="text"
                    value={input || ""}
                    onChange={(e) =>
                        {
                            onInputChange(e.target.value);
                            requestAnimationFrame(() => {
                                inputRef.current?.focus();
                            });
                        }
                    }
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
                        py-3
                        text-sm
                        text-slate-800
                        outline-none
                        placeholder:text-slate-400
                    "
                />

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                        !input?.trim() ||
                        loading ||
                        isCompareFull
                    }
                    className="
                        flex
                        h-10
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:bg-blue-700
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >

                    <Search size={16} />

                    <span className="hidden sm:inline">
                        {loading
                            ? "Searching..."
                            : "Search"}
                    </span>

                </button>

            </div>

        </div>
    );
};

export default AiSearchInput;
