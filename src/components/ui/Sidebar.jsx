import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaStore, FaReceipt, FaHeart, FaMapMarkerAlt, FaCreditCard, FaHeadset, FaQuestionCircle, FaInfoCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from '@context/AuthContext';

export default function Sidebar() {
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const menuItems = [
        {
            id: "0",
            title: "Quản lý cửa hàng",
            icon: <FaStore className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: true,
            requiresAdmin: true,
            path: "admin-dashboard",
        },
        {
            id: "1",
            title: "Thông tin cá nhân",
            icon: <FaUser className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: true,
            path: "",
        },
        {
            id: "2",
            title: "Đơn hàng của tôi",
            icon: <FaReceipt className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: true,
            path: "order-history",
        },
        {
            id: "3",
            title: "Sản phẩm yêu thích",
            icon: <FaHeart className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: true,
            path: "wishlist",
        },
        {
            id: "4",
            title: "Địa chỉ giao hàng",
            icon: <FaMapMarkerAlt className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: true,
            path: "shipping-addresses",
        },
        {
            id: "5",
            title: "Phương thức thanh toán",
            icon: <FaCreditCard className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: true,
            path: "payment-methods",
        },
        {
            id: "6",
            title: "Trung tâm hỗ trợ",
            icon: <FaQuestionCircle className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: false,
            path: "help-center",
        },
        {
            id: "7",
            title: "Hỗ trợ trực tuyến",
            icon: <FaHeadset className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: false,
            path: "chat",
        },
        {
            id: "8",
            title: "Về Minh Tuấn Mobile",
            icon: <FaInfoCircle className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: false,
            path: "about-us",
        },
        {
            id: "9",
            title: "Cài đặt",
            icon: <FaCog className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
            requiresAuth: false,
            path: "/settings",
        },
    ];

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        logout();
        navigate("/");
    };

    const renderMenuItem = (item) => {
        if (!isLoggedIn && item.requiresAuth) return null;
        if (item.requiresAdmin && (!user || user.role !== "ADMIN")) return null;

        return (
            <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                    `group flex flex-row items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out ${isActive ? "text-red-700 font-semibold" : "text-gray-800"
                    }`
                }
            >
                <div className="flex flex-row items-center gap-2">
                    {item.icon}
                    <h2 className="text-lg">{item.title}</h2>
                </div>
            </NavLink>
        );
    };
    return (
        <>
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm border-r-2 border-gray-300 md:border-r-0">
                <div className="flex flex-col gap-4">
                    {menuItems.map(renderMenuItem)}
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="group flex flex-row items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                        >
                            <FaSignOutAlt className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />
                            <h2 className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700">Đăng xuất</h2>
                        </button>
                    )}
                </div>
            </div>
            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Đăng xuất</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất?</p>
                        <div className="flex flex-row gap-4">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}