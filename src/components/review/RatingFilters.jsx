const RatingFilters = ({ ratingFilter, setRatingFilter, reviewStats }) => (
    <div className="flex flex-row flex-wrap mb-3.5 sm:mb-4 gap-2">
        <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${ratingFilter === 0 ? "bg-yellow-200" : "bg-gray-100"
                } mr-2 mb-2 text-sm sm:text-base`}
            onClick={() => setRatingFilter(0)}
        >
            Tất cả ({reviewStats.total})
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
            <button
                key={rating}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${ratingFilter === rating ? "bg-yellow-200" : "bg-gray-100"
                    } mr-2 mb-2 text-sm sm:text-base`}
                onClick={() => setRatingFilter(rating)}
            >
                {rating} ⭐ ({reviewStats.distribution[rating]})
            </button>
        ))}
    </div>
);

export default RatingFilters;