const FiltersContainer = ({
    showFilters,
    setShowFilters,
    setPriceRange,
    selectedPriceRange,
    setSelectedPriceRange,
    selectedBrands,
    setSelectedBrands,
    selectedCategories,
    setSelectedCategories,
    categories,
    brands,
}) => {
    if (!showFilters) return null;

    const priceRanges = [
        { label: "Dưới 5 triệu", value: "under5", range: { min: 0, max: 5000000 } },
        { label: "5 - 10 triệu", value: "5to10", range: { min: 5000000, max: 10000000 } },
        { label: "10 - 20 triệu", value: "10to20", range: { min: 10000000, max: 20000000 } },
        { label: "Trên 20 triệu", value: "above20", range: { min: 20000000, max: 50000000 } },
    ];

    return (
        <div className="bg-white p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold mb-4">Danh mục</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`px-4 py-2 border rounded-md ${selectedCategories.includes(category.name)
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                        onClick={() =>
                            setSelectedCategories((prev) =>
                                prev.includes(category.name)
                                    ? prev.filter((c) => c !== category.name)
                                    : [...prev, category.name]
                            )
                        }
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            <h3 className="text-lg font-bold mb-4">Thương hiệu</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {brands.map((brand) => (
                    <button
                        key={brand.id}
                        className={`px-4 py-2 border rounded-md ${selectedBrands.includes(brand.name) ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        onClick={() =>
                            setSelectedBrands((prev) =>
                                prev.includes(brand.name)
                                    ? prev.filter((b) => b !== brand.name)
                                    : [...prev, brand.name]
                            )
                        }
                    >
                        {brand.name}
                    </button>
                ))}
            </div>
            <h3 className="text-lg font-bold mb-4">Khoảng giá</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {priceRanges.map((range) => (
                    <button
                        key={range.value}
                        className={`px-4 py-2 border rounded-md ${selectedPriceRange === range.value ? "border-red-500 bg-red-50" : "border-gray-300"
                            }`}
                        onClick={() => {
                            if (selectedPriceRange === range.value) {
                                setSelectedPriceRange(null);
                                setPriceRange({ min: 0, max: 50000000 });
                            } else {
                                setSelectedPriceRange(range.value);
                                setPriceRange(range.range);
                            }
                        }}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
            <button
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                onClick={() => setShowFilters(false)}
            >
                Áp dụng
            </button>
        </div>
    );
};

export default FiltersContainer;