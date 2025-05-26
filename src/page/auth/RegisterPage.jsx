import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [fullName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // Validate name
    const validateName = () => {
        if (!fullName) {
            setNameError("Vui lòng nhập họ tên");
            return false;
        } else {
            setNameError("");
            return true;
        }
    };

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

    // Validate phone
    const validatePhone = () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            setPhoneError("Vui lòng nhập số điện thoại");
            return false;
        } else if (!phoneRegex.test(phone)) {
            setPhoneError("Số điện thoại không hợp lệ");
            return false;
        } else {
            setPhoneError("");
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
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
            setPasswordError("Mật khẩu phải có ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };

    // Validate confirm password
    const validateConfirmPassword = () => {
        if (!confirmPassword) {
            setConfirmPasswordError("Vui lòng xác nhận mật khẩu");
            return false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError("Mật khẩu xác nhận không khớp");
            return false;
        } else {
            setConfirmPasswordError("");
            return true;
        }
    };

    // Handle register
    const handleRegister = async (e) => {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
            const userData = {
                fullName,
                email,
                phone,
                password,
            };
            const success = await register(userData);
            let flag = true;
            if (success) {
                toast.success("Đăng ký thành công! Vui lòng xác minh email.");
                navigate("/verify-email", { state: { email, flag } });
            } else {
                toast.error("Đăng ký thất bại. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div>
            <div className="bg-gray-100 border-b-2 border-gray-200 ">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4">
                    <span>Trang chủ / </span>
                    <span>Đăng ký </span>
                </div>
            </div>
            <div className="container mx-auto mt-10">
                <div className="flex flex-col gap-4 justify-center items-center mb-10">
                    <img
                        src="https://static.minhtuanmobile.com/assets/front/img/khthanthiet-no-user-tuoi-20.png"
                        className="w-28 md:w-40"
                        alt="Logo"
                    />
                    <p className="text-xl md:text-2xl font-medium">
                        Đăng ký tài khoản <span>SN Mobile</span>
                    </p>
                    <p className="text-sm md:text-base text-gray-600">Tạo tài khoản để mua sắm dễ dàng hơn</p>
                </div>

                <form onSubmit={handleRegister}
                    className="w-full px-4 space-y-6 font-sans max-w-md mx-auto  pb-6 border-gray-300"
                >
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Họ tên
                        </label>
                        <div className="relative mt-2">
                            <IoPersonOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={validateName}
                                className="pl-10 pr-4 py-3 bg-white border-2 border-gray-300 w-full text-sm outline-none focus:border-red-700 rounded"
                                placeholder="Họ tên"
                            />
                        </div>
                        {nameError && <p className="text-red-600 text-xs mt-1">{nameError}</p>}
                    </div>

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
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                        </label>
                        <div className="relative mt-2">
                            <IoCallOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={validatePhone}
                                className="pl-10 pr-4 py-3 bg-white border-2 border-gray-300 w-full text-sm outline-none focus:border-red-700 rounded"
                                placeholder="Số điện thoại"
                            />
                        </div>
                        {phoneError && <p className="text-red-600 text-xs mt-1">{phoneError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <div className="relative mt-2">
                            <IoLockClosedOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative mt-2">
                            <IoLockClosedOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={validateConfirmPassword}
                                className="pl-10 pr-12 py-3 bg-white border-2 border-gray-300 w-full text-sm outline-none focus:border-red-700 rounded"
                                placeholder="Xác nhận mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                            </button>
                        </div>
                        {confirmPasswordError && <p className="text-red-600 text-xs mt-1">{confirmPasswordError}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !fullName || !email || !phone || !password || !confirmPassword}
                        className={`w-full px-4 py-3 mx-auto block text-lg rounded-lg font-bold text-white ${loading || !fullName || !email || !phone || !password || !confirmPassword
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-700 hover:bg-red-800"
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                            "ĐĂNG KÝ"
                        )}
                    </button>
                </form>

                <div className="max-w-md mx-auto mt-6 flex justify-center gap-1">
                    <p className="text-sm text-gray-600">Đã có tài khoản?</p>
                    <Link to="/login" className="text-sm text-red-600 font-bold hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;