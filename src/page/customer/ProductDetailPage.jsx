import { useCart } from '@context/CartContext';
import { useWishlist } from '@context/WishlistContext';
import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { GET_ID } from '@api/apiService';
import { IoAlertCircleOutline } from "react-icons/io5";
import ImageCarousel from '@component/product/ImageCarousel';
import { ChevronRight, Truck, Shield, Gift, CreditCard, Phone } from "lucide-react"
import ProductInfo from '@component/product/ProductInfo';
import { IoStar, IoStarOutline } from "react-icons/io5";
import StorageSelection from '@component/product/StorageSelection';
import ColorSelection from '@component/product/ColorSelection';
import QuantitySelector from '@component/product/QuantitySelector';
import Specifications from '@component/product/Specifications';
import Description from '@component/product/Description';
import ActionBar from '@component/product/ActionBar';
import ReviewsSection from '@component/product/ReviewsSection';

export default function ProductDetailPage() {
    const location = useLocation();
    const { productId, variantId } = location.state || {};
    const { addToCart } = useCart()
    const { addToWishlist, isInWishlist } = useWishlist()
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedStorage, setSelectedStorage] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [variants, setVariants] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [colorImages, setColorImages] = useState({})
    const [isOnSale, setIsOnSale] = useState(false)
    const [soldPercentage, setSoldPercentage] = useState(0)

    console.log("alo", isOnSale, soldPercentage);
    useEffect(() => {
        fetchProductDetails()
    }, [productId])


    const fetchProductDetails = async () => {
        try {
            setLoading(true)
            const response = await GET_ID("products", productId)
            if (response.status === 200) {
                setProduct(response.data.data)
                if (response.data.data.variants && response.data.data.variants.length > 0) {
                    setVariants(response.data.data.variants)
                    const images = {}
                    response.data.data.variants.forEach((variant) => {
                        if (!images[variant.color]) {
                            images[variant.color] = variant.images || [variant.image]
                        }
                    })
                    setColorImages(images)

                    // Prioritize variantId from params if provided
                    let initialVariant = null
                    if (variantId) {
                        initialVariant = response.data.data.variants.find((v) => v.id === variantId)
                    }
                    if (!initialVariant) {
                        initialVariant = response.data.data.variants.find((v) => v.stock > 0) || response.data.variants[0]
                    }

                    if (initialVariant) {
                        setSelectedColor(initialVariant.color)
                        setSelectedStorage(initialVariant.storage)
                        setSelectedVariant(initialVariant)
                    }
                } else {
                    // Handle case where variants is null or empty
                    setVariants([])
                    setColorImages({})
                    setSelectedVariant(null)
                    setSelectedColor(null)
                    setSelectedStorage(null)
                }
            }
        } catch (error) {
            console.error("Error fetching product details:", error)
            alert("Lỗi", "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (product) {
            const now = new Date()
            const saleEndDate = product.saleEndDate ? new Date(product.saleEndDate) : null
            if (saleEndDate && saleEndDate > now) {
                setIsOnSale(true)
                if (product.saleQuantity && product.soldQuantity) {
                    const soldPercentage = (product.soldQuantity / product.saleQuantity) * 100
                    setSoldPercentage(soldPercentage)
                }
            } else {
                setIsOnSale(false)
            }
        }
    }, [product])

    useEffect(() => {
        if (selectedColor && selectedStorage && variants.length > 0) {
            const variant = variants.find((v) => v.color === selectedColor && v.storage === selectedStorage)
            if (variant) {
                setSelectedVariant(variant)
                if (quantity > variant.stock) {
                    setQuantity(variant.stock > 0 ? 1 : 0)
                }
            }
        }
    }, [selectedColor, selectedStorage, variants])

    const handleColorSelect = (color) => {
        setSelectedColor(color)
        const variantsWithColor = variants.filter((v) => v.color === color)
        if (variantsWithColor.length > 0) {
            const sameStorageVariant = variantsWithColor.find((v) => v.storage === selectedStorage)
            if (sameStorageVariant) {
                setSelectedStorage(sameStorageVariant.storage)
            } else {
                setSelectedStorage(variantsWithColor[0].storage)
            }
        }
    }

    const handleStorageSelect = (storage) => {
        setSelectedStorage(storage)
    }



    const handleAddToCart = () => {
        if (variants.length > 0 && !selectedVariant) {
            alert("Thông báo", "Vui lòng chọn phiên bản sản phẩm.")
            return
        }
        if (selectedVariant && selectedVariant.stock <= 0) {
            alert("Thông báo", "Sản phẩm đã hết hàng.")
            return
        }
        if (!selectedVariant && product.stock <= 0) {
            alert("Thông báo", "Sản phẩm đã hết hàng.")
            return
        }

        const productToAdd = selectedVariant
            ? {
                id: selectedVariant.id,
                name: `${product.name} ${selectedVariant.storage || ""} ${selectedVariant.color || ""}`.trim(),
                price: selectedVariant.price === 0 ? selectedVariant.originalPrice : selectedVariant.price,
                image: selectedVariant.image || (colorImages[selectedVariant.color] && colorImages[selectedVariant.color][0]),
                maxQuantity: selectedVariant.stock,
            }
            : {
                id: product.id,
                name: product.name,
                price: product.price === 0 ? product.originalPrice : product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                maxQuantity: product.stock,
            }

        const options = selectedVariant
            ? {
                color: selectedVariant.color,
                storage: selectedVariant.storage,
            }
            : {}

        addToCart(productToAdd, quantity, options)
    }

    const handleBuyNow = () => {
        handleAddToCart()
        navigate("Cart")
    }

    const handleAddToWishlist = () => {
        if (variants.length > 0 && !selectedVariant) {
            alert("Thông báo", "Vui lòng chọn phiên bản sản phẩm.")
            return
        }
        const productToAdd = selectedVariant
            ? {
                id: selectedVariant.id,
                productId: product.id,
                name: product.name,
                color: selectedVariant.color,
                storage: selectedVariant.storage,
                price: selectedVariant.price === 0 ? selectedVariant.originalPrice : selectedVariant.price,
                image: selectedVariant.image || (colorImages[selectedVariant.color] && colorImages[selectedVariant.color][0]),
            }
            : {
                id: product.id,
                productId: product.id,
                name: product.name,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
            }
        addToWishlist(productToAdd)
    }


    const renderRatingStars = (rating) => {
        if (!rating && rating !== 0) return null
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <IoStar key={i} className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                    <IoStarOutline key={i} className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                ))
        }
        return stars
    }

    const getAvailableColors = () => {
        if (!variants || variants.length === 0) return []
        return [...new Set(variants.map((v) => v.color))]
    }

    const getAvailableStorageOptions = () => {
        if (!variants || variants.length === 0 || !selectedColor) return []
        return variants.filter((v) => v.color === selectedColor).map((v) => v.storage)
    }

    const isVariantInStock = (color, storage) => {
        const variant = variants.find((v) => v.color === color && v.storage === storage)
        return variant && variant.stock > 0
    }

    const getStockStatusText = () => {
        if (variants.length > 0 && !selectedVariant) return ""
        if (selectedVariant && selectedVariant.stock <= 0) {
            return "Hết hàng"
        } else if (selectedVariant && selectedVariant.stock <= 5) {
            return `Còn ${selectedVariant.stock} sản phẩm`
        } else if (!selectedVariant && product.stock <= 0) {
            return "Hết hàng"
        } else if (!selectedVariant && product.stock <= 5) {
            return `Còn ${product.stock} sản phẩm`
        } else {
            return "Còn hàng"
        }
    }

    const getStockStatusColor = () => {
        if (variants.length > 0 && !selectedVariant) return "#999"
        if (selectedVariant && selectedVariant.stock <= 0) {
            return "#e30019"
        } else if (selectedVariant && selectedVariant.stock <= 5) {
            return "#ff9800"
        } else if (!selectedVariant && product.stock <= 0) {
            return "#e30019"
        } else if (!selectedVariant && product.stock <= 5) {
            return "#ff9800"
        } else {
            return "#4caf50"
        }
    }

    const getSelectedVariantImages = () => {
        if (selectedVariant && selectedVariant.image) {
            const productImages = product && product.images && product.images.length > 0 ? product.images : []
            const combinedImages = [selectedVariant.image, ...productImages.filter(img => img !== selectedVariant.image)]
            return combinedImages
        }
        return product && product.images && product.images.length > 0 ? product.images : []
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="w-10 h-10 border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                <p className="mt-2.5 text-base text-gray-600">Đang tải dữ liệu...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
                <IoAlertCircleOutline size={40} color="#e30019" />
                <p className="mt-3 text-lg text-gray-600 mb-5">Không tìm thấy thông tin sản phẩm</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-600 text-white font-bold py-2 px-5 rounded hover:bg-red-700 transition duration-200"
                >
                    Quay lại
                </button>
            </div>
        )
    }
    return (
        <div >
            <div className="bg-gray-100 border-b-2 border-gray-200 ">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
                    <span>Trang chủ / </span>
                    <span>{product.name} </span>
                </div>
            </div>
            <section className="py-6">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Product Images */}
                        <ImageCarousel images={getSelectedVariantImages()} />

                        {/* Product Info */}
                        <div className="lg:col-span-2">
                            <ProductInfo
                                product={product}
                                selectedVariant={selectedVariant}
                                renderRatingStars={renderRatingStars}
                                getStockStatusText={getStockStatusText}
                                getStockStatusColor={getStockStatusColor}
                            />

                            <StorageSelection
                                availableStorageOptions={getAvailableStorageOptions()}
                                selectedStorage={selectedStorage}
                                handleStorageSelect={handleStorageSelect}
                                isVariantInStock={isVariantInStock}
                                selectedColor={selectedColor}
                            />


                            <ColorSelection
                                availableColors={getAvailableColors()}
                                selectedColor={selectedColor}
                                handleColorSelect={handleColorSelect}
                                isVariantInStock={isVariantInStock}
                                selectedStorage={selectedStorage}
                            />


                            <ActionBar
                                handleAddToWishlist={handleAddToWishlist}
                                isInWishlist={isInWishlist}
                                handleAddToCart={handleAddToCart}
                                handleBuyNow={handleBuyNow}
                                selectedVariant={selectedVariant}
                                product={product}
                            />


                            {/* Call to Order */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <Phone size={24} className="text-blue-600 mr-3" />
                                    <div>
                                        <div className="text-sm">Gọi đặt mua: </div>
                                        <div className="text-xl font-bold text-blue-600">18003355</div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <Truck size={20} className="text-red-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium">Giao hàng miễn phí</p>
                                        <p className="text-gray-600">Với đơn hàng từ 2 triệu</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Shield size={20} className="text-red-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium">Bảo hành chính hãng</p>
                                        <p className="text-gray-600">12 tháng tại trung tâm bảo hành</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <CreditCard size={20} className="text-red-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium">Thanh toán linh hoạt</p>
                                        <p className="text-gray-600">Tiền mặt, chuyển khoản, trả góp</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Gift size={20} className="text-red-600 mr-2 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium">Nhiều ưu đãi hấp dẫn</p>
                                        <p className="text-gray-600">Quà tặng và khuyến mãi đi kèm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mt-12">
                        <Specifications specifications={product.specification} />
                        <Description description={product.description} />

                    </div>
                    <div className="mt-12">
                        <ReviewsSection productId={product.id} />

                    </div>

                </div>
            </section>

        </div>
    )
}
