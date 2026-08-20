import API from "../api";
import { X } from "lucide-react";
import { useProductId } from "../hooks/queries/useProductId";
import { useNavigate } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext";


function productQuickView({ open, onClose, productId }) {
    const { data: product, isLoading, error } = useProductId(productId);
    const { refreshAuth } = useAuth();

    const navigate = useNavigate();
    if (!open) return null;




    if (isLoading) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                >
                    <div className="grid animate-pulse sm:grid-cols-[0.9fr_1.1fr]">

                        {/* LEFT */}
                        <div className="bg-slate-50 p-5">

                            {/* Product image */}
                            <div className="aspect-square rounded-2xl bg-slate-200" />

                            {/* Tags */}
                            <div className="mt-3 flex gap-2">
                                <div className="h-6 w-16 rounded-full bg-slate-200" />
                                <div className="h-6 w-20 rounded-full bg-slate-200" />
                                <div className="h-6 w-16 rounded-full bg-slate-200" />
                            </div>

                        </div>


                        {/* RIGHT */}
                        <div className="flex flex-col p-6 sm:p-7">

                            {/* Brand */}
                            <div className="h-3 w-20 rounded bg-slate-200" />

                            {/* Title */}
                            <div className="mt-3 space-y-2">
                                <div className="h-6 w-full rounded bg-slate-200" />
                                <div className="h-6 w-3/4 rounded bg-slate-200" />
                            </div>

                            {/* Rating */}
                            <div className="mt-4 flex gap-2">
                                <div className="h-7 w-16 rounded-lg bg-slate-200" />
                                <div className="h-7 w-24 rounded bg-slate-200" />
                            </div>

                            {/* Price */}
                            <div className="mt-5 flex items-center gap-3">
                                <div className="h-9 w-32 rounded bg-slate-200" />
                                <div className="h-6 w-20 rounded-full bg-slate-200" />
                            </div>

                            {/* Description */}
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full rounded bg-slate-200" />
                                <div className="h-3 w-full rounded bg-slate-200" />
                                <div className="h-3 w-4/5 rounded bg-slate-200" />
                            </div>

                            {/* Product highlights */}
                            <div className="mt-5 grid grid-cols-3 gap-2">

                                <div className="h-16 rounded-xl bg-slate-200" />
                                <div className="h-16 rounded-xl bg-slate-200" />
                                <div className="h-16 rounded-xl bg-slate-200" />

                            </div>

                            {/* Buttons */}
                            <div className="mt-auto flex gap-3 pt-6">
                                <div className="h-12 flex-1 rounded-xl bg-slate-200" />
                                <div className="h-12 flex-1 rounded-xl bg-slate-200" />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // add cart
    async function addtoCart(id) {

        if (!id) return;

        try {
            const res = await API.post(
                `/products/cart/${id}`);

            const { msg } = res.data;

            toast.success(msg || "Added to cart!", {
                autoClose: 5000
            });

            await refreshAuth();

        } catch (error) {

            if (error.response?.status === 401) {
                toast.error(error.response.data.msg, {
                    autoClose: 5000
                });

                navigate("/login");
                return;
            }

            toast.error("Something went wrong", {
                autoClose: 5000
            });;
        }
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-blue-950/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                >
                    <X size={18} />
                </button>

                <div className="grid sm:grid-cols-[0.9fr_1.1fr]">

                    {/* LEFT — Product image */}
                    <div className="bg-slate-50 p-5">

                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white">
                            <img
                                src={product?.thumbnail}
                                alt={product?.title}
                                className="animate-[0.5s_ease-in-out] h-full w-full object-contain p-7 transition duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Important tags */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {product?.brand && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                                    {product.brand}
                                </span>
                            )}

                            {product?.category && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                    {product.category}
                                </span>
                            )}

                            {product?.stock > 0 && (
                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600">
                                    In stock
                                </span>
                            )}
                        </div>

                    </div>

                    {/* RIGHT — Product details */}
                    <div className="flex flex-col p-6 sm:p-7">

                        {/* Category */}
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                            {product?.brand || "Cartify"}
                        </p>

                        {/* Title */}
                        <h2 className="mt-2 line-clamp-2 pr-8 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                            {product?.title}
                        </h2>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1">
                                <span className="text-sm">★</span>
                                <span className="text-sm font-black text-slate-800">
                                    {product?.rating?.toFixed(1)}
                                </span>
                            </div>

                            <span className="text-xs text-slate-400">
                                132 reviews
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-5 flex items-end gap-3">
                            <span className="text-3xl font-black text-slate-900">
                                ₹{(product?.price * 80).toLocaleString("en-IN")}
                            </span>

                            <span className="animate-[popIn_0.4s_ease-in-out] mb-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                                {product?.discountPercentage?.toFixed(0)}% OFF
                            </span>
                        </div>

                        {/* Short description */}
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                            {product?.description}
                        </p>

                        {/* Product highlights */}
                        <div className="mt-5 grid grid-cols-3 gap-2">

                            <div className="rounded-xl bg-slate-50 p-3 text-center">
                                <Truck className="mx-auto h-4 w-4 text-blue-500" />

                                <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-slate-500">
                                    {product?.shippingInformation || "Fast delivery"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 text-center">
                                <RotateCcw className="mx-auto h-4 w-4 text-green-500" />

                                <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-slate-500">
                                    {product?.returnPolicy || "Easy returns"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 text-center">
                                <ShieldCheck className="mx-auto h-4 w-4 text-yellow-500" />

                                <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-slate-500">
                                    {product?.warrantyInformation || "Warranty"}
                                </p>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="mt-auto flex gap-3 pt-6">

                            <button
                                onClick={() => { addtoCart(product?.id) }}
                                className="shine flex-1 rounded-xl bg-blue-500 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-blue-600 active:scale-[0.98]"
                            >
                                Add to Cart
                            </button>



                            <button
                                onClick={() =>
                                    navigate(`/search/${product?.title}/${product?.id}`)
                                }
                                className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98]"
                            >
                                View More
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default productQuickView;
