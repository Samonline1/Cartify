import { X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import AiSearchInput from "./AiSearchInput";
import AiLoading from "./AiLoading";

import { useAskSearch } from "../../hooks/queries/useAskSearch";
import { useProductByName } from "../../hooks/queries/useProductName";

import AskSearchResults from "./results/AskSearchResults";
import RatingResults from "./results/RatingResults";
import CompareResults from "./results/CompareResults";

const AiShoppingModal = ({ open, onClose }) => {
    const [searchType, setSearchType] = useState("ask");

    // Ask search
    const [submittedQuery, setSubmittedQuery] = useState("");

    // Rating / compare input
    const [productInput, setProductInput] = useState("");

    // Debounced value
    const [debouncedProductInput, setDebouncedProductInput] = useState("");

    // Selected products for compare
    const [selectedProducts, setSelectedProducts] = useState([]);

    //  * DEBOUNCE
    

    useEffect(() => {
        if (searchType === "ask") {
            return;
        }

        const timer = setTimeout(() => {
            setDebouncedProductInput(productInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [productInput, searchType]);

    //  * ASK SEARCH

    const askQuery = useAskSearch(
        submittedQuery,
        searchType === "ask" && Boolean(submittedQuery)
    );


    //  * PRODUCT SEARCH


    const productQuery = useProductByName(
        debouncedProductInput,
        searchType !== "ask" &&
            Boolean(debouncedProductInput)
    );


    //  * BODY SCROLL LOCK


    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);


    //  * RESET WHEN MODAL CLOSES


    useEffect(() => {
        if (!open) {
            setSearchType("ask");
            setSubmittedQuery("");
            setProductInput("");
            setDebouncedProductInput("");
            setSelectedProducts([]);
        }
    }, [open]);

    if (!open) return null;


    //  * CHANGE SEARCH TYPE


    const handleTypeChange = (type) => {
        setSearchType(type);

        // Clear everything from previous mode
        setSubmittedQuery("");
        setProductInput("");
        setDebouncedProductInput("");
        setSelectedProducts([]);
    };


    //  * ASK SEARCH SUBMIT


    const handleAskSearch = (value) => {
        if (!value.trim()) return;

        setSubmittedQuery(value.trim());
    };


    //  * PRODUCT INPUT


    const handleProductInput = (value) => {
        setProductInput(value);
    };


    //  * SELECT PRODUCT


    const handleProductSelect = (product) => {
        if (!product) return;

        //  * RATING
         

        if (searchType === "rating") {
            setSelectedProducts([product]);

            // Clear search
            setProductInput("");
            setDebouncedProductInput("");

            return;
        }

        
        //  * COMPARE
        

        if (searchType === "compare") {
            // Don't add duplicate product
            const alreadySelected = selectedProducts.some(
                (item) => item.id === product.id
            );

            if (alreadySelected) return;

            // Maximum 3
            if (selectedProducts.length >= 3) return;

            setSelectedProducts((prev) => [
                ...prev,
                product,
            ]);

            // Clear search for next product
            setProductInput("");
            setDebouncedProductInput("");
        }
    };


    //  * REMOVE COMPARE PRODUCT


    const handleRemoveProduct = (productId) => {
        setSelectedProducts((prev) =>
            prev.filter((product) => product.id !== productId)
        );
    };


    //  * ENTER / SEARCH BUTTON


    const handleSearch = (value) => {
        if (searchType === "ask") {
            handleAskSearch(value);
            return;
        }

        /*
         * For rating / compare:
         *
         * No immediately submit.
         *
         * Debounce searches for products.
         */

        setProductInput(value);
    };


    //  * CURRENT QUERY


    const isProductSearching =
        searchType !== "ask" &&
        productQuery.isLoading;


    //  * CLOSE


    const handleClose = () => {
        onClose();
    };

   return (
    <div
        className="
            fixed inset-0 z-[100]
            h-dvh w-full
            overflow-hidden
            bg-gradient-to-t from-blue-500 to-blue-400
        "
    >
        <div
            onClick={(e) => e.stopPropagation()}
            className="
                flex h-full w-full flex-col
                overflow-hidden
                bg-gradient-to-t from-blue-100 to-blue-500
            "
        >

             {/* HEADER  */}

            <header
                className="
                    flex shrink-0 items-center justify-between
                    px-4 py-3
                    text-white
                    
                    sm:px-6 sm:py-4
                "
            >

                {/* Brand */}

                <div className="flex min-w-0 items-center gap-3">

                    <div
                        className="
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-white
                            text-blue-600
                            shadow-sm
                        "
                    >
                        <Sparkles size={20} />
                    </div>

                    <div className="min-w-0">

                        <h2 className="truncate text-base font-bold sm:text-lg">
                            Cartify Shopping Assistant
                        </h2>

                        <p className="hidden text-xs text-blue-100 sm:block">
                            Search, compare and explore products
                        </p>

                    </div>

                </div>


                {/* Close */}

                <button
                    type="button"
                    onClick={handleClose}
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-white/15
                        text-white
                        transition
                        hover:bg-white/25
                        active:scale-95
                    "
                    aria-label="Close AI Shopping"
                >
                    <X size={19} />
                </button>

            </header>


             {/* RESULTS  */}

            <main
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    scrollbar-hide
                    px-3 py-4
                    sm:px-6 sm:py-6
                    lg:px-10
                "
            >

                <div className="mx-auto w-full max-w-7xl">

                    {/* Your existing initial states */}

                    {searchType === "ask" &&
                        !submittedQuery && (
                            <div className="flex min-h-[60vh] items-center justify-center">

                                <div className="max-w-2xl px-4 text-center">


                                    <h1
                                        className="
                                            mt-5
                                            text-2xl font-black
                                            tracking-tight
                                            text-white
                                            sm:text-3xl
                                        "
                                    >
                                        What are you looking for?
                                    </h1>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        Search naturally and let Cartify find
                                        the products for you.
                                    </p>


                                </div>

                            </div>
                        )}


                    {/* Rating initial */}

                    {searchType === "rating" &&
                        selectedProducts.length === 0 &&
                        !productInput && (
                            <div className="flex min-h-[60vh] items-center justify-center">

                                <div className="px-4 text-center">


                                    <h1 className="mt-5 text-2xl font-black text-white">
                                        Check product ratings
                                    </h1>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Search for a product and select it to
                                        see its reviews and rating.
                                    </p>

                                </div>

                            </div>
                        )}


                    {/* Compare initial */}

                    {searchType === "compare" &&
                        selectedProducts.length === 0 &&
                        !productInput && (
                            <div className="flex min-h-[60vh] items-center justify-center">

                                <div className="px-4 text-center">

                                    <h1 className="mt-5 text-2xl font-black text-white">
                                        Compare products
                                    </h1>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Select up to 3 products to compare
                                        their specifications.
                                    </p>

                                </div>

                            </div>
                        )}


                    {/* Loading */}

                    {searchType === "ask" &&
                        askQuery.isLoading && (
                            <AiLoading />
                        )}

                    {searchType !== "ask" &&
                        isProductSearching && (
                            <AiLoading />
                        )}


                    {/* Errors */}

                    {searchType === "ask" &&
                        askQuery.isError && (
                            <div
                                className="
                                    mx-auto mt-8 max-w-xl
                                    rounded-2xl
                                    border border-red-200
                                    bg-red-50
                                    p-5
                                    text-center
                                "
                            >
                                <p className="font-semibold text-red-700">
                                    Something went wrong
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    Unable to process your search right now.
                                </p>
                            </div>
                        )}


                    {searchType !== "ask" &&
                        productQuery.isError && (
                            <div
                                className="
                                    mx-auto mt-8 max-w-xl
                                    rounded-2xl
                                    border border-red-200
                                    bg-red-50
                                    p-5
                                    text-center
                                "
                            >
                                <p className="font-semibold text-red-700">
                                    Something went wrong
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    Unable to find products right now.
                                </p>
                            </div>
                        )}


                    {/* Ask results */}

                    {searchType === "ask" &&
                        askQuery.isSuccess && (
                            <AskSearchResults
                                data={askQuery.data}
                            />
                        )}


                    {/* Rating results */}

                    {searchType === "rating" &&
                        selectedProducts.length === 1 && (
                            <RatingResults
                                data={selectedProducts[0]}
                            />
                        )}


                    {/* Compare results */}

                    {searchType === "compare" &&
                        selectedProducts.length >= 2 && (
                            <CompareResults
                                data={selectedProducts}
                            />
                        )}

                </div>

            </main>


             {/* INPUT AREA  */}

            <footer
                className="
                    relative z-50 shrink-0
                    
                    px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]
                    sm:px-5 sm:pt-4
                "
            >

                <div className="relative mx-auto w-full max-w-4xl">

                    {/* PRODUCT SUGGESTIONS */}

                    {searchType !== "ask" &&
                        productQuery.isSuccess &&
                        productQuery.data?.length > 0 &&
                        productInput && (

                            <div
                                className="
                                    absolute bottom-full left-0 right-0
                                    z-[9999]
                                    mb-2
                                "
                            >

                                <div
                                    className="
                                        max-h-72
                                        overflow-y-auto
                                        scrollbar-hide
                                        rounded-2xl
                                        border border-slate-200
                                        bg-white
                                        p-3
                                        shadow-2xl
                                    "
                                >

                                    <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                                        Select a product
                                    </p>

                                    <div className="space-y-2">

                                        {productQuery.data
                                            .slice(0, 6)
                                            .map((product) => {

                                                const selected =
                                                    selectedProducts.some(
                                                        (item) =>
                                                            item.id === product.id
                                                    );

                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        disabled={selected}
                                                        onClick={() =>
                                                            handleProductSelect(
                                                                product
                                                            )
                                                        }
                                                        className={`
                                                            flex w-full
                                                            items-center gap-3
                                                            rounded-xl
                                                            border
                                                            p-3
                                                            text-left
                                                            transition
                                                            ${
                                                                selected
                                                                    ? "cursor-not-allowed border-blue-200 bg-blue-50 opacity-60"
                                                                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                                                            }
                                                        `}
                                                    >

                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            className="
                                                                h-12 w-12
                                                                shrink-0
                                                                rounded-xl
                                                                border
                                                                border-slate-200
                                                                object-cover
                                                            "
                                                        />

                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                                {product.title}
                                                            </p>

                                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                {product.brand ||
                                                                    product.category}
                                                            </p>

                                                        </div>

                                                        <div className="shrink-0 text-right">

                                                            <p className="text-sm font-bold text-blue-600">
                                                                ₹
                                                                {(
                                                                    product.price *
                                                                    88
                                                                ).toFixed(0)}
                                                            </p>

                                                            <p className="text-xs text-yellow-500">
                                                                ★ {product.rating}
                                                            </p>

                                                        </div>

                                                    </button>
                                                );
                                            })}

                                    </div>

                                </div>

                            </div>
                        )}


                    {/* NO PRODUCTS */}

                    {searchType !== "ask" &&
                        productQuery.isSuccess &&
                        productQuery.data?.length === 0 &&
                        productInput && (

                            <div className="absolute bottom-full left-0 right-0 z-[9999] mb-2">

                                <div
                                    className="
                                        rounded-2xl
                                        border border-slate-200
                                        bg-white
                                        p-8
                                        text-center
                                        shadow-2xl
                                    "
                                >

                                    <p className="font-semibold text-slate-700">
                                        No products found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try another product name.
                                    </p>

                                </div>

                            </div>
                        )}


                    {/* INPUT */}

                    <AiSearchInput
                        selectedType={searchType}
                        onTypeChange={handleTypeChange}
                        onSearch={handleSearch}
                        loading={
                            askQuery.isLoading ||
                            productQuery.isLoading
                        }
                        input={productInput}
                        selectedProducts={selectedProducts}
                        onInputChange={handleProductInput}
                        onRemoveProduct={handleRemoveProduct}
                    />

                </div>


                <p className="mt-2 text-center text-[10px] font-medium text-slate-400">
                    Cartify Shopping Assistant
                </p>

            </footer>

        </div>
    </div>
);
};

export default AiShoppingModal;
