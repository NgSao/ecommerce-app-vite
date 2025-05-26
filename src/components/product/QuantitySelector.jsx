import { IoAdd, IoRemove } from "react-icons/io5";

const QuantitySelector = ({
    quantity,
    incrementQuantity,
    decrementQuantity,
    selectedVariant,
    product,
}) => {
    const isIncrementDisabled = selectedVariant
        ? quantity >= selectedVariant.stock
        : !product || quantity >= (product.stock || 0);

    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-2.5 sm:mb-4">Số lượng</h3>
            <div className="flex flex-row items-center">
                <button
                    className={`border w-9 h-9 flex items-center justify-center rounded-lg ${quantity <= 1
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                            : "border-gray-300"
                        }`}
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                >
                    <IoRemove
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${quantity <= 1 ? "text-gray-400" : "text-gray-700"}`}
                    />
                </button>
                <p className="px-4 sm:px-5 text-base sm:text-lg">{quantity}</p>
                <button
                    className={`border w-9 h-9 flex items-center justify-center rounded-lg ${isIncrementDisabled
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                            : "border-gray-300"
                        }`}
                    onClick={incrementQuantity}
                    disabled={isIncrementDisabled}
                >
                    <IoAdd
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${isIncrementDisabled ? "text-gray-400" : "text-gray-700"}`}
                    />
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector;