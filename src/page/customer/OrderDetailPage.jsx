import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { formatDateFull, formatPrice } from "@utils/formatUtils";
import { GET_TOKEN_ID } from "@api/apiService";

export default function OrderDetailPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        fetchOrderDetails();

    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await GET_TOKEN_ID("user/orders", orderId, token);
            if (response.status === 200) {
                setOrder(response.data.data);
            } else {
                alert("Không thể tải thông tin đơn hàng");
                navigate("/order-history");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            alert("Đã có lỗi xảy ra khi tải thông tin đơn hàng");
            navigate("/order-history");
        } finally {
            setLoading(false);
        }
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

    const handleCancelOrder = async () => {
        const id = orderId;
        GET_TOKEN_ID("user/orders/cancel", id, token)
        setOrder((prevOrder) => ({ ...prevOrder, orderStatus: "CANCELLED" }))
        alert("Thành công", "Đơn hàng đã được hủy")

        navigate("order-history");
    };



    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                <p className="mt-2 text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <svg
                    className="w-16 h-16 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="mt-2 text-gray-600">Không tìm thấy thông tin đơn hàng</p>
                <Link
                    to="/order-history"
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Quay lại
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="md:col-span-4 bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Đơn hàng #{order.orderCode}</h2>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getStatusColor(order.orderStatus)}`}
                        >
                            {getStatusText(order.orderStatus)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">Ngày đặt: {formatDateFull(order.createdAt)}</p>
                </div>

                {/* Order Items */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-bold mb-4">Sản phẩm</h3>
                    {order.items.map((item, index) => (
                        <div key={index} className="flex mb-4 pb-4 border-b border-gray-200">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover mr-4"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <p className="text-sm font-bold max-w-[70%]">{item.name}</p>
                                    <p className="text-sm font-bold text-red-600">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-600">
                                        {item.color}{item.storage ? `, ${item.storage}` : ""}
                                    </p>
                                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipping Info */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-bold mb-4">Thông tin giao hàng</h3>
                    <div className="space-y-2">
                        <div className="flex">
                            <p className="w-32 text-sm text-gray-600">Người nhận:</p>
                            <p className="flex-1 text-sm font-medium">{order.shipping.fullName}</p>
                        </div>
                        <div className="flex">
                            <p className="w-32 text-sm text-gray-600">Số điện thoại:</p>
                            <p className="flex-1 text-sm font-medium">{order.shipping.phone}</p>
                        </div>
                        <div className="flex">
                            <p className="w-32 text-sm text-gray-600">Địa chỉ:</p>
                            <p className="flex-1 text-sm font-medium">{order.shipping.addressDetail}</p>
                        </div>
                        <div className="flex">
                            <p className="w-32 text-sm text-gray-600">Phương thức:</p>
                            <p className="flex-1 text-sm font-medium">{order.shipping.method}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-bold mb-4">Thông tin thanh toán</h3>
                    <div className="space-y-2">
                        <div className="flex">
                            <p className="w-32 text-sm text-gray-600">Phương thức:</p>
                            <p className="flex-1 text-sm font-medium">
                                {order.payment.method === "cod"
                                    ? "Thanh toán khi nhận hàng (COD)"
                                    : order.payment.method === "banking"
                                        ? "Chuyển khoản ngân hàng"
                                        : order.payment.method === "vnpay"
                                            ? "VNPay"
                                            : order.payment.method}
                            </p>
                        </div>
                        <div className="flex">
                            <p className="w-32 text-sm text-gray-600">Trạng thái:</p>
                            <p
                                className={`flex-1 text-sm font-medium ${order.payment.status === "Đã thanh toán" ? "text-green-500" : "text-orange-500"
                                    }`}
                            >
                                {order.payment.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <p className="text-sm text-gray-600">Tạm tính</p>
                            <p className="text-sm font-medium">
                                {formatPrice(order.items.reduce((total, item) => total + item.price * item.quantity, 0))}
                            </p>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <p className="text-sm text-gray-600">Phí vận chuyển</p>
                            <p className="text-sm font-medium">
                                {order.shipping.fee === 0 ? "Miễn phí" : formatPrice(order.shipping.fee)}
                            </p>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <p className="text-sm text-gray-600">Giảm giá</p>
                            <p className="text-sm font-medium text-red-600">
                                {order.promoCode ? `${order.promoCode}: ` : ""}-{formatPrice(order.discount)}
                            </p>
                        </div>
                        <div className="flex justify-between py-2">
                            <p className="text-base font-bold">Tổng cộng</p>
                            <p className="text-lg font-bold text-red-600">{formatPrice(order.total)}</p>
                        </div>
                    </div>
                </div>

                {/* Order Actions */}
                {order.orderStatus === "PENDING" && (
                    <div className="mt-4">
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Hủy đơn hàng
                        </button>
                    </div>
                )}
            </div>

            {
                showCancelConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
                            <h3 className="text-lg font-bold mb-4">Hủy đơn hàng</h3>
                            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                            <div className="flex flex-row gap-4">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Không
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Có, hủy đơn hàng
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


        </>
    );
}