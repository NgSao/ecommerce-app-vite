import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, loading } = useAuth();

    const { email, flag } = location.state || {};

    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(180);
    const [canResend, setCanResend] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(3);

    const inputRefs = useRef([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Handle input change
    const handleInputChange = (text, index) => {
        if (text.length > 1) {
            const digits = text.split("").slice(0, 6);
            const newVerificationCode = [...verificationCode];

            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newVerificationCode[index + i] = digit;
                }
            });

            setVerificationCode(newVerificationCode);

            const nextIndex = Math.min(index + digits.length, 5);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
        } else {
            const newVerificationCode = [...verificationCode];
            newVerificationCode[index] = text;
            setVerificationCode(newVerificationCode);

            if (text !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.key === "Backspace" && index > 0 && verificationCode[index] === "") {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const code = verificationCode.join("");

        if (code.length !== 6) {
            toast.error("Vui lòng nhập đủ 6 chữ số mã xác thực");
            return;
        }

        const success = await verifyEmail(email, code, flag);

        if (success) {
            if (flag) {
                toast.success("Xác thực email thành công. Vui lòng đăng nhập để tiếp tục.");
                navigate("/login");
            } else {
                toast.success("Xác thực thành công! Vui lòng kiểm tra email để nhận mật khẩu mới");
                navigate("/app");
            }
        } else {
            if (attemptsLeft > 1) {
                setAttemptsLeft(attemptsLeft - 1);
                toast.error(`Mã xác thực không đúng. Bạn còn ${attemptsLeft - 1} lần thử.`);
            } else {
                toast.error("Bạn đã nhập sai quá 3 lần. Vui lòng gửi lại mã xác thực.");
                navigate("/app");
            }
        }
    };

    // Handle resend code
    const handleResendCode = () => {
        if (!canResend) return;

        // Reset timer and disable resend button
        setTimer(60);
        setCanResend(false);

        // In a real app, this would call an API to resend the verification code
        toast.info("Mã xác thực mới đã được gửi đến email của bạn");

        // Start countdown again
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    return (
        <div>
            <div className="bg-gray-100 border-b-2 border-gray-200">
                <div className="container mx-auto px-4 py-2 md:px-8 md:py-4 text-sm md:text-base">
                    <span>Trang chủ / </span>
                    <span>Xác thực email</span>
                </div>
            </div>

            <div className="container mx-auto mt-10 px-4">
                <div className="flex flex-col gap-4 justify-center items-center mb-10">
                    <img
                        src="https://static.minhtuanmobile.com/assets/front/img/khthanthiet-no-user-tuoi-20.png"
                        className="w-24 sm:w-28 md:w-32 lg:w-40"
                        alt="Logo"
                    />
                    <p className="text-xl sm:text-2xl font-medium text-center">
                        Xác thực email <span className="text-red-600">SN Mobile</span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 text-center max-w-md">
                        Vui lòng nhập mã xác thực 6 chữ số đã được gửi đến email <span className="font-semibold">{email}</span>
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="flex gap-2 sm:gap-3 justify-between mb-8">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                type="text"
                                value={digit}
                                onChange={(e) => handleInputChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyPress(e, index)}
                                maxLength={1}
                                className="w-10 sm:w-12 md:w-14 h-12 sm:h-14 border-2 border-gray-300 rounded text-center text-2xl font-bold outline-none focus:border-red-700"
                                inputMode="numeric"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading || verificationCode.join("").length !== 6}
                        className={`w-full px-4 py-3 block text-base sm:text-lg rounded-lg font-bold text-white mb-6 ${loading || verificationCode.join("").length !== 6
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-700 hover:bg-red-800"
                            }`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                            "XÁC THỰC"
                        )}
                    </button>

                    <div className="flex justify-center items-center gap-1 mb-8 text-sm">
                        <p className="text-gray-600">Không nhận được mã?</p>
                        {canResend ? (
                            <button onClick={handleResendCode} className="text-red-600 font-bold hover:underline">
                                Gửi lại mã
                            </button>
                        ) : (
                            <p className="text-gray-500">Gửi lại sau {timer}s</p>
                        )}
                    </div>

                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 mx-auto text-sm text-red-600 font-bold hover:underline">
                        <IoArrowBack size={18} />
                        Quay lại
                    </button>
                </div>
            </div>
        </div>

    );
};

export default VerifyEmailPage;