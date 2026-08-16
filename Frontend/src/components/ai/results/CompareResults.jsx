import {
    Check,
    Package,
    ShieldCheck,
    Star,
    Truck,
} from "lucide-react";

const CompareResults = ({ data }) => {
    // Support either:
    // data = [...]
    // or data = { products: [...] }
    const products = Array.isArray(data) ? data : data?.products || [];

    if (!products.length) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-slate-700">
                    No products to compare
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Select products to compare.
                </p>
            </div>
        );
    }

    const formatPrice = (price) => {
        return `₹${(price * 88).toFixed(0)}`;
    };

    const getRatingWidth = (rating) => {
        return `${(rating / 5) * 100}%`;
    };

    return (
        <div className="w-full space-y-5">

                {/* ASSISTANT MESSAGE */}
            

            <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check size={15} />
                </div>

                <div className="max-w-[85%]">

                    <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">

                        <p className="text-sm leading-6 text-slate-700">
                            Here's a comparison of{" "}
                            <span className="font-semibold text-slate-900">
                                {products.length} products
                            </span>
                            .
                        </p>

                    </div>

                    <p className="ml-1 mt-1.5 text-[10px] text-white">
                        Cartify Assistant
                    </p>

                </div>

            </div>


                {/* // // COMPARISON */}
            

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Desktop / Mobile horizontal scroll */}

                <div className="overflow-x-auto scrollbar-hide">

                    <div
                        className="grid min-w-[900px]"
                        style={{
                            gridTemplateColumns: `180px repeat(${products.length}, minmax(240px, 1fr))`,
                        }}
                    >

                            {/* PRODUCT HEADER */}

                        <div className="border-b border-r border-slate-200 bg-slate-50 p-4">
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Product
                            </span>
                        </div>

                        {products.map((product) => (

                            <div
                                key={product.id}
                                className="border-b border-slate-200 p-4"
                            >

                                <div className="flex flex-col items-center text-center">

                                    {/* Image */}

                                    <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-50 p-4">

                                        <img
                                            src={
                                                product.images?.[0] ||
                                                product.thumbnail
                                            }
                                            alt={product.title}
                                            className="h-full w-full object-contain"
                                            loading="lazy"
                                        />

                                    </div>

                                    {/* Brand */}

                                    {product.brand && (
                                        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            {product.brand}
                                        </p>
                                    )}

                                    {/* Title */}

                                    <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">
                                        {product.title}
                                    </h3>

                                    {/* Price */}

                                    <p className="mt-2 text-xl font-black text-blue-600">
                                        {formatPrice(product.price)}
                                    </p>

                                    {/* Discount */}

                                    {product.discountPercentage > 0 && (
                                        <span className="mt-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
                                            {product.discountPercentage.toFixed(
                                                0
                                            )}
                                            % OFF
                                        </span>
                                    )}

                                </div>

                            </div>

                        ))}


                            {/* RATING */}

                        <ComparisonLabel label="Rating" />

                        {products.map((product) => (

                            <div
                                key={`rating-${product.id}`}
                                className="border-b border-slate-200 p-4"
                            >

                                <div className="flex items-center justify-center gap-2">

                                    <div className="relative text-lg tracking-tight">

                                        <div className="text-slate-200">
                                            ★★★★★
                                        </div>

                                        <div
                                            className="absolute left-0 top-0 overflow-hidden text-yellow-400"
                                            style={{
                                                width: getRatingWidth(
                                                    product.rating
                                                ),
                                            }}
                                        >
                                            ★★★★★
                                        </div>

                                    </div>

                                    <span className="text-sm font-bold text-slate-800">
                                        {product.rating}
                                    </span>

                                </div>

                                <p className="mt-1 text-center text-[11px] text-slate-400">
                                    out of 5
                                </p>

                            </div>

                        ))}


                            {/* CATEGORY */}

                        <ComparisonLabel label="Category" />

                        {products.map((product) => (
                            <ComparisonValue
                                key={`category-${product.id}`}
                                value={product.category}
                            />
                        ))}


                            {/* STOCK */}

                        <ComparisonLabel label="Stock" />

                        {products.map((product) => (

                            <div
                                key={`stock-${product.id}`}
                                className="border-b border-slate-200 p-4 text-center"
                            >

                                <span
                                    className={`
                                        inline-flex items-center gap-1.5
                                        rounded-full px-2.5 py-1
                                        text-xs font-semibold
                                        ${
                                            product.stock > 0
                                                ? "bg-green-50 text-green-600"
                                                : "bg-red-50 text-red-600"
                                        }
                                    `}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />

                                    {product.stock > 0
                                        ? `${product.stock} available`
                                        : "Out of stock"}
                                </span>

                            </div>

                        ))}


                            {/* DESCRIPTION */}

                        <ComparisonLabel label="Description" />

                        {products.map((product) => (

                            <div
                                key={`description-${product.id}`}
                                className="border-b border-slate-200 p-4"
                            >

                                <p className="line-clamp-4 text-xs leading-5 text-slate-500">
                                    {product.description}
                                </p>

                            </div>

                        ))}


                            {/* FEATURES / TAGS */}

                        <ComparisonLabel label="Features" />

                        {products.map((product) => (

                            <div
                                key={`tags-${product.id}`}
                                className="border-b border-slate-200 p-4"
                            >

                                <div className="flex flex-wrap justify-center gap-1.5">

                                    {(product.tags || []).map((tag) => (

                                        <span
                                            key={tag}
                                            className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-blue-600"
                                        >
                                            {tag}
                                        </span>

                                    ))}

                                </div>

                            </div>

                        ))}


                            {/* WARRANTY */}

                        <ComparisonLabel
                            label="Warranty"
                            icon={<ShieldCheck size={14} />}
                        />

                        {products.map((product) => (
                            <ComparisonValue
                                key={`warranty-${product.id}`}
                                value={product.warrantyInformation}
                            />
                        ))}


                            {/* // SHIPPING */}

                        <ComparisonLabel
                            label="Shipping"
                            icon={<Truck size={14} />}
                        />

                        {products.map((product) => (
                            <ComparisonValue
                                key={`shipping-${product.id}`}
                                value={product.shippingInformation}
                            />
                        ))}


                       
                            {/* RETURN POLICY */}

                        <ComparisonLabel
                            label="Returns"
                            icon={<Package size={14} />}
                        />

                        {products.map((product) => (
                            <ComparisonValue
                                key={`return-${product.id}`}
                                value={product.returnPolicy}
                            />
                        ))}


                            {/* MIN ORDER */}

                        <ComparisonLabel label="Min. Order" />

                        {products.map((product) => (
                            <ComparisonValue
                                key={`minimum-${product.id}`}
                                value={`${product.minimumOrderQuantity} units`}
                            />
                        ))}

                    </div>

                </div>

            </div>


                {/* // // MOBILE SCROLL HINT */}
            

            <p className="text-center text-[11px] text-slate-400 lg:hidden">
                ← Swipe horizontally to compare all products →
            </p>

        </div>
    );
};


//    SMALL COMPONENTS

const ComparisonLabel = ({ label, icon }) => {
    return (
        <div className="flex items-center gap-2 border-b border-r border-slate-200 bg-slate-50 p-4">

            {icon && (
                <span className="text-slate-400">
                    {icon}
                </span>
            )}

            <span className="text-xs font-bold text-slate-600">
                {label}
            </span>

        </div>
    );
};


const ComparisonValue = ({ value }) => {
    return (
        <div className="flex min-h-[56px] items-center justify-center border-b border-slate-200 p-4 text-center">

            <span className="text-xs font-medium capitalize leading-5 text-slate-600">
                {value || "—"}
            </span>

        </div>
    );
};


export default CompareResults;