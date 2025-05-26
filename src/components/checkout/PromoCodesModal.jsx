
import { formatPrice } from '@utils/formatUtils';
function PromoCodesModal({
    showPromoCodesModal,
    setShowPromoCodesModal,
    availablePromoCodes,
    loadingPromoCodes,
    selectPromoCode,
    formatExpiryDate,
}) {
    return (
        <div
            className={`fixed inset-0  bg-opacity-50 flex items-center justify-center ${showPromoCodesModal ? '' : 'hidden'
                }`}
        >

            <div className="bg-white w-11/12 sm:w-3/4 lg:w-1/2 max-h-[80vh] rounded-lg p-6 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Mã giảm giá của tôi</h2>
                    <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setShowPromoCodesModal(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {loadingPromoCodes ? (
                    <div className="text-center py-4">
                        <p className="text-gray-600">Đang tải mã giảm giá...</p>
                    </div>
                ) : availablePromoCodes.length > 0 ? (
                    <div className="space-y-4">
                        {availablePromoCodes.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => selectPromoCode(item)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                                        {item.code}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        HSD: {formatExpiryDate(item.expiryDate)}
                                    </span>
                                </div>
                                <p className="text-gray-800">{item.description}</p>
                                <p className="text-gray-600 text-sm">
                                    Đơn tối thiểu {formatPrice(item.minOrderValue)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-600">Bạn chưa có mã giảm giá nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PromoCodesModal;