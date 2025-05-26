import { useAuth } from '@context/AuthContext';
import { useCart } from '@context/CartContext';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {
    GET_ALL,
    GET_GHN_SHIPPING_FEE,
    POST_ADD,
    POST_TOKEN,
    POST_VNPAY_CALLBACK,
    PUT_ID,
    GET_GHN_DISTRICTS,
    GET_GHN_WARDS,
    GET_OSRM_DIRECTIONS,
    GET_ID,
    GET_GHTK_SHIPPING_FEE,
    showError,
    showSuccess,
} from "@api/apiService";

import PolylineTools from "@mapbox/polyline";
import { formatPrice } from '@utils/formatUtils';
import ShippingAddressSection from '@component/checkout/ShippingAddressSection';
import OrderItemsSection from '@component/checkout/OrderItemsSection';
import PaymentMethodSection from '@component/checkout/PaymentMethodSection';
import OrderNoteSection from '@component/checkout/OrderNoteSection';
import PromoCodeSection from '@component/checkout/PromoCodeSection';
import ShippingProviderSection from '@component/checkout/ShippingProviderSection';
import OrderSummarySection from '@component/checkout/OrderSummarySection';
import PromoCodesModal from '@component/checkout/PromoCodesModal';
import MapWrapper from '@component/checkout/Map';

const STORE_LOCATION = {
    district_id: 1443, // Quận 7, TP.HCM
    ward_code: "20210", // Phường Tân Phú
    district_name: "Quận 2",
    ward_name: "Phường Thảo Điền",
    city: "TP. Hồ Chí Minh",
    coordinates: { latitude: 10.8087245, longitude: 106.7310773 }, // Replace with actual
};
export default function CheckoutPage() {
    const { state, search } = useLocation();
    const { cartItems,
        subtotal,
        discount: routeDiscount,
        appliedPromo } = state || {};
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const { clearCart } = useCart();
    const storeLocation = STORE_LOCATION;

    const [loading, setLoading] = useState(false);
    const [shipping, setShipping] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [note, setNote] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromoCode, setAppliedPromoCode] = useState(appliedPromo || null);
    const [promoCodeError, setPromoCodeError] = useState("");
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showPromoCodesModal, setShowPromoCodesModal] = useState(false);
    const [availablePromoCodes, setAvailablePromoCodes] = useState([]);
    const [loadingPromoCodes, setLoadingPromoCodes] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        phone: "",
        addressDetail: "",
        street: "",
        district: "",
        city: "",
        active: false,
    });
    const [showQr, setShowQr] = useState(false);
    const [qr, setQr] = useState("");
    const [districts, setDistricts] = useState([]);
    const [buyerLocation, setBuyerLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [OrderIdNow] = useState(`SN-${Date.now()}`)
    const [OrderNumber] = useState(OrderIdNow.split("-")[1])
    const pollingIntervalRef = useRef(null);
    const [shippingProvider, setShippingProvider] = useState("GHN");
    const [ghtkDeliveryOption, setGhtkDeliveryOption] = useState("xteam")
    const [routeDistance, setRouteDistance] = useState(null);


    const geocodeAddress = async (address) => {
        try {
            console.log("Địa chỉQuerr", address);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`
            );
            const data = await response.json();
            if (data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };


    const calculateDistance = (coords) => {
        const toRadians = (degrees) => degrees * Math.PI / 180;
        const R = 6371;

        let totalDistance = 0;

        for (let i = 0; i < coords.length - 1; i++) {
            const { latitude: lat1, longitude: lon1 } = coords[i];
            const { latitude: lat2, longitude: lon2 } = coords[i + 1];

            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
            const lat1Rad = toRadians(lat1);
            const lat2Rad = toRadians(lat2);

            const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            totalDistance += distance;
        }

        return totalDistance.toFixed(2);
    };


    useEffect(() => {
        if (isLoggedIn && user) {
            if (user.addresses && user.addresses.length > 0) {
                setAddresses(user.addresses);
                const defaultAddress = user.addresses.find((addr) => addr.active);
                setSelectedAddress(defaultAddress || user.addresses[0]);
            }
            fetchPromoCodes();
            fetchDistricts();
        }
    }, [isLoggedIn, user]);

    const normalizeAndClean = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\./g, "")
            .replace(/\b(phuong|xa|thi tran|ward|commune|town)\b/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };


    const normalizeString = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD") // chuẩn hóa tiếng Việt (loại dấu)
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/\./g, "") // xóa dấu chấm
            .replace(/\s+/g, " ") // thay nhiều khoảng trắng bằng một
            .trim();
    };

    useEffect(() => {
        if (selectedAddress && districts.length > 0) {
            const fetchShippingData = async () => {
                try {

                    const normalizedInputDistrict = normalizeString(selectedAddress.district);
                    const district = districts.find((d) => {
                        const normalizedDistrictName = normalizeString(d.DistrictName);
                        const nameExtensions = d.NameExtension || [];
                        const inputInDistrictName = normalizedDistrictName.includes(normalizedInputDistrict);
                        const inputInExtension = nameExtensions.some((name) =>
                            normalizeString(name).includes(normalizedInputDistrict)
                        );
                        return inputInDistrictName || inputInExtension;
                    });
                    if (!district) {
                        alert("Lỗi", "Không thể xác định quận/huyện.");
                        setShipping(0);
                        setRouteDistance(null);
                        return;
                    }

                    const wards = await GET_GHN_WARDS({ district_id: district.DistrictID });

                    const normalizedInputWard = normalizeString(selectedAddress.street);

                    const ward = wards.find((w) => {
                        const normalizedWardName = normalizeAndClean(w.WardName);
                        const nameExtensions = w.NameExtension || [];

                        const matchInWardName =
                            normalizedWardName.includes(normalizedInputWard) ||
                            normalizedInputWard.includes(normalizedWardName);

                        const matchInExtension = nameExtensions.some((name) => {
                            const cleaned = normalizeAndClean(name);
                            return (
                                cleaned.includes(normalizedInputWard) ||
                                normalizedInputWard.includes(cleaned)
                            );
                        });

                        return matchInWardName || matchInExtension;
                    });



                    if (!ward) {
                        alert("Lỗi", "Không thể xác định phường/xã.");
                        setShipping(0);
                        setRouteDistance(null);
                        return;
                    }


                    const addressString = `${selectedAddress.addressDetail}, ${selectedAddress.street}, ${selectedAddress.district}, ${selectedAddress.city}`;
                    let coordinates = await geocodeAddress(addressString);
                    setBuyerLocation({
                        district_id: district.DistrictID,
                        ward_code: ward.WardCode,
                        district_name: district.DistrictName,
                        ward_name: ward.WardName,
                        city: selectedAddress.city,
                        coordinates: coordinates || {
                            latitude: 10.8087245,
                            longitude: 106.7310773,
                        },
                    });

                    const fee = await calculateShippingFee(district.DistrictID, ward.WardCode);
                    setShipping(fee);

                    if (coordinates) {
                        const polyline = await GET_OSRM_DIRECTIONS(STORE_LOCATION.coordinates, coordinates);
                        const decodedPoints = PolylineTools.decode(polyline);
                        const route = decodedPoints.map((point) => ({
                            latitude: point[0],
                            longitude: point[1],
                        }));
                        setRouteCoordinates(route);
                        const totalDistance = calculateDistance(route);
                        setRouteDistance(totalDistance);

                    }
                } catch (error) {
                    console.error("Error fetching shipping data:", error);
                    setShipping(0);
                    setRouteDistance(null);
                }
            };
            fetchShippingData();
        }
    }, [selectedAddress, districts, shippingProvider, ghtkDeliveryOption]);
    const fetchDistricts = async () => {
        try {
            const response = await GET_GHN_DISTRICTS();
            setDistricts(response);

        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchPromoCodes = async () => {
        if (!isLoggedIn) return;
        try {
            setLoadingPromoCodes(true);
            const response = await GET_ALL("promotions");
            if (response.status === 200) {
                setAvailablePromoCodes(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching promo codes:", error);
        } finally {
            setLoadingPromoCodes(false);
        }
    };

    const calculateShippingFee = async (toDistrictId, toWardCode) => {
        if (!selectedAddress || !toDistrictId || !toWardCode) return 0;
        try {
            const totalWeight = cartItems.reduce(
                (total, item) => total + (item.weight || 200) * item.quantity,
                0
            );
            const totalValue = calculateSubtotal();

            if (shippingProvider === "GHTK") {
                let provinceFormat = selectedAddress.city.toLowerCase() === "thủ đức" ? "TP. Hồ Chí Minh" : selectedAddress.city;

                const payload = {
                    pick_province: STORE_LOCATION.city,
                    pick_district: STORE_LOCATION.district_name,
                    pick_ward: STORE_LOCATION.ward_name,
                    province: provinceFormat,
                    district: selectedAddress.district,
                    ward: selectedAddress.street,
                    weight: Math.round(totalWeight),
                    value: Math.round(totalValue),
                    deliver_option: ghtkDeliveryOption,
                    tags: [],
                };

                const response = await GET_GHTK_SHIPPING_FEE(payload);

                if (response.success) {
                    const totalFee = response.fee.fee + (response.fee.insurance_fee || 0) +
                        (response.fee.extFees?.reduce((sum, fee) => sum + fee.amount, 0) || 0);
                    setShipping(totalFee);
                    return totalFee;
                } else {
                    showError("GHTK delivery not supported or error:", response.message);
                    return 0;
                }
            } else {
                const dimensions = {
                    length: Math.max(...cartItems.map((item) => item.length || 20)),
                    width: Math.max(...cartItems.map((item) => item.width || 20)),
                    height: Math.max(...cartItems.map((item) => item.height || 50)),
                };

                const hoChiMinhVariants = [
                    "Hồ Chí Minh",
                    "TP.Hồ Chí Minh",
                    "TP. Hồ Chí Minh",
                    "TP Hồ Chí Minh",
                    "Thành phố Hồ Chí Minh",
                    "HCM",
                    "hochiminh",
                    "saigon",
                    "sg",
                    "thu duc",
                    "Thủ Đức",
                    "Ho Chi Minh",
                    "ho chi minh"
                ];
                const inputCity = selectedAddress.city.trim().toLowerCase();

                const isHoChiMinh = hoChiMinhVariants.some(
                    (name) => name.toLowerCase() === inputCity
                );

                const serviceId = isHoChiMinh ? 53320 : 53321;
                const payload = {
                    from_district_id: STORE_LOCATION.district_id,
                    from_ward_code: STORE_LOCATION.ward_code,
                    service_id: serviceId,
                    service_type_id: null,
                    to_district_id: toDistrictId,
                    to_ward_code: toWardCode,
                    height: Math.round(dimensions.height),
                    length: Math.round(dimensions.length),
                    weight: Math.round(totalWeight),
                    width: Math.round(dimensions.width),
                    insurance_value: Math.round(calculateSubtotal()),
                    cod_failed_amount: paymentMethod === "cod" ? calculateSubtotal() : 0,
                    coupon: null,
                };

                const response = await GET_GHN_SHIPPING_FEE(payload);
                return response.total || 0;
            }

        } catch (error) {
            console.error("Error calculating shipping fee:", error);
            showError("Không thể tính phí vận chuyển.");
            return 0;
        }
    };

    const calculatePromoDiscount = () => {
        if (routeDiscount) return routeDiscount;
        if (!appliedPromoCode || calculateSubtotal() < appliedPromoCode.minOrderValue) return 0;
        let discount = 0;
        if (appliedPromoCode.discountType === "percentage") {
            discount = (calculateSubtotal() * appliedPromoCode.discountValue) / 100;
            if (appliedPromoCode.maxDiscount) {
                discount = Math.min(discount, appliedPromoCode.maxDiscount);
            }
        } else if (appliedPromoCode.discountType === "fixed") {
            discount = appliedPromoCode.discountValue;
        }
        return discount;
    };

    const calculateSubtotal = () => {
        if (subtotal) return subtotal;
        return subtotal.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + (shipping || 0) - calculatePromoDiscount();
    };

    const formatExpiryDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };


    const applyPromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoCodeError("Vui lòng nhập mã giảm giá");
            return;
        }
        try {
            setLoading(true);
            const formData = { orderTotal: calculateSubtotal() };
            const response = await PUT_ID("promotions/apply", promoCode, formData);
            if (response.status === 200) {
                setAppliedPromoCode(response.data.data);
                setPromoCodeError("");
                setPromoCode("");
            } else {
                setPromoCodeError(response.error);
            }
        } catch (error) {
            console.error(error);
            setPromoCodeError("Mã giảm giá không hợp lệ.");
        } finally {
            setLoading(false);
        }
    };

    const removePromoCode = () => {
        setAppliedPromoCode(null);
    };

    const selectPromoCode = async (code) => {
        setPromoCode(code.code);
        setShowPromoCodesModal(false);
        try {
            setLoading(true);
            const formData = {
                orderTotal: calculateSubtotal()
            };
            const response = await PUT_ID("promotions/apply", code.code, formData);
            if (response.status === 200) {
                setAppliedPromoCode(response.data.data);
                setPromoCodeError("");
                setPromoCode("");
            } else {
                setPromoCodeError(response.error);
            }
        } catch (error) {
            console.error(error);
            setPromoCodeError("Mã giảm giá không hợp lệ.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = () => {
        if (
            !newAddress.fullName ||
            !newAddress.phone ||
            !newAddress.addressDetail ||
            !newAddress.city
        ) {
            showError("Vui lòng điền đầy đủ thông tin địa chỉ");
            return;
        }
        const newAddressList = [...addresses, { ...newAddress, id: Date.now().toString() }];
        setAddresses(newAddressList);
        setSelectedAddress(newAddressList[newAddressList.length - 1]);
        setShowAddAddress(false);
        setNewAddress({
            fullName: "",
            phone: "",
            addressDetail: "",
            street: "",
            district: "",
            city: "",
            active: false,
        });
    };

    useEffect(() => {
        if (showQr) {
            startPolling();
        } else {
            stopPolling();
        }
        return () => stopPolling();
    }, [showQr, paymentMethod]);

    const startPolling = () => {
        if (pollingIntervalRef.current) {
            console.log("Polling already active, skipping new interval");
            return;
        }
        const maxPollingTime = 5 * 60 * 1000; // 5 minutes
        const pollingInterval = 5000; // 5 seconds
        const startTime = Date.now();

        pollingIntervalRef.current = setInterval(async () => {
            if (Date.now() - startTime > maxPollingTime) {
                stopPolling();
                setShowQr(false);
                alert("Thông báo", "Hết thời gian chờ thanh toán. Vui lòng thử lại.");
                return;
            }
            const response = await GET_ID("sepay/check", OrderNumber);
            if (response.status === 200) {
                stopPolling();
                setShowQr(false);
                const orderData = localStorage.getItem("pendingOrder");
                const parsedOrderData = JSON.parse(orderData);
                try {
                    const orderResponse = await POST_TOKEN("user/create-order", token, parsedOrderData);
                    if (orderResponse.status === 200) {
                        clearCart();
                        localStorage.removeItem('pendingOrder');
                        showSuccess(
                            `Thanh toán thành công. Đơn hàng ${orderResponse.data.data.orderId} đã được tạo.`
                        );
                        navigate('/');
                        return;
                    } else {
                        alert("Lỗi", orderResponse.error || "Đã có lỗi xảy ra khi tạo đơn hàng");
                    }
                } catch (error) {
                    stopPolling();
                    setShowQr(false);
                    console.error("Error creating order:", error);
                    alert("Lỗi", "Đã có lỗi xảy ra khi tạo đơn hàng");
                }
            }
        }, pollingInterval);
    };
    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, []);

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    const handlePlaceOrder = async () => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để tiếp tục thanh toán');
            navigate('/login');
            return;
        }
        if (!selectedAddress) {
            alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        try {
            setLoading(true);
            const orderData = {
                userId: user.id,
                items: cartItems.map((item) => ({
                    productId: item.id,
                    colorId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.color,
                    storage: item.storage,
                    imageUrl: item.image,
                })),
                shipping: {
                    method: shippingProvider === "GHTK"
                        ? `Giao Hàng Tiết Kiệm (${ghtkDeliveryOption === "xteam" ? "Giao Nhanh" : "Giao Thường"})`
                        : "Giao Hàng Nhanh",
                    fee: shipping,
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    addressDetail: `${selectedAddress.addressDetail}, ${selectedAddress.district}, ${selectedAddress.city}`,
                    from_location: `${STORE_LOCATION.district_name}, ${STORE_LOCATION.ward_name}, ${STORE_LOCATION.city}`,
                    to_location: buyerLocation
                        ? `${buyerLocation.district_name}, ${buyerLocation.ward_name}, ${buyerLocation.city}`
                        : `${selectedAddress.district}, ${selectedAddress.street}, ${selectedAddress.city}`,
                },
                payment: {
                    method: paymentMethod,
                    status: paymentMethod === "cod" ? "Chưa thanh toán" : "Đã thanh toán",
                },
                promoCode: appliedPromo ? appliedPromo.code : appliedPromoCode ? appliedPromoCode.code : null,
                discount: calculatePromoDiscount(),
                total: calculateTotal(),
                note,
            };

            if (paymentMethod === "vnpay") {
                const formVnPay = {
                    amount: calculateTotal(),
                    orderId: OrderIdNow,
                    returnUrl: "http://localhost:8080/api/v1/public/vnpay/callback",
                    ipAddr: "127.0.0.1",
                };
                const paymentResponse = await POST_ADD("vnpay/payment", formVnPay);
                if (paymentResponse.status === 200 && paymentResponse.data.data.paymentUrl) {
                    localStorage.setItem("pendingOrder", JSON.stringify(orderData));
                    window.location.href = paymentResponse.data.data.paymentUrl;
                } else {
                    alert("Thông báo", "Không thể tạo thanh toán qua VNPay");
                }
            } else if (paymentMethod === "momo") {
                const momoData = {
                    amount: calculateTotal(),
                    orderId: OrderIdNow,
                    ipAddr: "127.0.0.1",
                };
                const paymentResponse = await POST_ADD("momo/payment", momoData);
                if (paymentResponse.status === 200 && paymentResponse.data.data.paymentUrl) {
                    localStorage.setItem("pendingOrder", JSON.stringify(orderData));
                    window.location.href = paymentResponse.data.data.paymentUrl;
                } else {
                    alert("Thông báo", "Không thể tạo thanh toán qua MoMo");
                }
            } else if (paymentMethod === "zalopay") {
                const zaloData = {
                    amount: calculateTotal(),
                    orderId: OrderIdNow,
                };
                const paymentResponse = await POST_ADD("zalopay/payment", zaloData);
                if (paymentResponse.status === 200 && paymentResponse.data.data.paymentUrl) {
                    localStorage.setItem("pendingOrder", JSON.stringify(orderData));
                    window.location.href = paymentResponse.data.data.paymentUrl;
                } else {
                    alert("Thông báo", "Không thể tạo thanh toán qua ZaloPay");
                }
            } else if (paymentMethod === "bank") {
                const sePayData = {
                    amount: calculateTotal(),
                    orderId: OrderIdNow,
                    virtualAccount: "SEPSN29064"
                };
                const paymentResponse = await POST_ADD("sepay/payment", sePayData);
                if (paymentResponse.status === 200 && paymentResponse.data.data.qrUrl) {
                    setQr(paymentResponse.data.data.qrUrl);
                    setShowQr(true);
                    localStorage.setItem("pendingOrder", JSON.stringify(orderData));
                    startPolling()
                } else {
                    alert("Thông báo", "Không thể tạo thanh toán qua SePay");
                }
            } else {
                const response = await POST_TOKEN("user/create-order", token, orderData);
                if (response.status === 200) {
                    clearCart();
                    showSuccess(
                        `Thanh toán thành công. Đơn hàng ${response.data.data.orderCode} đã được tạo.`
                    );
                    navigate('/');
                } else {
                    alert("Lỗi", response.error || "Đã có lỗi xảy ra khi đặt hàng");
                }
            }
        } catch (error) {
            console.error("Place order error:", error);
            alert("Lỗi", "Đã có lỗi xảy ra khi đặt hàng");
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        const handlePaymentCallback = async () => {
            const url = window.location.href;
            const queryParams = new URLSearchParams(search);
            const paramsObj = {};
            queryParams.forEach((value, key) => {
                paramsObj[key] = value;
            });

            const orderData = localStorage.getItem('pendingOrder');
            if (!orderData) {
                return;
            }
            const parsedOrderData = JSON.parse(orderData);

            try {
                let response;
                if (url.includes('vnpay/callback')) {
                    const formDataCallback = {
                        vnpayParams: paramsObj,
                        orderDTO: parsedOrderData,
                    };
                    response = await POST_VNPAY_CALLBACK('vnpay/callback', formDataCallback);
                    if (response.status === 200) {
                        if (response.data.data.status === 'failed') {
                            showError('Thanh toán không thành công.');
                            return;
                        }
                        clearCart();
                        localStorage.removeItem('pendingOrder');
                        showSuccess(
                            `Thanh toán thành công. Đơn hàng ${response.data.data.orderCode} đã được tạo.`
                        );
                        navigate('/');
                    } else {
                        showError(`Lỗi: ${response.message || 'Thanh toán không thành công'}`);
                    }
                } else if (url.includes('momo/callback')) {
                    const formDataCallback = {
                        momoParams: paramsObj,
                        orderDTO: parsedOrderData,
                    };
                    response = await POST_VNPAY_CALLBACK('momo/callback', formDataCallback);
                    if (response.status === 200 && response.data.status === 'success') {
                        clearCart();
                        localStorage.removeItem('pendingOrder');
                        showSuccess(
                            `Thanh toán thành công. Đơn hàng ${response.data.data.orderCode} đã được tạo.`
                        );
                        navigate('/');
                    } else {
                        showError(
                            `Thanh toán không thành công: ${response.data.message || 'Lỗi không xác định'}`
                        );
                    }
                } else if (url.includes('zalopay/callback')) {
                    const formDataCallback = {
                        zalopayParams: paramsObj,
                        orderDTO: parsedOrderData,
                    };
                    response = await POST_VNPAY_CALLBACK('zalopay/callback', formDataCallback);
                    if (response.status === 200 && response.data.status === 'success') {
                        clearCart();
                        localStorage.removeItem('pendingOrder');
                        showSuccess(
                            `Thanh toán thành công. Đơn hàng ${response.data.data.orderCode} đã được tạo.`
                        );
                        navigate('/');
                    } else {
                        showError(
                            `Thanh toán không thành công: ${response.data.message || 'Lỗi không xác định'}`
                        );
                    }
                }
            } catch (error) {
                console.error('Payment callback error:', error);
                window.alert(`Lỗi: Đã có lỗi xảy ra khi xử lý thanh toán (${url.includes('vnpay') ? 'VNPay' : url.includes('momo') ? 'MoMo' : 'ZaloPay'})`);
            }
        };

        if (search.includes('vnpay/callback') || search.includes('momo/callback') || search.includes('zalopay/callback')) {
            handlePaymentCallback();
        }
    }, [search, navigate, clearCart]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gray-100 border-b-2 border-gray-200 ">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
                    <span>Trang chủ / </span>
                    <span>Thanh toán </span>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-4 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ShippingAddressSection
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                            showAddAddress={showAddAddress}
                            setShowAddAddress={setShowAddAddress}
                            newAddress={newAddress}
                            setNewAddress={setNewAddress}
                            handleAddAddress={handleAddAddress}
                        />
                        {storeLocation?.coordinates && buyerLocation?.coordinates && (
                            <MapWrapper
                                storeCoordinates={storeLocation.coordinates}
                                buyerCoordinates={buyerLocation.coordinates}
                                routeCoordinates={routeCoordinates}
                            />
                        )}



                        <OrderItemsSection cartItems={cartItems} />
                        <PaymentMethodSection
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />
                        <OrderNoteSection note={note} setNote={setNote} />



                    </div>
                    <div className="lg:col-span-1">
                        <PromoCodeSection
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            appliedPromoCode={appliedPromoCode}
                            promoCodeError={promoCodeError}
                            applyPromoCode={applyPromoCode}
                            removePromoCode={removePromoCode}
                            setShowPromoCodesModal={setShowPromoCodesModal}
                            calculatePromoDiscount={calculatePromoDiscount}
                            setPromoCodeError={setPromoCodeError}
                            loading={loading}
                        />
                        <ShippingProviderSection
                            shippingProvider={shippingProvider}
                            setShippingProvider={setShippingProvider}
                            ghtkDeliveryOption={ghtkDeliveryOption}
                            setGhtkDeliveryOption={setGhtkDeliveryOption}
                        />
                        <OrderSummarySection
                            calculateSubtotal={calculateSubtotal}
                            calculateShippingFee={shipping}
                            calculatePromoDiscount={calculatePromoDiscount}
                            calculateTotal={calculateTotal}
                            appliedPromoCode={appliedPromoCode}
                            shippingProvider={shippingProvider}
                            ghtkDeliveryOption={ghtkDeliveryOption}
                            routeDistance={routeDistance}
                            handlePlaceOrder={handlePlaceOrder}
                            loading={loading}
                        />

                    </div>
                </div>
                <PromoCodesModal
                    showPromoCodesModal={showPromoCodesModal}
                    setShowPromoCodesModal={setShowPromoCodesModal}
                    availablePromoCodes={availablePromoCodes}
                    loadingPromoCodes={loadingPromoCodes}
                    selectPromoCode={selectPromoCode}
                    formatExpiryDate={formatExpiryDate}
                />
                {showQr && (
                    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-11/12 sm:w-96">
                            <h3 className="text-lg font-bold text-center mb-4">
                                Quét mã QR để thanh toán
                            </h3>
                            <img
                                src={qr}
                                alt="QR Code"
                                className="w-48 h-48 mx-auto mb-4"
                            />
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">Ngân hàng:</span> OCB
                                </p>
                                <p>
                                    <span className="font-semibold">Tên tài khoản:</span>{' '}
                                    NGUYEN SAO
                                </p>
                                <p>
                                    <span className="font-semibold">Số tiền:</span>{' '}
                                    {formatPrice(calculateTotal())}
                                </p>
                                <p>
                                    <span className="font-semibold">Nội dung:</span> SN
                                    {OrderNumber}
                                </p>
                            </div>
                            <button
                                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    setShowQr(false);
                                    stopPolling();
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
