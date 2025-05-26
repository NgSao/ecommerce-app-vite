import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { DELETE_TOKEN } from "@api/apiService";

export default function ShippingAddressesPage() {
    const { user, loading, token, fetchUser, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            refreshAddresses();
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (user && user.addresses) {
            setAddresses(user.addresses);
        }
    }, [user]);

    const refreshAddresses = async () => {
        if (!token) {
            alert("Bạn cần đăng nhập để xem địa chỉ");
            navigate("/login");
            return;
        }
        try {
            await fetchUser();
        } catch (error) {
            console.error(error);
            alert("Không thể tải danh sách địa chỉ");
        }
    };

    const handleDeleteAddress = (address) => {
        setSelectedAddress(address);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAddress = async () => {
        if (selectedAddress) {
            if (!token) {
                alert("Bạn cần đăng nhập để xóa địa chỉ");
                navigate("/login");
                return;
            }
            try {
                const response = await DELETE_TOKEN("address/delete", selectedAddress.id, token);
                if (response.status !== 200) {
                    alert("Không thể xóa địa chỉ");
                    return;
                }
                const updatedAddresses = addresses.filter((addr) => addr.id !== selectedAddress.id);
                setAddresses(updatedAddresses);
                alert("Đã xóa địa chỉ thành công");
            } catch (error) {
                console.error(error);
                alert("Không thể xóa địa chỉ");
            }
        }
        setShowDeleteConfirm(false);
        setSelectedAddress(null);
    };

    const onEditAddress = (address) => {
        navigate("edit-address", { state: { address } });
    };



    return (
        <>
            {/* Addresses List */}
            <div className="md:col-span-4 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
                    <Link
                        to="add-address"
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Thêm địa chỉ mới
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold">{item.name || "Địa chỉ"}</h3>
                                    {item.active && (
                                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            Mặc định
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm mb-2">
                                    {item.fullName} | {item.phone}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    {item.addressDetail}, {item.street}, {item.district}, {item.city}
                                </p>
                                <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-4">
                                    <button
                                        onClick={() => onEditAddress(item)}
                                        className="flex items-center text-gray-600 hover:text-red-600"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-5.657 1.414 1.414-5.657L17.414 2.586z"
                                            />
                                        </svg>
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(item)}
                                        className="flex items-center text-red-600 hover:text-red-700"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0h4m-7 4h10"
                                            />
                                        </svg>
                                        Xóa
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <p className="mt-2 text-gray-600 text-center">Bạn chưa có địa chỉ giao hàng nào</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
                        <h3 className="text-lg font-bold mb-4">Xóa địa chỉ</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa địa chỉ này?</p>
                        <div className="flex flex-row gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDeleteAddress}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}