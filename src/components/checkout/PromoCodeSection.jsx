import { formatPrice } from "@utils/formatUtils";

function PromoCodeSection({
    promoCode,
    setPromoCode,
    appliedPromoCode,
    promoCodeError,
    applyPromoCode,
    removePromoCode,
    setShowPromoCodesModal,
    calculatePromoDiscount,
    setPromoCodeError,
    loading,
}) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Mã giảm giá</h2>
            <div className="flex flex-col sm:flex-row items-center mb-4">
                <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoCodeError('');
                    }}
                    className="flex-1 p-2 border rounded-lg mr-0 sm:mr-2 mb-2 sm:mb-0"
                />
                <button
                    className={`px-4 py-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                    onClick={applyPromoCode}
                    disabled={loading}
                >
                    {loading ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
            </div>
            {promoCodeError && <p className="text-red-500 text-sm mb-2">{promoCodeError}</p>}
            {appliedPromoCode && (
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <p className="text-red-500">
                        Mã: {appliedPromoCode.code} (-{formatPrice(calculatePromoDiscount())})
                    </p>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={removePromoCode}
                    >
                        Xóa
                    </button>
                </div>
            )}
            <button
                className="mt-2 text-red-500 hover:underline"
                onClick={() => setShowPromoCodesModal(true)}
            >
                Xem mã giảm giá của tôi
            </button>
        </div>
    );
}

export default PromoCodeSection;