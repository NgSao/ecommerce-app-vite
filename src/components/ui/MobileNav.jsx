import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Menu } from 'lucide-react';

export default function MobileNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 sm:hidden mb-2">
            <div className="flex justify-around items-center h-16">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-1/5 h-full ${isActive ? 'text-red-600' : 'text-gray-500'}`
                    }
                >
                    <Home size={20} />
                    <span className="text-[10px] mt-1">Trang Chủ</span>
                </NavLink>
                <NavLink
                    to="/danh-muc"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-1/5 h-full ${isActive ? 'text-red-600' : 'text-gray-500'}`
                    }
                >
                    <Menu size={20} />
                    <span className="text-[10px] mt-1">Danh Mục</span>
                </NavLink>
                <NavLink
                    to="/cua-hang"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-1/5 h-full ${isActive ? 'text-red-600' : 'text-gray-500'}`
                    }
                >
                    <ShoppingBag size={20} />
                    <span className="text-[10px] mt-1">Cửa Hàng</span>
                </NavLink>
                <NavLink
                    to="/tim-kiem"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-1/5 h-full ${isActive ? 'text-red-600' : 'text-gray-500'}`
                    }
                >
                    <Search size={20} />
                    <span className="text-[10px] mt-1">Tìm Kiếm</span>
                </NavLink>
                <NavLink
                    to="/account"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-1/5 h-full ${isActive ? 'text-red-600' : 'text-gray-500'}`
                    }
                >
                    <User size={20} />
                    <span className="text-[10px] mt-1">Tài Khoản</span>
                </NavLink>
            </div>
        </div>
    );
}
