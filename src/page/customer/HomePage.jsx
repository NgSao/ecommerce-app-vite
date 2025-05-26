import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline, IoCartOutline, IoFlame, IoHeart, IoHeartOutline } from "react-icons/io5";
import { GET_ALL } from "@api/apiService";
import { useCart } from "@context/CartContext";
import { useWishlist } from "@context/WishlistContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannerItem from "@component/home/BannerItem";
import { CustomNextArrow, CustomPrevArrow } from "@component/ui/CustomNextArrow";

const HomePage = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [products, setProducts] = useState([]);
    const [hotProducts, setHotProducts] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const flattenProductVariants = (products) => {
        return products.flatMap((product) =>
            product.variants?.length > 0
                ? product.variants.map((variant) => ({
                    id: `${product.id}${variant.id}`,
                    productId: product.id,
                    variantId: variant.id,
                    name: `${product.name}${variant?.storage ? " " + variant.storage : ""}`,
                    price: variant.price === 0 ? variant.originalPrice : variant.price,
                    originalPrice: variant.originalPrice,
                    image: variant.image,
                    stock: variant.stock,
                    variant: variant,
                    sold: product.sold,
                }))
                : [
                    {
                        id: `${product.id}`,
                        productId: product.id,
                        variant: null,
                        name: product.name,
                        price: product.price === 0 ? product.originalPrice : product.price,
                        originalPrice: product.originalPrice,
                        image: product.images && product.images.length > 0 ? product.images[0] : null,
                        stock: product.stock,
                        sold: product.sold,
                    },
                ]
        );
    };

    const filterVariantsByStorage = (products) => {
        return products.map((product) => {
            if (!product.variants || product.variants.length === 0) {
                return product;
            }
            const variantsByStorage = product.variants.reduce((acc, variant) => {
                const storage = variant.storage || "default";
                if (!acc[storage]) {
                    acc[storage] = [];
                }
                acc[storage].push(variant);
                return acc;
            }, {});

            const filteredVariants = Object.values(variantsByStorage).map((variants) => variants[0]);

            return {
                ...product,
                variants: filteredVariants,
            };
        });
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            const bannersResponse = await GET_ALL("banners");
            if (bannersResponse.status === 200) {
                setBanners(bannersResponse.data.data);
            }

            const productSale = await GET_ALL("products/hot");
            if (productSale.status === 200) {
                const filteredProducts = filterVariantsByStorage(productSale.data.data);
                const flattenedProducts = flattenProductVariants(filteredProducts);
                setSaleProducts(flattenedProducts);
            }

            const hotDealsResponse = await GET_ALL("products/hot");
            if (hotDealsResponse.status === 200) {
                const filteredProducts = filterVariantsByStorage(hotDealsResponse.data.data);
                const flattenedProducts = flattenProductVariants(filteredProducts);
                setHotProducts(flattenedProducts);
            }

            const productsResponse = await GET_ALL("products");
            if (productsResponse.status === 200) {
                const filteredProducts = filterVariantsByStorage(productsResponse.data.data);
                const flattenedProducts = flattenProductVariants(filteredProducts);
                setProducts(flattenedProducts);
            }
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const navigateToProductDetail = (item) => {
        navigate("/product-detail", {
            state: { productId: item.productId, variantId: item.variantId },
        });
    };

    const handleAddToCart = (item) => {
        if (item.variant) {
            navigate("/product-detail", {
                state: { productId: item.productId, variantId: item.variantId },
            });
            return;
        }
        addToCart(item, 1);
    };

    const handleAddToWishlist = (item) => {
        const productToAdd = {
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price || 0,
            image: item.image,
            ...(item.variant?.color && { color: item.variant.color }),
            ...(item.variant?.storage && { storage: item.variant.storage }),
        };
        addToWishlist(productToAdd);
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    };

    const renderProductItem = (item) => {
        if (!item) return null;

        return (
            <button
                className="w-full max-w-xs mb-2 bg-white rounded-lg p-2.5 border border-gray-200 overflow-hidden cursor-pointer group transition-all duration-300"
                onClick={() => navigateToProductDetail(item)}
            >
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{item.discount}%
                        </div>
                    )}
                </div>
                <p className="text-sm font-bold mb-2.5 h-10 line-clamp-2 text-gray-900 transition-colors duration-300 group-hover:text-red-600">
                    {item.name}
                </p>
                <div className="flex items-center mb-2.5">
                    <p className="text-sm text-red-600 font-bold mr-2.5">{formatPrice(item.price)}</p>
                    {item.originalPrice > item.price && (
                        <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                    )}
                </div>
                <div className="flex items-center">
                    <button
                        className="flex-1 bg-red-600 text-white text-xs font-bold py-1.5 rounded-md mr-2.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                        }}
                    >
                        Mua ngay
                    </button>
                    <button
                        className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(item);
                        }}
                    >
                        {isInWishlist(item.productId) ? (
                            <IoHeart size={20} color="#e30019" />
                        ) : (
                            <IoHeartOutline size={20} color="#666" />
                        )}
                    </button>
                </div>
            </button>
        );
    };

    const renderSaleProductItem = (item) => {
        if (!item) return null;

        return (
            <button
                className="w-full bg-white rounded-lg overflow-hidden mx-1 group transition-all duration-300 cursor-pointer"
                onClick={() => navigateToProductDetail(item)}
            >
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                    </div>
                </div>
                <div className="p-2">
                    <p className="text-sm font-bold mb-2.5 h-10 line-clamp-2 text-gray-900 transition-colors duration-300 group-hover:text-red-600">
                        {item.name}
                    </p>
                    <div className="flex items-center mb-2.5">
                        <p className="text-sm text-red-600 font-bold mr-2.5">{formatPrice(item.price)}</p>
                        <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded mb-2.5 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-yellow-400"
                            style={{ width: `${(item.sold / item.stock) * 100}%` }}
                        />
                        <p className="absolute w-full text-center text-xs font-bold text-black">
                            Đã bán {item.sold}/{item.stock}
                        </p>
                    </div>
                </div>
            </button>

        );
    };

    const renderBanner = (item) => (
        <button
            className="w-full"
            onClick={() => console.log("Banner clicked:", item.link)}
        >
            <img
                src={item.imageUrl}
                alt="Banner"
                className="w-full h-36 object-cover rounded-lg"
            />
        </button>
    );

    const sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        pauseOnHover: true,
        cssEase: "ease-in-out",
        responsive: [
            {
                breakpoint: 1024, // lg
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768, // md
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640, // sm
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        pauseOnHover: true,
        cssEase: "ease-in-out",
        responsive: [
            {
                breakpoint: 1024, // tablet trở xuống
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 640, // mobile
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    const settingsAll = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        rows: 2,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024, // tablet
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    rows: 2,
                },
            },
            {
                breakpoint: 768, // mobile
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    rows: 2,
                },
            },
        ],
    };


    if (loading && !refreshing) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="w-10 h-10 border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                <p className="mt-2.5 text-base text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen max-sm:mb-20">
            <div className="container mx-auto px-2.5 py-4">
                <BannerItem />
                {/* Banners */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {banners.map((banner, index) => (
                        <div key={index}>{renderBanner(banner)}</div>
                    ))}
                </div>

                {/* Flash Sale */}

                {saleProducts.length > 0 && (
                    <div className="bg-red-600 mt-2.5 pb-3.5">
                        <div className="flex items-center justify-between px-2.5 py-2.5">
                            <div className="flex items-center">
                                <IoFlame size={24} color="#fff" />
                                <p className="text-white text-base font-bold ml-1.5">FLASH SALE</p>
                            </div>
                            <button
                                className="text-white text-sm"
                                onClick={() =>
                                    navigate("/product-list", { state: { isSale: true, title: "Flash Sale" } })
                                }
                            >
                                Xem tất cả
                            </button>
                        </div>
                        <div className="px-2.5">
                            <Slider {...settings}>
                                {saleProducts.map((product, idx) => (
                                    <div key={idx} className="px-1">
                                        {renderSaleProductItem(product)}
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                )}

                {/* Hot Products */}
                <div className="bg-white mt-4 p-2.5 rounded-lg">
                    <div className="flex items-center justify-between mb-2.5">
                        <p className="text-base font-bold">Sản phẩm bán chạy</p>
                        <button
                            className="text-red-600 text-sm"
                            onClick={() =>
                                navigate("/product-list", { state: { isHot: true, title: "Sản phẩm nổi bật" } })
                            }
                        >
                            Xem tất cả
                        </button>
                    </div>
                    <div>
                        <Slider {...sliderSettings}>
                            {hotProducts.map((product, index) => (
                                <div key={index} className="px-1">
                                    {renderProductItem(product)}
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* All Products */}
                <div className="bg-white mt-4 p-2.5 rounded-lg">
                    <div className="flex items-center justify-between mb-2.5">
                        <p className="text-base font-bold">Tất cả sản phẩm</p>
                        <button
                            className="text-red-600 text-sm"
                            onClick={() => navigate("/product-list", { state: { title: "Tất cả sản phẩm" } })}
                        >
                            Xem tất cả
                        </button>
                    </div>

                    <Slider {...settingsAll}>
                        {products.map((product, index) => (
                            <div key={index} className="px-1">
                                {renderProductItem(product)}
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
