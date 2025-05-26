const ColorSelection = ({
    availableColors,
    selectedColor,
    handleColorSelect,
    isVariantInStock,
    selectedStorage,
}) => {
    if (selectedColor === null) return null;
    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-4">Màu sắc</h3>
            <div className="flex flex-row flex-wrap gap-2.5 sm:gap-3">
                {availableColors.map((color) => (
                    <div
                        key={color}
                        className={`border border-gray-300 rounded-lg p-2 sm:p-2.5 md:p-3 md:px-5 mr-2.5 sm:mr-3 mb-2.5 sm:mb-3 relative ${selectedColor === color
                            ? "border-red-600 bg-red-50"
                            : !isVariantInStock(color, selectedStorage)
                                ? "border-gray-300 bg-gray-100"
                                : ""
                            }`}
                        onClick={() => handleColorSelect(color)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === "Enter" && handleColorSelect(color)}
                    >
                        <p
                            className={`${selectedColor === color
                                ? "text-red-600 font-bold"
                                : !isVariantInStock(color, selectedStorage)
                                    ? "text-gray-600"
                                    : "text-gray-800"
                                }`}
                        >
                            {color}
                        </p>
                        {!isVariantInStock(color, selectedStorage) && (
                            <p className="absolute bottom-[-6px] left-0 right-0 bg-gray-100 text-gray-600 text-xs text-center py-0.5">
                                Hết hàng
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorSelection;