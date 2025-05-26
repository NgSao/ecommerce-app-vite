import { GET_ALL, GET_ALL_PAGE } from '@api/apiService';
import EmptyState from '@component/list/EmptyState';
import FilterBar from '@component/list/FilterBar';
import FiltersContainer from '@component/list/FiltersContainer';
import GridItem from '@component/list/GridItem';
import ListItem from '@component/list/ListItem';
import { useCart } from '@context/CartContext';
import { useWishlist } from '@context/WishlistContext';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const ProductListPage = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(6);


    useEffect(() => {
        fetchProducts(page);
    }, [page, limit]);

    const fetchProducts = async (pageNumber) => {
        try {
            setLoading(true);
            const params = { page: pageNumber, limit };

            const categoriesResponse = await GET_ALL("categories");
            if (categoriesResponse.status === 200) {
                setCategories(categoriesResponse.data.data);
            }

            const brandsResponse = await GET_ALL("brands");
            if (brandsResponse.status === 200) {
                setBrands(brandsResponse.data.data);
            }

            const response = await GET_ALL_PAGE("products/colors", params);
            if (response.status === 200) {
                const { content, pageNumber, pageSize, totalPages } = response.data.data;
                const formattedProducts = content.map((product) => ({
                    id: product.colorId,
                    productId: product.productId,
                    variantId: product.colorId,
                    name: `${product.name} ${product.storage || ""} ${product.color || ""}`.trim(),
                    price: product.price === 0 ? product.originalPrice : product.price,
                    originalPrice: product.originalPrice,
                    image: product.image || "https://via.placeholder.com/120",
                    stock: product.stock,
                    discount: product.discount === 100 ? null : product.discount,
                    brand: product.brand,
                    categories: product.categories,
                    color: product.color,
                    storage: product.storage,
                    maxQuantity: product.stock,
                }));
                setProducts(formattedProducts);
                setPage(pageNumber);
                setTotalPages(totalPages);
                setLimit(pageSize);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    const sortProducts = (products) => {
        switch (sortBy) {
            case "price-asc":
                return [...products].sort((a, b) => a.price - b.price);
            case "price-desc":
                return [...products].sort((a, b) => b.price - b.price);
            case "name-asc":
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case "name-desc":
                return [...products].sort((a, b) => b.name.localeCompare(b.name));
            default:
                return products;
        }
    };

    const filterProducts = (products) => {
        return products.filter((product) => {
            const isPriceInRange = product.price >= priceRange.min && product.price <= priceRange.max;
            const isBrandSelected =
                selectedBrands.length === 0 || selectedBrands.includes(product.brand?.name);
            const isCategorySelected =
                selectedCategories.length === 0 ||
                product.categories.some((cat) => selectedCategories.includes(cat.name));
            return isPriceInRange && isBrandSelected && isCategorySelected;
        });
    };

    const getFilteredAndSortedProducts = () => {
        const filtered = filterProducts(products);
        return sortProducts(filtered);
    };

    const navigateToProductDetail = (product) => {
        navigate("/product-detail", {
            state: {
                productId: product.productId,
                variantId: product.variantId,
            }

        });
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };

    const goToPreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const goToNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setPage(pageNumber);
    };

    const changeLimit = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    // Generate pagination buttons with ellipsis
    const getPaginationButtons = () => {
        const buttons = [];
        const maxButtons = window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 5 : 7; // Responsive: 3 for mobile, 5 for tablet, 7 for desktop
        const half = Math.floor(maxButtons / 2);
        let startPage = Math.max(1, page - half);
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        // Previous button
        buttons.push(
            <button
                key="prev"
                className={`px-4 py-2 rounded-md text-white ${page === 1 ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                    }`}
                onClick={goToPreviousPage}
                disabled={page === 1}
            >
                Trước
            </button>
        );

        // First page
        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    className={`px-4 py-2 rounded-md ${page === 1 ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => goToPage(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(<span key="start-ellipsis" className="px-4 py-2">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`px-4 py-2 rounded-md ${page === i ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => goToPage(i)}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="end-ellipsis" className="px-4 py-2">...</span>);
            }
            buttons.push(
                <button
                    key={totalPages}
                    className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => goToPage(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                className={`px-4 py-2 rounded-md text-white ${page === totalPages ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                    }`}
                onClick={goToNextPage}
                disabled={page === totalPages}
            >
                Sau
            </button>
        );

        return buttons;
    };

    if (loading && !refreshing) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <svg className="animate-spin w-8 h-8 text-red-600 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 max-sm:mb-20 max-md:mb-20">
            <div className="bg-gray-100 border-b-2 border-gray-200 ">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
                    <span>Trang chủ / </span>
                    <span>Giỏ hàng </span>
                </div>
            </div>
            <div className="container mx-auto px-4">

                <FilterBar
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
                <FiltersContainer
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedPriceRange={selectedPriceRange}
                    setSelectedPriceRange={setSelectedPriceRange}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    categories={categories}
                    brands={brands}
                />
                <div className="p-4 bg-white border-b border-gray-200 flex items-center">
                    <span className="text-gray-600 mr-4">Số sản phẩm mỗi trang:</span>
                    {[6, 10, 20].map((value) => (
                        <button
                            key={value}
                            className={`px-4 py-2 border rounded-md mr-2 ${limit === value ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            onClick={() => changeLimit(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <div
                    className={`p-4 grid gap-4 ${viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        : "grid-cols-1"
                        }`}
                >
                    {getFilteredAndSortedProducts().length === 0 ? (
                        <EmptyState />
                    ) : (
                        getFilteredAndSortedProducts().map((item) =>
                            viewMode === "grid" ? (
                                <GridItem
                                    key={item.id}
                                    item={item}
                                    navigateToProductDetail={navigateToProductDetail}
                                    formatPrice={formatPrice}
                                    addToCart={addToCart}
                                    addToWishlist={addToWishlist}
                                    isInWishlist={isInWishlist}
                                />
                            ) : (
                                <ListItem
                                    key={item.id}
                                    item={item}
                                    navigateToProductDetail={navigateToProductDetail}
                                    formatPrice={formatPrice}
                                    addToCart={addToCart}
                                    addToWishlist={addToWishlist}
                                    isInWishlist={isInWishlist}
                                />
                            )
                        )
                    )}
                </div>
                <div className="flex flex-wrap justify-center items-center p-4 bg-white border-t border-gray-200 gap-2">
                    {getPaginationButtons()}
                </div>
                {refreshing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <svg className="animate-spin w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProductListPage;