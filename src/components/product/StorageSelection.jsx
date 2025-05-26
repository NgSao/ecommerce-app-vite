const StorageSelection = ({
    availableStorageOptions,
    selectedStorage,
    handleStorageSelect,
    isVariantInStock,
    selectedColor,
}) => {
    if (selectedStorage === null) return null;
    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-4">Dung lượng</h3>
            <div className="flex flex-row flex-wrap gap-2.5 sm:gap-3">
                {availableStorageOptions.map((storage) => (
                    <div
                        key={storage}
                        className={`border  border-gray-300 rounded-lg p-2 sm:p-2.5 md:p-3 md:px-5 mr-2.5 sm:mr-3 mb-2.5 sm:mb-3 relative ${selectedStorage === storage
                            ? "border-red-600 bg-red-50"
                            : !isVariantInStock(selectedColor, storage)
                                ? "border-gray-300 bg-gray-100"
                                : ""
                            }`}
                        onClick={() => handleStorageSelect(storage)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === "Enter" && handleStorageSelect(storage)}
                    >
                        <p
                            className={`${selectedStorage === storage
                                ? "text-red-600 font-bold"
                                : !isVariantInStock(selectedColor, storage)
                                    ? "text-gray-600"
                                    : "text-gray-800"
                                }`}
                        >
                            {storage}
                        </p>
                        {!isVariantInStock(selectedColor, storage) && (
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

export default StorageSelection;