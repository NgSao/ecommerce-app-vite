const FilterBar = ({ showFilters, setShowFilters, sortBy, setSortBy, viewMode, setViewMode }) => {
    const sortOptions = [
        { label: "Mặc định", value: "default" },
        { label: "Giá tăng dần", value: "price-asc" },
        { label: "Giá giảm dần", value: "price-desc" },
        { label: "Tên A-Z", value: "name-asc" },
        { label: "Tên Z-A", value: "name-desc" },
    ];

    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <button
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setShowFilters(!showFilters)}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-17 4h18m-14 4h10m-6 4h2" />
                </svg>
                Lọc
            </button>
            <div className="flex items-center">
                <span className="mr-2 text-gray-600">Sắp xếp:</span>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-600"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {viewMode === "grid" ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zm-12 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
                    )}
                </svg>
            </button>
        </div>
    );
};
export default FilterBar;