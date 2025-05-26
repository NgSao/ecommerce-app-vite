import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoLogoGoogle, IoLogoFacebook } from "react-icons/io5";
import { POST_ADD } from "@api/apiService";

const BASE_URL = import.meta.env.VITE_API_URL || "http://172.16.12.131:8080";
const GOOGLE_AUTH_URL = `${BASE_URL}/api/v1/oauth2/authorization/google`;
const FACEBOOK_AUTH_URL = `${BASE_URL}/api/v1/oauth2/authorization/facebook`;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Validate email
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Vui lòng nhập email");
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Email không hợp lệ");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    };

    // Validate password
    const validatePassword = () => {
        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu");
            return false;
        } else if (password.length < 6) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            const success = await login(email, password);
            if (!success) {
                toast.error("Đăng nhập thất bại. Email hoặc mật khẩu không đúng.");
            }
        }
    };

    // Handle forgot password
    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Vui lòng nhập email trước khi tiếp tục.");
            return;
        }
        let flag = false;
        const formData = { email };
        if (window.confirm("Vui lòng xác nhận để nhận hướng dẫn đặt lại mật khẩu")) {
            try {
                const response = await POST_ADD("auth/send-otp", formData);
                if (response.status === 200) {
                    toast.success("Mã OTP đã được gửi đến email của bạn.");
                    navigate("/verify-email", { state: { email, flag } });
                } else {
                    toast.error("Không thể gửi mã OTP. Vui lòng thử lại.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Email không hợp lệ hoặc không tồn tại.");
            }
        }
    };

    // Handle Google Login
    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
        // Note: The redirect handling should be done in a callback route (e.g., /oauth/callback)
    };

    // Handle Facebook Login
    const handleFacebookLogin = () => {
        window.location.href = FACEBOOK_AUTH_URL;
        // Note: The redirect handling should be done in a callback route (e.g., /oauth/callback)
    };

    return (
        <div>
            <div className="bg-gray-100 border-b-2 border-gray-200 ">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
                    <span>Trang chủ / </span>
                    <span>Khách hàng thân thiết </span>
                </div>
            </div>
            <div className="container mx-auto mt-10 px-4">
                <div className="flex flex-col gap-4 justify-center items-center mb-10">
                    <img
                        src="https://minhtuanmobile.com/assets/front/img/khthanthiet-no-user-tuoi-20.png"
                        className="w-28 md:w-40"
                        alt="Logo"
                    />
                    <p className="text-xl md:text-2xl font-medium">
                        Đăng nhập <span>SN Mobile</span>
                    </p>
                    <p className="text-sm md:text-base text-gray-600">Đăng nhập để tiếp tục mua sắm</p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="w-full px-4 space-y-6 font-sans max-w-md mx-auto  pb-6 border-gray-300"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative mt-2">
                            <IoMailOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={validateEmail}
                                className="pl-10 pr-4 py-3 bg-white border-2 border-gray-300 w-full text-sm outline-none focus:border-red-700 rounded"
                                placeholder="Email"
                            />
                        </div>
                        {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <div className="relative mt-2">
                            <IoLockClosedOutline
                                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                                size={20}
                            />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                                className="pl-10 pr-12 py-3 bg-white border-2 border-gray-300 w-full text-sm outline-none focus:border-red-700 rounded"
                                placeholder="Mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                            </button>
                        </div>
                        {passwordError && <p className="text-red-600 text-xs mt-1">{passwordError}</p>}
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <input type="checkbox" className="w-4 h-4" />
                            <label className="text-sm ml-2 text-gray-700">Ghi nhớ</label>
                        </div>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className={`w-full px-4 py-3 mx-auto block text-lg rounded-lg font-bold text-white ${loading || !email || !password
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-700 hover:bg-red-800"
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                            "ĐĂNG NHẬP"
                        )}
                    </button>
                </form>

                <div className="max-w-md w-full px-4 mx-auto mt-4">
                    <div className="flex items-center justify-center my-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <p className="mx-4 text-gray-500 text-sm">HOẶC</p>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                        >
                            <IoLogoGoogle className="mr-2 text-red-600" size={20} />
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg text-sm hover:bg-gray-100"
                        >
                            <IoLogoFacebook className="mr-2 text-blue-600" size={20} />
                            Facebook
                        </button>
                    </div>

                    <div className="flex justify-center mt-6 gap-1">
                        <p className="text-sm text-gray-600">Chưa có tài khoản?</p>
                        <Link to="/register" className="text-sm text-red-600 font-bold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;