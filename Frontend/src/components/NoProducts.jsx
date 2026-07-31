import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NoProducts = ({
    title = "No products found",
    description = "We couldn't find any products matching your search or category.",
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[380px] items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-sm">

                {/* Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-blue-700">
                        <FiSearch className="text-2xl" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="mt-6 text-2xl font-black text-slate-900">
                    {title}
                </h2>

                {/* Description */}
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    {description}
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                    <button
                        onClick={() => navigate("/")}
                        className="rounded-xl bg-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-bold text-blue-600 transition hover:bg-blue-50"
                    >
                        Go Back
                    </button>

                </div>

            </div>
        </div>
    );
};

export default NoProducts;