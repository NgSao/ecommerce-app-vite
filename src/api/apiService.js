import axios from "axios";
import { toast } from "react-toastify";

// Validate environment variables
const requiredEnvVars = [
    "VITE_API_URL",
    "VITE_GHN_API_URL",
    "VITE_GHN_API_KEY",
    "VITE_GHN_API_SECRET",
    "VITE_OSRM_API_URL",
    "VITE_GHTK_API_URL",
    "VITE_GHTK_TOKEN",
    "VITE_PARTNER_CODE",
];
requiredEnvVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
        console.error(`${varName} is not defined in .env.local`);
    }
});

const API_URL = import.meta.env.VITE_API_URL;
export const API_URL_WEBSOCKER = `${API_URL}/public/chat-websocket`;
export const API_URL_NOTIFICATION = `${API_URL}/public/notification-websocket`;

const GHN_API_URL = import.meta.env.VITE_GHN_API_URL;
const GHN_API_KEY = import.meta.env.VITE_GHN_API_KEY;
const GHN_API_SECRET = import.meta.env.VITE_GHN_API_SECRET;
const OSRM_API_URL = import.meta.env.VITE_OSRM_API_URL;
const GHTK_API_URL = import.meta.env.VITE_GHTK_API_URL;
const GHTK_TOKEN = import.meta.env.VITE_GHTK_TOKEN;
const PARTNER_CODE = import.meta.env.VITE_PARTNER_CODE;

// Notification functions using react-toastify
export const showError = (message) => {
    toast.error(message || "Đã có lỗi xảy ra", {
        position: "top-right",
        autoClose: 3000,
    });
};

export const showSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
    });
};

// Public API Calls (No Token Required)
async function callApiUser(endpoint, method = "GET", body, params = {}) {
    const config = {
        method,
        url: `${API_URL}/public/${endpoint}`,
        data: body,
        params,
    };

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        const errorMessage = e.response?.data?.message || "Lỗi không xác định";
        console.error(`Error in ${method} ${endpoint}:`, e);
        throw new Error(errorMessage);
    }
}

export function GET_ALL(endpoint) {
    return callApiUser(endpoint, "GET");
}

export function GET_ALL_PAGE(endpoint, params = {}) {
    return callApiUser(endpoint, "GET", null, params);
}

export function GET_ID(endpoint, id) {
    return callApiUser(`${endpoint}/${id}`, "GET");
}

export function PUT_ID(endpoint, id, data) {
    return callApiUser(`${endpoint}/${id}`, "PUT", data);
}

export function GET_SEARCH(endpoint, params = {}) {
    return callApiUser(endpoint, "GET", null, params);
}

export function POST_ADD(endpoint, data) {
    return callApiUser(endpoint, "POST", data);
}

export function DELETE_ID(endpoint, id) {
    return callApiUser(`${endpoint}/${id}`, "DELETE");
}

export function POST_VNPAY_CALLBACK(endpoint, data) {
    return callApiUser(endpoint, "POST", data);
}

// Admin API Calls (Token Required)
async function callApiAdmin(endpoint, method = "GET", body, params = {}) {
    const token = localStorage.getItem("_tk");
    const config = {
        method,
        url: `${API_URL}/admin/${endpoint}`,
        data: body,
        params,
        headers: {},
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        console.error(`Error in ${method} ${endpoint}:`, e);
        const errorMessage = e.response?.data?.message || "Lỗi khi gọi API admin";
        throw new Error(errorMessage);
    }
}

export function ADMIN_GET_ALL(endpoint) {
    return callApiAdmin(endpoint, "GET");
}

export function ADMIN_GET_SEARCH(endpoint, params = {}) {
    return callApiAdmin(endpoint, "GET", null, params);
}

export function ADMIN_GET_ID(endpoint, id) {
    return callApiAdmin(`${endpoint}/${id}`, "GET");
}

export function ADMIN_PUT_ID(endpoint, id, data) {
    return callApiAdmin(`${endpoint}/${id}`, "PUT", data);
}

export function ADMIN_GET_ALL_PAGE(endpoint, params = {}) {
    return callApiAdmin(endpoint, "GET", null, params);
}

export function ADMIN_POST_ADD(endpoint, data) {
    return callApiAdmin(endpoint, "POST", data);
}

export function ADMIN_DELETE_ID(endpoint, id) {
    return callApiAdmin(`${endpoint}/${id}`, "DELETE");
}

export function ADMIN_POST_UPLOAD(endpoint, id, data, config) {
    return callApiAdminUpload(`${endpoint}/${id}`, "POST", data, config);
}

async function callApiAdminUpload(endpoint, method = "GET", body, customConfig = {}) {
    const token = localStorage.getItem("_tk");
    const config = {
        method,
        url: `${API_URL}/admin/${endpoint}`,
        data: body,
        headers: {
            ...(customConfig.headers || {}),
        },
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        console.error(`Error in ${method} ${endpoint}:`, e);
        const errorMessage = e.response?.data?.message || "Lỗi khi upload dữ liệu admin";
        throw new Error(errorMessage);
    }
}

// User API Calls with Token
async function callApiUserWithToken(endpoint, method = "GET", token, body, params = {}) {
    const config = {
        method,
        url: `${API_URL}/${endpoint}`,
        data: body,
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        const errorMessage = e.response?.data?.message || "Lỗi không xác định";
        console.error(`Error in ${method} ${endpoint}:`, e);
        throw new Error(errorMessage);
    }
}

export function GET_TOKEN(endpoint, token) {
    return callApiUserWithToken(endpoint, "GET", token);
}

export function GET_TOKEN_ID(endpoint, id, token) {
    return callApiUserWithToken(`${endpoint}/${id}`, "GET", token);
}

export function PUT_TOKEN(endpoint, id, token, data) {
    return callApiUserWithToken(`${endpoint}/${id}`, "PUT", token, data);
}

export function POST_TOKEN(endpoint, token, body = {}) {
    return callApiUserWithToken(endpoint, "POST", token, body);
}

export function DELETE_TOKEN(endpoint, id, token) {
    return callApiUserWithToken(`${endpoint}/${id}`, "DELETE", token);
}

export function USER_POST_UPLOAD(endpoint, data, config) {
    return callApiUsernUpload(endpoint, "POST", data, config);
}

async function callApiUsernUpload(endpoint, method = "GET", body, customConfig = {}) {
    const token = localStorage.getItem("_tk");
    const config = {
        method,
        url: `${API_URL}/${endpoint}`,
        data: body,
        headers: {
            ...(customConfig.headers || {}),
        },
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        console.error(`Error in ${method} ${endpoint}:`, e);
        const errorMessage = e.response?.data?.message || "Lỗi khi upload dữ liệu người dùng";
        throw new Error(errorMessage);
    }
}

// Chat API Calls
async function callApiChat(endpoint, method = "GET", body, params = {}) {
    const token = localStorage.getItem("_tk");
    const config = {
        method,
        url: `${API_URL}/public/chat/${endpoint}`,
        data: body,
        params,
        headers: {},
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        const errorMessage = e.response?.data?.message || "Lỗi không xác định";
        console.error(`Error in ${method} ${endpoint}:`, e);
        throw new Error(errorMessage);
    }
}

export function CHAT_GET_ALL(endpoint) {
    return callApiChat(endpoint, "GET");
}

export function CHAT_GET_SEARCH(endpoint, params = {}) {
    return callApiChat(endpoint, "GET", null, params);
}

export function CHAT_GET_ID(endpoint, id) {
    return callApiChat(`${endpoint}/${id}`, "GET");
}

export function CHAT_PUT_ID(endpoint, id, data) {
    return callApiChat(`${endpoint}/${id}`, "PUT", data);
}

export function CHAT_GET_ALL_PAGE(endpoint, params = {}) {
    return callApiChat(endpoint, "GET", null, params);
}

export function CHAT_POST_ADD(endpoint, data) {
    return callApiChat(endpoint, "POST", data);
}

export function CHAT_DELETE_ID(endpoint, id) {
    return callApiChat(`${endpoint}/${id}`, "DELETE");
}

export function CHAT_POST_PARAMS(endpoint, params = {}) {
    return callApiChat(endpoint, "POST", null, params);
}

// Notification API Calls
async function callApiNotification(endpoint, method = "GET", body, params = {}) {
    const token = localStorage.getItem("_tk");

    const config = {
        method,
        url: `${API_URL}/public/notifications/${endpoint}`,
        data: body,
        params,
        headers: {},
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axios(config);
        return response;
    } catch (e) {
        const errorMessage = e.response?.data?.message || "Lỗi không xác định";
        console.error(`Error in ${method} ${endpoint}:`, e);
        throw new Error(errorMessage);
    }
}

export function NOTIFICATION_GET_ID(endpoint, id) {
    return callApiNotification(`${endpoint}/${id}`, "GET");
}

export function NOTIFICATION_GET_ALL(endpoint) {
    return callApiNotification(endpoint, "GET");
}

export function NOTIFICATION_DELETE_ID(endpoint, id) {
    return callApiNotification(`${endpoint}/${id}`, "DELETE");
}

// GHN API Calls
export async function GET_GHN_SHIPPING_FEE(payload) {
    const config = {
        method: "POST",
        url: `${GHN_API_URL}/v2/shipping-order/fee`,
        data: payload,
        headers: {
            Token: GHN_API_KEY,
            ShopId: GHN_API_SECRET,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios(config);
        if (response.data.code === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "GHN API error");
        }
    } catch (error) {
        console.error("Error fetching GHN shipping fee:", error);
        throw new Error("Không thể tính phí vận chuyển");
    }
}

export async function GET_GHN_DISTRICTS() {
    const config = {
        method: "GET",
        url: `${GHN_API_URL}/master-data/district`,
        headers: { Token: GHN_API_KEY },
    };
    try {
        const response = await axios(config);
        if (response.data.code === 200) {
            return response.data.data;
        }
        throw new Error(response.data.message || "GHN API error");
    } catch (error) {
        console.error("Error fetching GHN districts:", error);
        throw new Error("Không thể lấy danh sách quận/huyện");
    }
}

export async function GET_GHN_WARDS(district_id_obj) {
    const config = {
        method: "GET",
        url: `${GHN_API_URL}/master-data/ward`,
        params: district_id_obj,
        headers: {
            Token: GHN_API_KEY,
        },
    };

    try {
        const response = await axios(config);
        if (response.data.code === 200) {
            return response.data.data;
        }
        throw new Error(response.data.message || "GHN API error");
    } catch (error) {
        console.error("Error fetching GHN wards:", error);
        throw new Error("Không thể lấy danh sách phường/xã");
    }
}

// OSRM API Calls
export async function GET_OSRM_DIRECTIONS(origin, destination) {
    const config = {
        method: "GET",
        url: `${OSRM_API_URL}/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`,
        params: {
            overview: "full",
            geometries: "polyline",
        },
    };
    try {
        const response = await axios(config);
        if (response.data.code === "Ok" && response.data.routes.length > 0) {
            return response.data.routes[0].geometry;
        }
        throw new Error(response.data.message || "OSRM API error");
    } catch (error) {
        console.error("Error fetching OSRM directions:", error);
        throw new Error("Không thể lấy tuyến đường");
    }
}

// GHTK API Calls
export const GET_GHTK_SHIPPING_FEE = async (params) => {
    try {
        const response = await axios.get(`${GHTK_API_URL}/services/shipment/fee`, {
            headers: {
                Token: GHTK_TOKEN,
            },
            params: {
                ...params,
            },
        });
        console.log("respose", response)
        return response.data;

    } catch (error) {
        console.error("GHTK API error:", error);
        throw new Error("Lỗi khi gọi API GHTK");
    }
};

// Store Settings (Mock API)
export const getStoreSettings = async () => {
    return {
        success: true,
        data: {
            storeName: "Minh Tuấn Mobile",
            storeEmail: "contact@minhtuanmobile.com",
            storePhone: "1900 1234",
            storeAddress: "123 Đường ABC, Quận 1, TP.HCM",
            storeLogo: "https://via.placeholder.com/200x200?text=MT+Mobile",
            storeDescription: "Cửa hàng điện thoại di động và phụ kiện chính hãng",
            notifications: {
                email: true,
                orders: true,
                stock: true,
                promotions: true,
            },
            shipping: {
                methods: [
                    { id: 1, name: "Giao hàng tiêu chuẩn", price: 30000, enabled: true },
                    { id: 2, name: "Giao hàng nhanh", price: 45000, enabled: true },
                    { id: 3, name: "Giao hàng hỏa tốc", price: 60000, enabled: false },
                ],
                freeShippingThreshold: 500000,
            },
            payment: {
                methods: [
                    { id: 1, name: "Thanh toán khi nhận hàng (COD)", enabled: true },
                    { id: 2, name: "Chuyển khoản ngân hàng", enabled: true },
                    { id: 3, name: "Ví điện tử (MoMo, ZaloPay)", enabled: true },
                    { id: 4, name: "Thẻ tín dụng/ghi nợ", enabled: false },
                ],
            },
        },
    };
};

export const updateStoreSettings = async (settingsData) => {
    return {
        success: true,
        data: settingsData,
    };
};



export const reverseGeocodeAsync = async ({ latitude, longitude }) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: "json",
                    addressdetails: 1,
                    zoom: 18,
                }

            }
        );
        const { address } = response.data;
        return {
            name: address.road || address.quarter || address.pedestrian || "",
            sublocality: address.suburb || address.village || address.hamlet || "",
            administrative_area_level_2: address.county || address.city || "", // District
            administrative_area_level_1: address.state || address.city || "", // City
        };

    } catch (error) {
        console.error("Lỗi khi dịch ngược tọa độ:", error);
        throw new Error("Không thể lấy địa chỉ từ tọa độ");
    }
};


export const forwardGeocodeAsync = async (query) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
                params: {
                    q: query,
                    format: "json",
                    addressdetails: 1,
                    limit: 1,
                }

            }
        );

        if (response.data.length === 0) {
            throw new Error("Không tìm thấy địa chỉ");
        }

        const place = response.data[0];
        const { address } = place;
        return {
            latitude: parseFloat(place.lat),
            longitude: parseFloat(place.lon),
            name: address.road || address.quarter || address.pedestrian || "",
            sublocality: address.suburb || address.village || address.hamlet || "",
            administrative_area_level_2: address.county || address.city || "",
            administrative_area_level_1: address.state || address.city || "",
        };
    } catch (error) {
        console.error("Lỗi khi tìm kiếm địa chỉ:", error);
        throw new Error("Không thể tìm kiếm địa chỉ");
    }
};