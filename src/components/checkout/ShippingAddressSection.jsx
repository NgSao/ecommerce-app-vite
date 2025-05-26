function ShippingAddressSection({
    addresses,
    selectedAddress,
    setSelectedAddress,
    // showAddAddress,
    // setShowAddAddress,
    // newAddress,
    // setNewAddress,
    // handleAddAddress,
}) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Địa chỉ giao hàng</h2>
            {addresses.length > 0 ? (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer ${selectedAddress?.id === address.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                                }`}
                            onClick={() => setSelectedAddress(address)}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">
                                    {address.fullName} | {address.phone}
                                </p>
                                {address.active && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                        Mặc định
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">
                                {address.addressDetail}, {address.street}, {address.district},{' '}
                                {address.city}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 italic">Chưa có địa chỉ giao hàng</p>
            )}
            {/* <button
                className="mt-4 flex items-center text-red-500 border border-dashed border-red-500 rounded-lg px-4 py-2 hover:bg-red-50"
                onClick={() => setShowAddAddress(true)}
            >
                <span className="mr-2">+</span> Thêm địa chỉ mới
            </button>
            {showAddAddress && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">Thêm địa chỉ mới</h3>
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        value={newAddress.fullName}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, fullName: e.target.value })
                        }
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        value={newAddress.phone}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ chi tiết"
                        value={newAddress.addressDetail}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, addressDetail: e.target.value })
                        }
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Phường/Xã"
                        value={newAddress.street}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Quận/Huyện"
                        value={newAddress.district}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, district: e.target.value })
                        }
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Thành phố"
                        value={newAddress.city}
                        onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                            onClick={() => setShowAddAddress(false)}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={handleAddAddress}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default ShippingAddressSection;