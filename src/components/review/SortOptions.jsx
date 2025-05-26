import React from "react";
const SortOptions = ({ sortOption, setSortOption }) => (
    <div className="flex flex-row items-center py-2.5 sm:py-3 border-b border-gray-200 mb-3.5 sm:mb-4">
        <p className="text-gray-600 mr-2.5 sm:mr-3 text-sm sm:text-base">Sắp xếp theo:</p>
        <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${sortOption === "newest" ? "bg-gray-300" : "bg-gray-100"
                } mr-2 text-sm sm:text-base`}
            onClick={() => setSortOption("newest")}
        >
            Mới nhất
        </button>
        <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${sortOption === "highest" ? "bg-gray-300" : "bg-gray-100"
                } text-sm sm:text-base`}
            onClick={() => setSortOption("highest")}
        >
            Đánh giá cao nhất
        </button>
    </div>
);
export default SortOptions;