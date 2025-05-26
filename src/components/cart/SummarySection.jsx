import { formatPrice } from '@utils/formatUtils';
import React from 'react';

const SummarySection = ({ cartItems, calculateSubtotal, calculateDiscount, calculateTotal, appliedPromo, navigate }) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4 mb-10">
        <div className="p-4 bg-gray-50 border-b border-b-gray-300 font-medium">Tóm tắt đơn hàng</div>
        <div className="p-4 space-y-4">
            <div className="flex justify-between">
                <span className="text-sm text-gray-600 sm:text-base">Tạm tính</span>
                <span className="text-sm font-medium sm:text-base">{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-gray-600 sm:text-base">Giảm giá</span>
                <span className="text-sm font-medium text-red-600 sm:text-base">
                    -{formatPrice(calculateDiscount())}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span>-</span>
            </div>
            <div className="pt-4 border-t border-t-gray-300 flex justify-between font-bold">
                <span className="text-base font-bold sm:text-lg lg:text-xl">Tổng cộng</span>
                <span className="text-lg font-bold text-red-600 sm:text-xl lg:text-xl">
                    {formatPrice(calculateTotal())}
                </span>
            </div>
            <button className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-4 rounded-lg shadow-md transition duration-300"
                onClick={() =>
                    navigate('/checkout', {
                        state: {
                            cartItems,
                            subtotal: calculateSubtotal(),
                            discount: calculateDiscount(),
                            total: calculateTotal(),
                            appliedPromo,
                        },
                    })
                }
            >
                TIẾN HÀNH THANH TOÁN
            </button>
            <div className="flex flex-wrap justify-center text-center text-sm text-gray-500">
                <span>Bằng cách tiến hành thanh toán, bạn đồng ý với</span>
                <span className="text-red-600 hover:underline mx-1 cursor-pointer">điều khoản dịch vụ</span>
                <span>của chúng tôi</span>
            </div>

        </div>

    </div>
);

export default SummarySection;