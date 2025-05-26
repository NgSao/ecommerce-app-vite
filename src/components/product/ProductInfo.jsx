import { formatPrice } from "@utils/formatUtils";
import { IoGiftOutline } from "react-icons/io5";

const ProductInfo = ({
    product,
    selectedVariant,
    renderRatingStars,
    getStockStatusText,
    getStockStatusColor,
}) => {
    const promotionsArray = product.promotions
        ? product.promotions
            .split(/\.\s*/)
            .map((p) => p.trim())
            .filter((p) => p)
        : [];

    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 rounded-lg shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-2.5 sm:mb-4">
                {product.name}
                {selectedVariant && selectedVariant.storage
                    ? ` - ${selectedVariant.color} ${selectedVariant.storage}`
                    : ""}
            </h2>
            <div className="flex items-center mb-2.5 sm:mb-4">
                {renderRatingStars(product.rating || 0)}
                <p className="ml-1.25 sm:ml-2 text-gray-600 text-sm sm:text-base">
                    ({product.ratingCount || 0} đánh giá)
                </p>
            </div>
            <div className="flex items-center mb-2.5 sm:mb-4">
                {selectedVariant ? (
                    <>
                        <p className="text-xl sm:text-2xl font-bold text-red-600 mr-2.5 sm:mr-4">
                            {formatPrice(
                                selectedVariant.price === 0
                                    ? selectedVariant.originalPrice
                                    : selectedVariant.price
                            )}
                        </p>
                        {selectedVariant.originalPrice > selectedVariant.price &&
                            selectedVariant.price !== 0 && (
                                <p className="text-base sm:text-lg text-gray-400 line-through">
                                    {formatPrice(selectedVariant.originalPrice)}
                                </p>
                            )}
                    </>
                ) : (
                    <>
                        <p className="text-xl sm:text-2xl font-bold text-red-600 mr-2.5 sm:mr-4">
                            {formatPrice(
                                product.price === 0 ? product.originalPrice : product.price
                            )}
                        </p>
                        {product.originalPrice > product.price && product.price !== 0 && (
                            <p className="text-base sm:text-lg text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                            </p>
                        )}
                    </>
                )}
            </div>
            <div className="mb-2.5 sm:mb-4">
                <p
                    className="text-sm sm:text-base font-medium"
                    style={{ color: getStockStatusColor() }}
                >
                    {getStockStatusText()}
                </p>
            </div>
            {/* {product.saleEndDate && (
                <div className="bg-red-600 rounded-lg p-2.5 sm:p-3 mt-1.25 sm:mt-2 mb-2.5 sm:mb-4">
                    <div className="flex items-center mb-1.25 sm:mb-2">
                        <IoFlash className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                        <h3 className="text-white font-bold text-base sm:text-lg ml-1.25 sm:ml-2">
                            FLASH SALE
                        </h3>
                    </div>
                    <CountdownTimer endDate={product.saleEndDate} />
                    {product.saleQuantity && (
                        <div className="h-5 sm:h-6 bg-white/30 rounded-lg mt-2.5 sm:mt-3 overflow-hidden relative">
                            <div
                                className="h-full bg-white absolute top-0 left-0"
                                style={{ width: `${(product.soldQuantity / product.saleQuantity) * 100}%` }}
                            />
                            <p className="absolute w-full text-center text-black font-bold text-xs sm:text-sm leading-5">
                                Đã bán {product.soldQuantity}/{product.saleQuantity}
                            </p>
                        </div>
                    )}
                </div>
            )} */}
            {product.promotions && promotionsArray.length > 0 && (
                <div className="mt-2.5 sm:mt-4">
                    {promotionsArray.map((promo, index) => (
                        <div key={index} className="flex items-center mb-1.25 sm:mb-2">
                            <IoGiftOutline className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 mr-1.25 sm:mr-2" />
                            <p className="text-gray-700 text-sm sm:text-base">{promo}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductInfo;