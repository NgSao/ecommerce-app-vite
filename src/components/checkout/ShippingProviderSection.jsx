function ShippingProviderSection({
    shippingProvider,
    setShippingProvider,
    ghtkDeliveryOption,
    setGhtkDeliveryOption,
}) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Chọn đơn vị vận chuyển</h2>
            <div className="space-y-2">
                <div
                    className="flex items-center p-3 rounded-lg cursor-pointer bg-gray-50"
                    onClick={() => {
                        setShippingProvider('GHN');
                        setGhtkDeliveryOption('xteam');
                    }}
                >
                    <div
                        className={`w-5 h-5 border-2 rounded-full mr-3 ${shippingProvider === 'GHN'
                                ? 'bg-red-500 border-red-500'
                                : 'border-gray-400'
                            }`}
                    />
                    <span className="text-gray-800">Giao Hàng Nhanh (GHN)</span>
                </div>
                <div
                    className="flex items-center p-3 rounded-lg cursor-pointer bg-gray-50"
                    onClick={() => setShippingProvider('GHTK')}
                >
                    <div
                        className={`w-5 h-5 border-2 rounded-full mr-3 ${shippingProvider === 'GHTK'
                                ? 'bg-red-500 border-red-500'
                                : 'border-gray-400'
                            }`}
                    />
                    <span className="text-gray-800">Giao Hàng Tiết Kiệm (GHTK)</span>
                </div>
                {shippingProvider === 'GHTK' && (
                    <div className="ml-8 space-y-2 mt-2">
                        <p className="font-semibold text-sm">Loại hình giao hàng</p>
                        <div
                            className="flex items-center p-2 rounded-lg cursor-pointer"
                            onClick={() => setGhtkDeliveryOption('xteam')}
                        >
                            <div
                                className={`w-5 h-5 border-2 rounded-full mr-3 ${ghtkDeliveryOption === 'xteam'
                                        ? 'bg-red-500 border-red-500'
                                        : 'border-gray-400'
                                    }`}
                            />
                            <span className="text-gray-800">Giao Nhanh (xteam)</span>
                        </div>
                        <div
                            className="flex items-center p-2 rounded-lg cursor-pointer"
                            onClick={() => setGhtkDeliveryOption('none')}
                        >
                            <div
                                className={`w-5 h-5 border-2 rounded-full mr-3 ${ghtkDeliveryOption === 'none'
                                        ? 'bg-red-500 border-red-500'
                                        : 'border-gray-400'
                                    }`}
                            />
                            <span className="text-gray-800">Giao Thường (none)</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShippingProviderSection;