const ListItem = ({ item, navigateToProductDetail, formatPrice, addToCart, addToWishlist, isInWishlist }) => {
    const handleAddToCart = () => {
        const productToAdd = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            maxQuantity: item.stock,
        };
        const options = item.color || item.storage ? { color: item.color, storage: item.storage } : {};
        addToCart(productToAdd, 1, options);
    };

    return (
        <div className="flex bg-white rounded-lg border border-gray-200 p-4 mb-4 hover:shadow-md cursor-pointer" onClick={() => navigateToProductDetail(item)}>
            <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain mr-4"
            />
            <div className="flex-1">
                <h3 className="text-sm font-bold mb-2">{item.name}</h3>
                <div className="flex items-center mb-2">
                    <span className="text-red-600 font-bold">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                        <span className="text-gray-500 line-through text-sm ml-2">
                            {formatPrice(item.originalPrice)}
                        </span>
                    )}
                </div>
                {item.discount > 0 && (
                    <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        -{item.discount}%
                    </span>
                )}
                <div className="flex items-center">
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded-md mr-4 hover:bg-red-700"
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn không cho event onClick của div cha chạy
                            handleAddToCart();
                        }}
                    >
                        Thêm vào giỏ
                    </button>
                    <button
                        className="p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(item);
                        }}
                    >
                        <svg className={`w-5 h-5 ${isInWishlist(item.id) ? "text-red-600" : "text-gray-600"}`} fill={isInWishlist(item.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ListItem;