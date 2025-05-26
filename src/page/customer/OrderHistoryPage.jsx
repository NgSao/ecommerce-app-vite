import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStore, FaReceipt, FaHeart, FaMapMarkerAlt, FaCreditCard, FaHeadset, FaQuestionCircle, FaInfoCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@context/AuthContext";
import { formatDateFull, formatPrice } from "@utils/formatUtils";
import { GET_TOKEN } from "@api/apiService";

export default function OrderHistoryPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchOrders();

    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await GET_TOKEN("user/my-orders", token);
            if (response.status === 200) {
                setOrders(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            alert("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const navigateToOrderDetail = (orderId) => {
        navigate(`order-detail/${orderId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-400";
            case "CONFIRMED":
                return "bg-blue-400";
            case "SHIPPED":
                return "bg-blue-600";
            case "DELIVERED":
                return "bg-green-500";
            case "CANCELLED":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "PENDING":
                return "Đang xử lý";
            case "CONFIRMED":
                return "Đã xác nhận";
            case "SHIPPED":
                return "Đang giao hàng";
            case "DELIVERED":
                return "Đã giao thành công";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;
        switch (activeTab) {
            case "processing":
                return order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED";
            case "shipping":
                return order.orderStatus === "SHIPPED";
            case "delivered":
                return order.orderStatus === "DELIVERED";
            case "cancelled":
                return order.orderStatus === "CANCELLED";
            default:
                return true;
        }
    });



    return (

        < div className="md:col-span-4 bg-white p-6 rounded-lg shadow-sm" >
            <h2 className="text-xl font-bold mb-4">Đơn hàng của tôi</h2>

            <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
                {[
                    { id: "all", label: "Tất cả" },
                    { id: "processing", label: "Đang xử lý" },
                    { id: "shipping", label: "Đang giao" },
                    { id: "delivered", label: "Đã giao" },
                    { id: "cancelled", label: "Đã hủy" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id
                            ? "border-b-2 border-red-600 text-red-600"
                            : "text-gray-600 hover:text-red-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {refreshing ? "Đang làm mới..." : "Làm mới"}
                </button>
            </div>

            {
                loading && !refreshing ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải đơn hàng...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer"
                                onClick={() => navigateToOrderDetail(item.id)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold">Đơn hàng #{item.orderCode}</h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(item.orderStatus)}`}
                                    >
                                        {getStatusText(item.orderStatus)}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <p className="text-sm text-gray-600">Ngày đặt: {formatDateFull(item.createdAt)}</p>
                                    <p className="text-sm font-bold">Tổng tiền: {formatPrice(item.total)}</p>
                                </div>
                                {item.promoCode && (
                                    <p className="text-sm text-red-600 mb-2">
                                        Mã giảm giá: {item.promoCode} (-{formatPrice(item.discount)})
                                    </p>
                                )}
                                <div className="mb-2">
                                    <p className="text-sm font-bold">Sản phẩm:</p>
                                    {item.items.map((product, index) => (
                                        <p key={index} className="text-sm text-gray-600 truncate">
                                            {product.name} x{product.quantity}
                                        </p>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToOrderDetail(item.id);
                                        }}
                                        className="flex items-center text-red-600 font-bold"
                                    >
                                        Xem chi tiết
                                        <svg
                                            className="w-4 h-4 ml-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <svg
                            className="w-16 h-16 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <p className="mt-2 text-gray-600">Không tìm thấy đơn hàng nào</p>
                    </div>
                )
            }
        </div >

    );
}