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
                flex items-center justify-center
                bg-slate-950/60
                p-3
                backdrop-blur-md
                sm:p-6
            "
        >

            {/* MODAL */}

            <div
                className="
                    flex
                    h-full
                    w-full
                    max-w-6xl
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/20
                    bg-slate-50
                    shadow-2xl

                    animate-[fadeIn_.25s_ease-out]

                    sm:h-[92vh]
                "
                onClick={(e) => e.stopPropagation()}
            >


                {/* HEADER */}

                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        bg-white/95
                        px-5
                        py-4
                        backdrop-blur
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                            "
                        >
                            <Sparkles size={20} />
                        </div>

                        <div>

                            <h2 className="font-bold text-slate-900">
                                AI Shopping
                            </h2>

                            <p className="text-xs text-slate-500">
                                Find products using natural language
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            text-slate-500
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                        "
                        aria-label="Close AI Shopping"
                    >
                        <X size={18} />
                    </button>

                </header>


                    {/* RESULTS */}

                <main
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-6
                    "
                >

                    {/* INITIAL STATE */}

                    {searchType === "ask" &&
                        !submittedQuery && (
                            <div className="flex h-full items-center justify-center">

                                <div className="max-w-lg text-center">

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-blue-100
                                            text-blue-600
                                        "
                                    >
                                        <Sparkles size={30} />
                                    </div>

                                    <h1
                                        className="
                                            mt-5
                                            text-2xl
                                            font-black
                                            text-slate-900
                                        "
                                    >
                                        What are you looking for?
                                    </h1>

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        Try something like:
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        "gaming phone under ₹20,000"
                                    </p>

                                </div>

                            </div>
                        )}

                    {/* RATING INITIAL */}

                    {searchType === "rating" &&
                        selectedProducts.length === 0 &&
                        !productInput && (
                            <div className="flex h-full items-center justify-center">

                                <div className="text-center">

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-yellow-100
                                            text-yellow-600
                                        "
                                    >
                                        ⭐
                                    </div>

                                    <h1 className="mt-5 text-2xl font-black text-slate-900">
                                        Check a product
                                    </h1>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Search for a product and select it
                                        to see its rating.
                                    </p>

                                </div>

                            </div>
                        )}

                    {/* COMPARE INITIAL */}

                    {searchType === "compare" &&
                        selectedProducts.length === 0 &&
                        !productInput && (
                            <div className="flex h-full items-center justify-center">

                                <div className="text-center">

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-purple-100
                                            text-purple-600
                                        "
                                    >
                                        ⚖️
                                    </div>

                                    <h1 className="mt-5 text-2xl font-black text-slate-900">
                                        Compare products
                                    </h1>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Select up to 3 products to compare.
                                    </p>

                                </div>

                            </div>
                        )}

                    {/* ASK LOADING */}

                    {searchType === "ask" &&
                        askQuery.isLoading && (
                            <AiLoading />
                        )}

                    {/* PRODUCT SEARCH LOADING */}

                    {searchType !== "ask" &&
                        isProductSearching && (
                            <AiLoading />
                        )}

                    {/* ASK ERROR */}

                    {searchType === "ask" &&
                        askQuery.isError && (
                            <div
                                className="
                                    mx-auto
                                    max-w-xl
                                    rounded-2xl
                                    border
                                    border-red-200
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

                    {/* PRODUCT SEARCH ERROR */}

                    {searchType !== "ask" &&
                        productQuery.isError && (
                            <div
                                className="
                                    mx-auto
                                    max-w-xl
                                    rounded-2xl
                                    border
                                    border-red-200
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

    
                        {/* ASK RESULTS */}

                    {searchType === "ask" &&
                        askQuery.isSuccess && (
                            <AskSearchResults
                                data={askQuery.data}
                            />
                        )}

    
                        {/* RATING RESULTS */}

                    {searchType === "rating" &&
                        selectedProducts.length === 1 && (
                            <RatingResults
                                data={selectedProducts[0]}
                            />
                        )}

    
                        {/* COMPARE RESULTS */}

                    {searchType === "compare" &&
                        selectedProducts.length >= 2 && (
                            <CompareResults
                                data={selectedProducts}
                            />
                        )}



                </main>


                {/* INPUT FOOTER */}

                <footer
                    className="
                        relative
                        z-50
                        shrink-0
                        border-t
                        border-slate-200
                        bg-white/95
                        p-3
                        backdrop-blur
                        sm:p-5
                    "
                >

                    <div className="relative mx-auto w-full max-w-4xl">

        
                            {/* PRODUCT SUGGESTIONS */}

                        {searchType !== "ask" &&
                            productQuery.isSuccess &&
                            productQuery.data?.length > 0 &&
                            productInput && (
                                <div className="absolute bottom-full left-0 right-0 z-[9999] mb-2">

                                    <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">

                                        <p className="mb-3 text-sm font-semibold text-slate-500">
                                            Select a product
                                        </p>

                                        <div className="space-y-2">

                                            {productQuery.data
                                                .slice(0, 6)
                                                .map((product) => {

                                                    const selected =
                                                        selectedProducts.some(
                                                            (item) =>
                                                                item.id ===
                                                                product.id
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
                                                            className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition ${
                                                                selected
                                                                    ? "cursor-not-allowed border-blue-200 bg-blue-50 opacity-60"
                                                                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                                            }`}
                                                        >

                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.title}
                                                                className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover"
                                                            />

                                                            <div className="min-w-0 flex-1">

                                                                <p className="truncate font-semibold text-slate-800">
                                                                    {product.title}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {product.brand || product.category}
                                                                </p>

                                                            </div>

                                                            <div className="text-right">

                                                                <p className="font-bold text-blue-600">
                                                                    ₹
                                                                    {(
                                                                        product.price *
                                                                        88
                                                                    ).toFixed(0)}
                                                                </p>

                                                                <p className="text-xs text-yellow-500">
                                                                    ⭐ {product.rating}
                                                                </p>

                                                            </div>

                                                        </button>
                                                    );
                                                })}

                                        </div>

                                    </div>

                                </div>
                            )}

                        {/* NO PRODUCT */}

                        {searchType !== "ask" &&
                            productQuery.isSuccess &&
                            productQuery.data?.length === 0 &&
                            productInput && (
                                <div className="absolute bottom-full left-0 right-0 z-[9999] mb-2">

                                    <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-10 shadow-2xl">

                                        <div className="text-center">

                                            <p className="font-semibold text-slate-700">
                                                No products found
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Try another product name.
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}

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

                    <p className="mt-2 text-center text-[11px] text-slate-400">
                        Cartify Shopping Assistant
                    </p>

                </footer>

            </div>

        </div>
    );
};

export default AiShoppingModal;
