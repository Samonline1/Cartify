import { Star, MessageCircle, PackageCheck } from "lucide-react";

const RatingResults = ({ data }) => {
    if (!data) return null;

    const reviews = data?.reviews || [];

    const rating = Number(data?.rating || 0);

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="w-full space-y-4">

                {/* ASSISTANT MESSAGE */}


            <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <MessageCircle size={15} />
                </div>

                <div className="max-w-[85%]">

                    <div className="rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">

                        <p className="text-sm leading-6 text-slate-700">
                            Here's the rating and customer feedback for{" "}
                            <span className="font-semibold text-slate-900">
                                {data.title}
                            </span>
                            .
                        </p>

                    </div>

                    <p className="ml-1 mt-1.5 text-[10px] text-white">
                        Cartify Assistant
                    </p>

                </div>

            </div>


                {/* PRODUCT RATING SUMMARY */}


            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">

                    {/* Product */}

                    <div className="flex min-w-0 flex-1 items-center gap-4">

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-3">

                            <img
                                src={
                                    data.images?.[0] ||
                                    data.thumbnail
                                }
                                alt={data.title}
                                className="h-full w-full object-contain"
                                loading="lazy"
                            />

                        </div>

                        <div className="min-w-0">

                            {data.brand && (
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {data.brand}
                                </p>
                            )}

                            <h2 className="mt-1 truncate text-base font-bold text-slate-900">
                                {data.title}
                            </h2>

                            <p className="mt-1 text-sm font-black text-blue-600">
                                ₹{(data.price * 88).toFixed(0)}
                            </p>

                        </div>

                    </div>


                    {/* Rating */}

                    <div className="rounded-xl bg-slate-50 px-5 py-4 text-center">

                        <p className="text-3xl font-black text-slate-900">
                            {rating.toFixed(1)}
                            <span className="text-sm font-medium text-slate-400">
                                /5
                            </span>
                        </p>

                        <div className="mt-1 flex justify-center gap-0.5">

                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={16}
                                    fill={
                                        star <= Math.round(rating)
                                            ? "currentColor"
                                            : "none"
                                    }
                                    className={
                                        star <= Math.round(rating)
                                            ? "text-yellow-400"
                                            : "text-slate-300"
                                    }
                                />
                            ))}

                        </div>

                        <p className="mt-1 text-[11px] text-slate-400">
                            Overall rating
                        </p>

                    </div>

                </div>


                {/* Product status */}

                <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-3">

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-semibold text-green-600">
                        <PackageCheck size={13} />
                        {data.availabilityStatus}
                    </span>

                    {data.stock > 0 && (
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600">
                            {data.stock} in stock
                        </span>
                    )}

                    {data.returnPolicy && (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                            {data.returnPolicy}
                        </span>
                    )}

                </div>

            </div>


                {/* REVIEWS */}


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Customer reviews
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                            {reviews.length} review
                            {reviews.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                </div>


                {reviews.length === 0 ? (

                    <div className="py-8 text-center">

                        <p className="text-sm font-semibold text-slate-600">
                            No reviews yet
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            There are no customer reviews for this product.
                        </p>

                    </div>

                ) : (

                    <div className="mt-4 space-y-3">

                        {reviews.map((review, index) => (

                            <div
                                key={index}
                                className="
                                    rounded-xl
                                    border border-slate-100
                                    bg-slate-50/70
                                    p-4
                                    transition
                                    hover:border-slate-200
                                "
                            >

                                {/* Reviewer */}

                                <div className="flex items-start justify-between gap-3">

                                    <div className="flex min-w-0 items-center gap-3">

                                        {/* Avatar */}

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                            {review.reviewerName
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {review.reviewerName}
                                            </p>

                                            <p className="truncate text-[11px] text-slate-400">
  {review.reviewerEmail
    ? `${review.reviewerEmail.split("@")[0]}@cartify.com`
    : "customer@cartify.com"}
</p>

                                            <p className="text-[11px] text-slate-400">
                                                Verified customer
                                            </p>

                                        </div>

                                    </div>


                                    {/* Rating */}

                                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-50 px-2 py-1">

                                        <Star
                                            size={12}
                                            fill="currentColor"
                                            className="text-yellow-400"
                                        />

                                        <span className="text-xs font-bold text-slate-700">
                                            {review.rating}
                                        </span>

                                    </div>

                                </div>


                                {/* Review */}

                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {review.comment}
                                </p>


                                {/* Date */}

                                {review.date && (
                                    <p className="mt-2 text-[10px] text-slate-400">
                                        {new Date(
                                            review.date
                                        ).toLocaleDateString()}
                                    </p>
                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default RatingResults;