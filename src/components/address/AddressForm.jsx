import React from "react";

const AddressForm = ({
    formData,
    onChange,
    errors,
    onGetLocation,
    isLoadingLocation,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên người nhận
                </label>
                <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="Nhập tên người nhận"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.fullName ? "border-red-600" : "border-gray-300"
                        }`}
                />
                {errors.fullName && (
                    <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                </label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.phone ? "border-red-600" : "border-gray-300"
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ chi tiết
                </label>
                <input
                    type="text"
                    value={formData.addressDetail}
                    onChange={(e) => onChange("addressDetail", e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.addressDetail ? "border-red-600" : "border-gray-300"
                        }`}
                />
                {errors.addressDetail && (
                    <p className="text-red-600 text-xs mt-1">{errors.addressDetail}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã
                </label>
                <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => onChange("street", e.target.value)}
                    placeholder="Nhập phường/xã"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.street ? "border-red-600" : "border-gray-300"
                        }`}
                />
                {errors.street && (
                    <p className="text-red-600 text-xs mt-1">{errors.street}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện
                </label>
                <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => onChange("district", e.target.value)}
                    placeholder="Nhập quận/huyện"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.district ? "border-red-600" : "border-gray-300"
                        }`}
                />
                {errors.district && (
                    <p className="text-red-600 text-xs mt-1">{errors.district}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố
                </label>
                <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Nhập tỉnh/thành phố"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.city ? "border-red-600" : "border-gray-300"
                        }`}
                />
                {errors.city && (
                    <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                )}
            </div>

            <button
                onClick={onGetLocation}
                disabled={isLoadingLocation}
                className={`w-full py-3 rounded-lg text-white font-medium ${isLoadingLocation
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } transition-colors`}
            >
                {isLoadingLocation ? "Đang tải..." : "Lấy vị trí hiện tại"}
            </button>
        </div>
    );
};

export default AddressForm;