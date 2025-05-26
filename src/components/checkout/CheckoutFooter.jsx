import { formatPrice } from "@utils/formatUtils";

function CheckoutFooter({ calculateTotal, handlePlaceOrder, loading }) {
    return (
        <div className="bg-white p-4 sm:p-6 border-t sticky bottom-0">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                    <p className="text-gray-600">Tổng cộng</p>
                    <p className="text-red-500 font-bold text-lg">
                        {formatPrice(calculateTotal())}
                    </p>
                </div>
                <button
                    className={`px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
            </div>
        </div>
    );
}

export default CheckoutFooter;