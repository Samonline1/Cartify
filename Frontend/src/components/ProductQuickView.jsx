import { X } from "lucide-react";
import { useProductId } from "../hooks/queries/useProductId";
import { useNavigate } from "react-router-dom";

function productQuickView({ open, onClose, productId }) {
    const { data: product, isLoading, error } = useProductId(productId);

    const navigate = useNavigate();
    if (!open) return null;

    if (isLoading) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-4xl rounded-3xl bg-white p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 animate-pulse">
                        {/* Image */}

                        <div className="h-80 rounded-2xl bg-slate-200 lg:h-[420px]" />

                        {/* Details */}

                        <div className="space-y-4">
                            <div className="h-8 w-3/4 rounded bg-slate-200" />

                            <div className="h-5 w-32 rounded bg-slate-200" />

                            <div className="h-10 w-40 rounded bg-slate-200" />

                            <div className="flex gap-2">
                                <div className="h-8 w-20 rounded-full bg-slate-200" />
                                <div className="h-8 w-24 rounded-full bg-slate-200" />
                                <div className="h-8 w-28 rounded-full bg-slate-200" />
                            </div>

                            <div className="space-y-2">
                                <div className="h-4 rounded bg-slate-200" />
                                <div className="h-4 rounded bg-slate-200" />
                                <div className="h-4 w-5/6 rounded bg-slate-200" />
                            </div>

                            <div className="h-12 rounded-xl bg-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl"
            >
                {/* Close */}

                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 transition hover:bg-red-100"
                >
                    <X size={18} />
                </button>

                <div className="grid grid-cols-2 gap-10 p-8">
                    {/* LEFT */}

                    <div>
                        <div className="sticky top-0 flex items-center justify-center rounded-3xl bg-slate-50 p-8">
                            <img
                                src={product?.thumbnail}
                                alt={product?.title}
                                className="max-h-96 object-contain transition duration-300 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* RIGHT */}

                    <div>
                        <h2 className="text-3xl font-bold">{product?.title}</h2>

                        <div className="mt-3 flex items-center gap-2">
                            ⭐ {product?.rating}
                            <span className="text-gray-500">(132 Reviews)</span>
                        </div>

                        <div className="mt-5">
                            <p className="text-4xl font-bold text-blue-600">
                                ₹{(product?.price * 95).toLocaleString("en-IN")}
                            </p>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                {product?.discountPercentage.toFixed(0)}% OFF
                            </span>
                        </div>

                        {/* Buy Score */}

                        <div className="mt-8">Buy Score Component</div>

                        {/* product? Details */}

                        <div className="flex flex-wrap gap-2 mt-5">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                                {product?.brand}
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                                {product?.category}
                            </span>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                                {product?.stock} in stock
                            </span>
                        </div>

                        {/* Tags */}

                        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <div className="rounded-xl border p-3 text-center text-sm">
                                🚚
                                <p>{product?.shippingInformation}</p>
                            </div>

                            <div className="rounded-xl border p-3 text-center text-sm">
                                🔄
                                <p>{product?.returnPolicy}</p>
                            </div>

                            <div className="rounded-xl border p-3 text-center text-sm">
                                🛡
                                <p>{product?.warrantyInformation}</p>
                            </div>
                        </div>

                        {/* Description */}

                        <p className="mt-8 text-gray-600">{product?.description}</p>

                        <button
                            onClick={() => navigate(`/search/${product?.title}/${product?.id}`)}

                            className="mt-10 w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700">
                            View More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default productQuickView;
