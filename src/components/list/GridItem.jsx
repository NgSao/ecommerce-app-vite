const GridItem = ({ item, navigateToProductDetail, formatPrice, addToCart, addToWishlist, isInWishlist }) => {
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
        <div onClick={() => navigateToProductDetail(item)}
            className="bg-white rounded-lg border border-gray-200 p-4 relative hover:shadow-md">
            {item.discount > 0 && (
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{item.discount}%
                </span>
            )}
            <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-contain mb-4"
            />
            <h3 className="text-sm font-bold mb-2 h-10 overflow-hidden">{item.name}</h3>
            <div className="flex items-center mb-2">
                <span className="text-red-600 font-bold">{formatPrice(item.price)}</span>
                {item.originalPrice > item.price && (
                    <span className="text-gray-500 line-through text-sm ml-2">
                        {formatPrice(item.originalPrice)}
                    </span>
                )}
            </div>
            <div className="flex justify-between">
                <button
                    className="flex-1 bg-red-600 text-white py-2 rounded-md mr-2 hover:bg-red-700"
                    onClick={handleAddToCart}
                >
                    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </button>
                <button
                    className="p-2 border border-gray-200 rounded-md"
                    onClick={() => addToWishlist(item)}
                >
                    <svg className={`w-4 h-4 ${isInWishlist(item.id) ? "text-red-600" : "text-gray-600"}`} fill={isInWishlist(item.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
export default GridItem;