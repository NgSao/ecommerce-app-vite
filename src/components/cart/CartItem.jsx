import { formatPrice } from '@utils/formatUtils';
import React from 'react';

const CartItem = ({ item, index, incrementQuantity, decrementQuantity, removeItem }) => {
    const hasVariants = item.color || item.storage || item.size;
    const variantText = hasVariants
        ? [item.color, item.storage, item.size].filter(Boolean).join(', ')
        : null;

    return (
        <div className="flex items-center bg-white p-4 mb-2 border-b border-gray-200 sm:p-6 lg:p-8">
            <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain mr-4 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
            <div className="flex-1">
                <span className="text-base font-bold text-gray-800 line-clamp-2 sm:text-lg lg:text-xl">
                    {item.name}
                </span>
                {variantText && (
                    <span className="text-sm text-gray-600 block sm:text-base lg:text-lg">{variantText}</span>
                )}
                <span className="text-base font-bold text-red-600 mt-1 sm:text-lg lg:text-xl">
                    {formatPrice(item.price)}
                </span>
                <div className="flex items-center mt-2">
                    <button
                        onClick={() => decrementQuantity(index)}
                        className="border border-gray-300 w-7 h-7 flex items-center justify-center rounded sm:w-8 sm:h-8 lg:w-9 lg:h-9"
                    >
                        <svg className="w-4 h-4 text-gray-600 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                        </svg>
                    </button>
                    <span className="px-4 text-sm sm:text-base lg:text-lg">{item.quantity}</span>
                    <button
                        onClick={() => incrementQuantity(index)}
                        className="border border-gray-300 w-7 h-7 flex items-center justify-center rounded sm:w-8 sm:h-8 lg:w-9 lg:h-9"
                    >
                        <svg className="w-4 h-4 text-gray-600 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </div>
            <button
                onClick={() => removeItem(index)}
                className="p-2 sm:p-3"
            >
                <svg className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

export default CartItem;