const OverallRating = ({ reviewStats, renderRatingStars, calculateRatingPercentage }) => (
    <div className="flex flex-row py-3.5 sm:py-4 border-b border-gray-200 mb-3.5 sm:mb-4">
        <div className="flex flex-col items-center w-[30%] border-r border-gray-200 pr-2.5 sm:pr-3">
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{reviewStats.average.toFixed(1)}</p>
            <div className="flex flex-row my-1.25 sm:my-2">
                {renderRatingStars(Math.round(reviewStats?.average || 0))}
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">{reviewStats.total} đánh giá</p>
        </div>
        <div className="flex-1 pl-3.5 sm:pl-4">
            {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex flex-row items-center mb-1.25 sm:mb-2">
                    <p className="w-10 text-xs sm:text-sm text-gray-600">{rating} sao</p>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full mx-1.25 sm:mx-2 overflow-hidden">
                        <div
                            className="h-2 bg-yellow-400 rounded-full"
                            style={{ width: `${calculateRatingPercentage(rating)}%` }}
                        />
                    </div>
                    <p className="w-8 text-xs sm:text-sm text-gray-600 text-right">
                        {reviewStats.distribution[rating]}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

export default OverallRating;