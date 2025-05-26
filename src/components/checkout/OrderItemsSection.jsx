import { formatPrice } from "@utils/formatUtils";

function OrderItemsSection({ cartItems }) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Sản phẩm</h2>
            {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b py-4">
                    <div className="flex items-center">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg mr-4 object-cover"
                        />
                        <div>
                            <p className="font-semibold text-sm sm:text-base">{item.name}</p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                {item.color}
                                {item.storage ? `, ${item.storage}` : ''} | x{item.quantity}
                            </p>
                        </div>
                    </div>
                    <p className="font-semibold text-red-500">
                        {formatPrice(item.price * item.quantity)}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default OrderItemsSection;