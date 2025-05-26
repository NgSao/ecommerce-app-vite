import { formatPrice } from '@utils/formatUtils';
import React from 'react';

const PromoCodeSection = ({
    promoCode,
    setPromoCode,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    calculateDiscount,
}) => (
    <div className="bg-white p-4 mb-2 sm:p-6 lg:p-8">
        <span className="text-base font-bold sm:text-lg lg:text-xl">Mã giảm giá</span>
        {appliedPromo ? (
            <div className="flex items-center border border-red-600 rounded p-3 bg-red-50 mt-2">
                <div className="flex-1">
                    <span className="text-base font-bold text-red-600 sm:text-lg">{appliedPromo.code}</span>
                    <span className="text-sm text-gray-800 block sm:text-base">{appliedPromo.description}</span>
                    <span className="text-sm font-bold text-red-600 sm:text-base">
                        Giảm: {formatPrice(calculateDiscount())}
                    </span>
                </div>
                <button onClick={removePromoCode} className="p-1">
                    <svg className="w-6 h-6 text-red-600 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        ) : (
            <>
                <div className="flex mt-2">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 border border-gray-300 rounded p-2 mr-2 text-sm sm:text-base"
                    />
                    <button
                        onClick={applyPromoCode}
                        className="bg-red-600 text-white font-bold py-2 px-4 rounded sm:px-6"
                    >
                        Áp dụng
                    </button>
                </div>
                {promoError && (
                    <span className="text-red-600 text-xs mt-2 block sm:text-sm">{promoError}</span>
                )}
            </>
        )}
    </div>
);

export default PromoCodeSection;