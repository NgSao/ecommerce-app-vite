import { IoHeart, IoHeartOutline } from "react-icons/io5";

const ActionBar = ({
    handleAddToWishlist,
    isInWishlist,
    handleAddToCart,
    handleBuyNow,
    selectedVariant,
    product,
}) => {
    const isOutOfStock = selectedVariant
        ? selectedVariant.stock <= 0
        : !product || product.stock <= 0;

    return (
        <div className="  bg-white flex flex-row p-2.5 sm:p-3 border-t border-gray-200 my-5">
            <button
                className="w-[50px] h-[50px] flex items-center justify-center border border-gray-300 rounded-lg"
                onClick={handleAddToWishlist}
            >
                {isInWishlist(selectedVariant ? selectedVariant.id : product?.id) ? (
                    <IoHeart className="text-red-600 w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                    <IoHeartOutline className="text-gray-700 w-6 h-6 sm:w-7 sm:h-7" />
                )}
            </button>
            <button
                className={`flex-1 h-[50px] flex items-center justify-center rounded-lg mx-2.5 sm:mx-3 border ${isOutOfStock
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "bg-red-50 border-red-600"
                    }`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
            >
                <p
                    className={`font-bold text-sm sm:text-base ${isOutOfStock ? "text-gray-600" : "text-red-600"
                        }`}
                >
                    Thêm vào giỏ hàng
                </p>
            </button>
            <button
                className={`flex-1 h-[50px] flex items-center justify-center rounded-lg ${isOutOfStock
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "bg-red-600"
                    }`}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
            >
                <p
                    className={`font-bold text-sm sm:text-base ${isOutOfStock ? "text-gray-600" : "text-white"
                        }`}
                >
                    Mua ngay
                </p>
            </button>
        </div>
    );
};

export default ActionBar;