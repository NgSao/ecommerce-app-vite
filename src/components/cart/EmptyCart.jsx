import React from 'react';

const EmptyCart = () => (
    <div className=" flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <svg className="w-16 h-16 text-gray-300 sm:w-20 sm:h-20 lg:w-24 lg:h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-lg text-gray-600 mt-4 sm:text-xl lg:text-2xl">
            Giỏ hàng của bạn đang trống
        </span>
        <button
            className="bg-red-600 text-white font-bold py-2 px-4 rounded mt-6 sm:mt-8 sm:px-6 lg:text-lg"
        >
            Tiếp tục mua sắm
        </button>
    </div>
);

export default EmptyCart;