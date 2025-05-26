import React, { useState, useEffect } from 'react'
import { useCart } from '@context/CartContext';
import { useNavigate } from 'react-router-dom';
import { GET_ALL } from '@api/apiService';
import { formatPrice } from '@utils/formatUtils';
import CartItem from '@component/cart/CartItem';
import PromoCodeSection from '@component/cart/PromoCodeSection';
import SummarySection from '@component/cart/SummarySection';
import EmptyCart from '@component/cart/EmptyCart';

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, calculateSubtotal, updateQuantity, removeItem } = useCart()
    const [promoCode, setPromoCode] = useState("")
    const [promoData, setPromoData] = useState(null)
    const [appliedPromo, setAppliedPromo] = useState(null)
    const [promoError, setPromoError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await GET_ALL("promotions")
            if (response.status === 200) {
                setPromoData(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching promo codes:", error)
        } finally {
            setLoading(false)
        }
    }

    const calculateDiscount = () => {
        if (!appliedPromo) return 0;
        const subtotal = calculateSubtotal();
        if (appliedPromo.discountType === 'percentage') {
            const discount = subtotal * (appliedPromo.discountValue / 100);
            return Math.min(discount, appliedPromo.maxDiscount);
        }
        return appliedPromo.discountValue;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const incrementQuantity = (index) => {
        const currentQuantity = cartItems[index].quantity;
        updateQuantity(index, currentQuantity + 1);
    };

    const decrementQuantity = (index) => {
        const currentQuantity = cartItems[index].quantity;
        if (currentQuantity <= 1) {
            removeItem(index);
        } else {
            updateQuantity(index, currentQuantity - 1);
        }
    };

    const applyPromoCode = () => {
        setPromoError('');
        if (!promoCode.trim()) {
            setPromoError('Vui lòng nhập mã giảm giá');
            return;
        }

        const foundPromo = promoData.find((promo) => promo.code.toUpperCase() === promoCode.trim().toUpperCase());

        if (!foundPromo) {
            setPromoError('Mã giảm giá không hợp lệ');
            return;
        }

        if (!foundPromo.active) {
            setPromoError('Mã giảm giá không còn hiệu lực');
            return;
        }

        const now = new Date();
        const expiryDate = new Date(foundPromo.expiryDate);
        if (now > expiryDate) {
            setPromoError('Mã giảm giá đã hết hạn');
            return;
        }

        const subtotal = calculateSubtotal();
        if (subtotal < foundPromo.minOrderValue) {
            setPromoError(`Đơn hàng tối thiểu ${formatPrice(foundPromo.minOrderValue)} để áp dụng mã này`);
            return;
        }

        setAppliedPromo(foundPromo);
        setPromoCode('');
        alert(`Thành công: Đã áp dụng mã giảm giá "${foundPromo.code}": ${foundPromo.description}`);
    };

    const removePromoCode = () => {
        setAppliedPromo(null);
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="w-10 h-10 border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                <p className="mt-2.5 text-base text-gray-600">Đang tải dữ liệu...</p>
            </div>
        )
    }



    return (
        <div >
            <div className="bg-gray-100 border-b-2 border-gray-200 ">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
                    <span>Trang chủ / </span>
                    <span>Giỏ hàng </span>
                </div>
            </div>
            <section className="py-6">
                <div className="container mx-auto px-4">
                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b border-b-gray-300 font-medium">
                                        Sản phẩm trong giỏ hàng ({cartItems.length})
                                    </div>
                                    {cartItems.map((item, index) => (
                                        <CartItem
                                            key={`${item.id}-${item.color || ''}-${item.storage || ''}-${item.size || ''}`}
                                            item={item}
                                            index={index}
                                            incrementQuantity={incrementQuantity}
                                            decrementQuantity={decrementQuantity}
                                            removeItem={removeItem}
                                        />
                                    ))}
                                    <PromoCodeSection
                                        promoCode={promoCode}
                                        setPromoCode={setPromoCode}
                                        appliedPromo={appliedPromo}
                                        promoError={promoError}
                                        applyPromoCode={applyPromoCode}
                                        removePromoCode={removePromoCode}
                                        calculateDiscount={calculateDiscount}
                                    />
                                </div>

                            </div>
                            <div className='lg:col-span-1'>
                                <SummarySection
                                    calculateSubtotal={calculateSubtotal}
                                    calculateDiscount={calculateDiscount}
                                    calculateTotal={calculateTotal}
                                    appliedPromo={appliedPromo}
                                    navigate={navigate}
                                    cartItems={cartItems}
                                />

                            </div>

                        </div>
                    ) : (
                        <EmptyCart />
                    )}
                </div>
            </section>

        </div>
    )
}
