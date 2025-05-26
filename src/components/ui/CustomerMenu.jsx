// CustomerMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaStore, FaReceipt, FaHeart, FaMapMarkerAlt, FaCreditCard, FaHeadset, FaQuestionCircle, FaInfoCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

const menuItems = [
    {
        id: "0",
        title: "Quản lý cửa hàng",
        icon: <FaStore className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: true,
        requiresAdmin: true,
        path: "/admin-dashboard",
    },
    {
        id: "100",
        title: "Tài khoản của tôi",
        icon: <FaStore className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: true,
        path: "/admin-dashboard",
    },
    {
        id: "1",
        title: "Đơn hàng của tôi",
        icon: <FaReceipt className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: true,
        path: "/order-history",
    },
    {
        id: "2",
        title: "Sản phẩm yêu thích",
        icon: <FaHeart className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: true,
        path: "/wishlist",
    },
    {
        id: "3",
        title: "Địa chỉ giao hàng",
        icon: <FaMapMarkerAlt className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: true,
        path: "/shipping-addresses",
    },
    {
        id: "4",
        title: "Phương thức thanh toán",
        icon: <FaCreditCard className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: true,
        path: "/payment-methods",
    },
    {
        id: "6",
        title: "Trung tâm hỗ trợ",
        icon: <FaQuestionCircle className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: false,
        path: "/help-center",
    },
    {
        id: "7",
        title: "Hỗ trợ trực tuyến",
        icon: <FaHeadset className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: false,
        path: "/chat",
    },
    {
        id: "8",
        title: "Về Minh Tuấn Mobile",
        icon: <FaInfoCircle className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: false,
        path: "/about-us",
    },
    {
        id: "9",
        title: "Cài đặt",
        icon: <FaCog className="text-lg transition-colors duration-300 ease-in-out group-hover:text-red-700" />,
        requiresAuth: false,
        path: "/settings",
    },
];

const CustomerMenu = ({ isLoggedIn, user, handleLogout, activePath }) => {
    const renderMenuItem = (item) => {
        if (!isLoggedIn && item.requiresAuth) return null;
        if (item.requiresAdmin && (!user || user.role !== "ADMIN")) return null;

        return (
            <Link
                key={item.id}
                to={item.path}
                className={`group flex flex-row items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out group-hover:translate-x-2 ${item.path === activePath ? "text-red-700" : ""
                    }`}
            >
                {item.icon}
                <h2
                    className={`text-lg transition-colors duration-300 ease-in-out ${item.path === activePath ? "text-red-700" : "group-hover:text-red-700"
                        }`}
                >
                    {item.title}
                </h2>
            </Link>
        );
    };

    return (
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
    );
};

export default CustomerMenu;