import { formatPrice } from "@utils/formatUtils";

function OrderSummarySection({
    calculateSubtotal,
    calculateShippingFee,
    calculatePromoDiscount,
    calculateTotal,
    appliedPromoCode,
    shippingProvider,
    ghtkDeliveryOption,
    routeDistance,
    handlePlaceOrder,
    loading
}) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Đơn vị vận chuyển</span>
                    <span className="font-medium">
                        {shippingProvider === 'GHTK'
                            ? `GHTK (${ghtkDeliveryOption === 'xteam' ? 'Nhanh' : 'Thường'})`
                            : 'GHN'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">
                        {calculateShippingFee === 0
                            ? 'Miễn phí'
                            : formatPrice(calculateShippingFee)}
                    </span>
                </div>
                {routeDistance && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Khoảng cách</span>
                        <span className="font-medium">{routeDistance} km</span>
                    </div>
                )}
                {appliedPromoCode && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá</span>
                        <span className="text-red-500 font-medium">
                            -{formatPrice(calculatePromoDiscount())}
                        </span>
                    </div>
                )}
                <div className="flex justify-between border-t border-t-gray-300 pt-2">
                    <span className="font-bold text-lg">Tổng cộng</span>
                    <span className="font-bold text-red-500 text-lg">
                        {formatPrice(calculateTotal())}
                    </span>
                </div>
            </div>

            <button
                className={`cursor-pointer mt-5 w-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-4 rounded-lg shadow-md transition duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                onClick={handlePlaceOrder}
                disabled={loading}
            >
                {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
            </button>

            <div className="flex flex-wrap justify-center text-center text-sm text-gray-500 mt-2">
                <span>Bằng cách tiến hành thanh toán, bạn đồng ý với</span>
                <span className="text-red-600 hover:underline mx-1 cursor-pointer">điều khoản dịch vụ</span>
                <span>của chúng tôi</span>
            </div>



        </div>
    );
}

export default OrderSummarySection;