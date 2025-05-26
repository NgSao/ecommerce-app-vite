// src/pages/EditAddressPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { POST_TOKEN, GET_GHN_DISTRICTS, GET_GHN_WARDS, reverseGeocodeAsync, GET_OSRM_DIRECTIONS, forwardGeocodeAsync } from "@api/apiService";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AddressForm from "@component/address/AddressForm";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const EditAddressPage = () => {
    const { token, user, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = location.state || {};
    const [formData, setFormData] = useState({
        id: address?.id || "",
        fullName: address?.fullName || "",
        phone: address?.phone || "",
        addressDetail: address?.addressDetail || "",
        street: address?.street || "",
        district: address?.district || address?.ward || "",
        city: address?.city || "",
        active: address?.active || false,
        latitude: address?.latitude || null,
        longitude: address?.longitude || null,
    });
    const [errors, setErrors] = useState({});
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mapCenter, setMapCenter] = useState(
        address?.latitude && address?.longitude
            ? [address.latitude, address.longitude]
            : [10.7769, 106.7009]
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [districts, setDistricts] = useState([]);


    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const districtData = await GET_GHN_DISTRICTS();
                setDistricts(districtData || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách quận/huyện:", error);
                toast.error("Không thể tải danh sách quận/huyện.");
            }
        };
        fetchDistricts();
    }, []);



    const normalizeString = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD") // chuẩn hóa tiếng Việt (loại dấu)
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/\./g, "") // xóa dấu chấm
            .replace(/\s+/g, " ") // thay nhiều khoảng trắng bằng một
            .trim();
    };

    const normalizeAndClean = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
            .replace(/\./g, "") // bỏ dấu chấm
            .replace(/\b(phuong|xa|thi tran|ward|commune|town)\b/g, "") // bỏ các từ loại
            .replace(/\s+/g, " ") // nhiều khoảng trắng => 1
            .trim();
    };



    const validateAddressWithGHN = async (district, street) => {
        try {

            const normalizedInputDistrict = normalizeString(district);
            const normalizedInputWard = normalizeString(street);

            if (!normalizedInputDistrict || !normalizedInputWard) {
                toast.error("Quận/huyện hoặc phường/xã không hợp lệ.");
                return false;
            }

            const matchedDistrict = districts.find((d) => {
                const normalizedDistrictName = normalizeString(d.DistrictName);
                const nameExtensions = d.NameExtension || [];
                const inputInDistrictName = normalizedDistrictName.includes(normalizedInputDistrict);
                const inputInExtension = nameExtensions.some((name) =>
                    normalizeString(name).includes(normalizedInputDistrict)
                );
                return inputInDistrictName || inputInExtension;
            });

            if (!matchedDistrict) {
                toast.error(`Quận/huyện "${district}" không hợp lệ. Vui lòng chọn lại.`);
                return false;
            }

            const wards = await GET_GHN_WARDS({ district_id: matchedDistrict.DistrictID });
            if (!wards || !Array.isArray(wards)) {
                toast.error("Không thể tải danh sách phường/xã.");
                return false;
            }

            const matchedWard = wards.find((w) => {
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
            if (!matchedWard) {
                toast.error(
                    `Phường/xã "${street}" không hợp lệ cho quận/huyện "${district}". Vui lòng chọn lại.`
                );
                return false;
            }

            return true;
        } catch (error) {
            console.error("Lỗi khi xác minh địa chỉ với GHN:", error);
            toast.error("Không thể xác minh địa chỉ. Vui lòng thử lại.");
            return false;
        }
    };

    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        try {
            if (!navigator.geolocation) {
                toast.error("Trình duyệt không hỗ trợ định vị.");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const address = await reverseGeocodeAsync({ latitude, longitude });
                        const newFormData = {
                            ...formData,
                            addressDetail: address.name || "",
                            street: address.sublocality || "",
                            district: address.administrative_area_level_2 || "",
                            city: address.administrative_area_level_1 || "",
                            latitude,
                            longitude,
                        };

                        const isValid = await validateAddressWithGHN(newFormData.district, newFormData.street);

                        if (isValid) {
                            setFormData(newFormData);
                            setMapCenter([latitude, longitude]);
                        }
                    } catch (error) {
                        console.error("Lỗi khi xác định vị trí:", error);
                        toast.error("Không thể lấy địa chỉ từ vị trí hiện tại.");
                    } finally {
                        setIsLoadingLocation(false);
                    }
                },
                () => {
                    toast.error("Quyền truy cập vị trí bị từ chối.");
                    setIsLoadingLocation(false);
                }
            );
        } catch (error) {
            console.error("Lỗi khi lấy vị trí:", error);
            toast.error("Không thể lấy vị trí hiện tại.");
            setIsLoadingLocation(false);
        }
    };


    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast.error("Vui lòng nhập địa chỉ để tìm kiếm.");
            return;
        }
        try {
            const place = await forwardGeocodeAsync(searchQuery);
            console.log("ass", place);
            const newFormData = {
                ...formData,
                addressDetail: place.name || "",
                street: place.sublocality || "",
                district: place.administrative_area_level_2 || "",
                city: place.administrative_area_level_1 || "",
                latitude: place.latitude,
                longitude: place.longitude,
            };

            const isValid = await validateAddressWithGHN(newFormData.district, newFormData.street);
            if (isValid) {
                setFormData(newFormData);
                setMapCenter([place.latitude, place.longitude]);
                setSearchQuery(place.name);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm địa chỉ:", error);
            toast.error("Không tìm thấy địa chỉ.");
        }
    };

    const handleMarkerDrag = async (event) => {
        const { lat, lng } = event.target.getLatLng();
        try {
            const address = await reverseGeocodeAsync({ latitude: lat, longitude: lng });
            const newFormData = {
                ...formData,
                addressDetail: address.name || "",
                street: address.sublocality || "",
                district: address.administrative_area_level_2 || "",
                city: address.administrative_area_level_1 || "",
                latitude: lat,
                longitude: lng,
            };

            const isValid = await validateAddressWithGHN(newFormData.district, newFormData.street);
            if (isValid) {
                setFormData(newFormData);
                setMapCenter([lat, lng]);
            }
        } catch (error) {
            console.error("Lỗi khi tìm địa chỉ:", error);
            toast.error("Không thể lấy địa chỉ từ vị trí đã chọn.");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập tên người nhận";
        if (!formData.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^\d{10,11}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }
        if (!formData.addressDetail.trim()) newErrors.addressDetail = "Vui lòng nhập địa chỉ";
        if (!formData.street.trim()) newErrors.street = "Vui lòng nhập phường/xã";
        if (!formData.district.trim()) newErrors.district = "Vui lòng nhập quận/huyện";
        if (!formData.city.trim()) newErrors.city = "Vui lòng nhập tỉnh/thành phố";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        if (!token) {
            toast.error("Bạn cần đăng nhập để cập nhật địa chỉ.");
            navigate("/login");
            return;
        }

        const isValid = await validateAddressWithGHN(formData.district, formData.street);
        if (!isValid) {
            toast.error("Địa chỉ không hợp lệ. Vui lòng kiểm tra lại.");
            return;
        }

        setIsSaving(true);
        try {
            const response = await POST_TOKEN("address/updated", token, {
                ...formData,
                latitude: formData.latitude || undefined,
                longitude: formData.longitude || undefined,
            });
            if (response.status === 200) {
                const updatedAddress = response.data.data;
                const updatedAddresses = (user.addresses || []).map((addr) =>
                    addr.id === updatedAddress.id ? updatedAddress : addr
                );
                updateUser({ ...user, addresses: updatedAddresses });
                toast.success("Địa chỉ đã được cập nhật.");
                navigate("/account/shipping-addresses");
            } else {
                toast.error(response.data?.message || "Không thể cập nhật địa chỉ.");
            }
        } catch (error) {
            const errorMessage = error.message || "Đã xảy ra lỗi khi cập nhật địa chỉ.";
            if (errorMessage.includes("JWT")) {
                toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
                navigate("/login");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const isFormValid = () =>
        formData.fullName.trim() &&
        formData.phone.trim() &&
        /^\d{10,11}$/.test(formData.phone) &&
        formData.addressDetail.trim() &&
        formData.street.trim() &&
        formData.district.trim() &&
        formData.city.trim();

    // Component to update map view
    const MapViewUpdater = ({ center }) => {
        const map = useMap();
        map.setView(center, 15);
        return null;
    };

    return (

        <div className="md:col-span-4 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa địa chỉ</h2>
            <AddressForm
                formData={formData}
                onChange={handleChange}
                errors={errors}
                onGetLocation={getCurrentLocation}
                isLoadingLocation={isLoadingLocation}
            />

            <div className="mt-4 flex items-center gap-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập địa chỉ để tìm kiếm (VD: 123 Nguyễn Thị Minh Khai, Quận 1)"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                    onClick={handleSearch}
                    className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Tìm kiếm
                </button>
            </div>

            {isLoadingLocation ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    <p className="mt-2 text-gray-600">Đang tải vị trí...</p>
                </div>
            ) : formData.latitude && formData.longitude ? (
                <div className="mt-4">
                    <MapContainer
                        center={mapCenter}
                        zoom={15}
                        style={{ height: "300px", width: "100%", borderRadius: "8px" }}
                    >
                        <MapViewUpdater center={mapCenter} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={[formData.latitude, formData.longitude]}
                            draggable={true}
                            eventHandlers={{ dragend: handleMarkerDrag }}
                        />

                    </MapContainer>
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={getCurrentLocation}
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Định vị lại
                        </button>

                    </div>

                </div>
            ) : (
                <p className="text-center text-gray-600 mt-4">
                    Nhấn "Lấy vị trí hiện tại" hoặc tìm kiếm để xem bản đồ
                </p>
            )}

            <button
                onClick={handleSave}
                disabled={!isFormValid() || isSaving}
                className={`mt-4 w-full py-3 rounded-lg text-white font-medium ${isFormValid() && !isSaving
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                    } transition-colors`}
            >
                {isSaving ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
        </div>

    );
};

export default EditAddressPage;