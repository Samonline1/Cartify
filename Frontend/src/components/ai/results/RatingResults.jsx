const RatingResults = ({ data }) => {
    const reviews = data?.reviews || [];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
                Rating Results
            </h2>

            <div className="mt-4 space-y-4">
                {reviews.map((review, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-slate-200 p-4"
                    >
                        {/* Reviewer */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900">
                                    {review.reviewerName}
                                </p>

                                <p className="text-sm text-slate-500">
                                    {review.reviewerEmail}
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="font-semibold text-slate-900">
                                    {review.rating}/5
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        <p className="mt-3 text-sm text-slate-700">
                            {review.comment}
                        </p>

                        {/* Date */}
                        <p className="mt-2 text-xs text-slate-400">
                            {new Date(review.date).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingResults;