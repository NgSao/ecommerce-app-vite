function PaymentMethodSection({ paymentMethod, setPaymentMethod }) {
    const paymentMethods = [
        {
            id: 'cod',
            title: 'Thanh toán khi nhận hàng (COD)',
            description: 'Thanh toán bằng tiền mặt khi nhận hàng',
        },
        {
            id: 'bank',
            title: 'Chuyển khoản ngân hàng qua mã QR',
            description: 'Thanh toán qua tài khoản ngân hàng',
        },
        {
            id: 'vnpay',
            title: 'Thanh toán qua VNPAY',
            description: 'Thanh toán qua ví điện tử VNPAY',
        },
        {
            id: 'momo',
            title: 'Thanh toán qua Momo',
            description: 'Thanh toán qua ví điện tử Momo',
        },
        {
            id: 'zalopay',
            title: 'Thanh toán qua Zalopay',
            description: 'Thanh toán qua ví điện tử Zalopay',
        },
    ];

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Phương thức thanh toán</h2>
            <div className="space-y-2">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${paymentMethod === method.id
                                ? 'bg-red-50 border border-red-500'
                                : 'bg-gray-50'
                            }`}
                        onClick={() => setPaymentMethod(method.id)}
                    >
                        <div className="flex-1">
                            <p
                                className={`font-medium ${paymentMethod === method.id
                                        ? 'text-red-500'
                                        : 'text-gray-800'
                                    }`}
                            >
                                {method.title}
                            </p>
                            <p className="text-gray-600 text-sm">{method.description}</p>
                        </div>
                        {paymentMethod === method.id && (
                            <svg
                                className="w-5 h-5 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaymentMethodSection;