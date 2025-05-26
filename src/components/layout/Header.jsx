// src/components/Header.jsx
import Auth from '@component/auth/Auth';
import CategoryItem from '@component/home/CategoryItem';
import { useCart } from '@context/CartContext';
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const { cartItems } = useCart()

    return (
        <div className="sticky top-0 w-full z-50 bg-white shadow-md pt-2">
            <div className="container mx-auto flex flex-row items-center p-2 bg-white max-md:mx-2 max-sm:mt-2 max-md:mt-2">
                {/* Logo */}
                <div className="basis-2/12 flex justify-center items-center cursor-pointer ">
                    <Link to="/">
                        <img src='https://minhtuanmobile.com/assets/front/img/logo.png?240904'
                            className="w-52 h-auto object-contain max-md:h-4 max-md:object-cover"
                        />

                    </Link>
                </div>

                {/* Search Bar */}
                <div className="basis-8/12 lg:basis-4/12 flex justify-center max-lg:w-full  max-md:mx-2">
                    <div className="flex xl:w-96 max-xl:w-full bg-white px-6 py-2 border-2 border-red-700 rounded-2xl">
                        <input
                            type="text"
                            placeholder="Bạn cần tìm gì...?"
                            className="w-full text-base bg-transparent rounded outline-none pr-2"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 cursor-pointer hover:text-red-800"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                {/* Right Side (Hotline, Cart, Order Tracking, Store System) */}
                <div className="basis-2/12 lg:basis-6/12 flex flex-row items-center">
                    {/* Hotline - Hidden on screens smaller than lg */}
                    <div className="hidden lg:flex basis-1/5 flex-row items-center cursor-pointer gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-10 text-red-700"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                            />
                        </svg>
                        <div>
                            <div className="text-xs font-bold hover:text-red-700">Hotline</div>
                            <div
                                onClick={() => window.open('tel:18003355')}
                                className="text-xs font-medium text-red-700"
                            >
                                18003355
                            </div>
                        </div>
                    </div>

                    {/* Cart - Visible on all screen sizes */}
                    <div className="basis-1/5 flex flex-row items-center cursor-pointer gap-1">
                        <Link to="/cart" className='flex flex-row items-center ' >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-10 text-red-700"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                />
                            </svg>
                            <div className='max-md:hidden max-lg:hidden'>
                                <div className="text-xs font-bold text-red-700">Giỏ hàng</div>
                                <div className=" text-xs font-medium hover:text-red-700">{cartItems?.length} sản phẩm</div>
                            </div>
                        </Link>
                    </div>

                    {/* Order Tracking - Hidden on screens smaller than lg */}
                    <div className="hidden lg:flex basis-1/5 flex-row items-center cursor-pointer gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-10 text-red-700"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                            />
                        </svg>
                        <Link to="/products">
                            <div>
                                <div className="text-xs font-bold hover:text-red-700">Kiểm tra</div>
                                <div className="text-xs font-medium text-red-700">Đơn hàng</div>
                            </div>
                        </Link>
                    </div>

                    {/* Store System - Hidden on screens smaller than lg */}
                    <div className="hidden lg:flex basis-1/5 flex-row items-center cursor-pointer gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-10 text-red-700"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                            />
                        </svg>
                        <Link to="/admin/login">
                            <div>
                                <div className="text-xs font-bold hover:text-red-700">Hệ thống</div>
                                <div className="text-xs font-medium text-red-700">Cửa hàng</div>
                            </div>
                        </Link>
                    </div>
                    <Auth />

                </div>
            </div>
            <CategoryItem />

        </div>
    );
}

export default Header;
{/* <div className="text-xl md:text-4xl font-bold text-red-700">
                            SN <span className="text-black">Mobile</span>
                        </div> */}