import React from "react";
import { Link } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import { FaBirthdayCake } from "react-icons/fa";
import { useAuth } from '@context/AuthContext';

export default function ProfilePage() {
    const { user } = useAuth();


    return (
        <div className="md:col-span-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center gap-4">
                <img
                    src={
                        user.profileImageUrl ||
                        "https://media.istockphoto.com/id/1204449006/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-avatar-line-red-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng-h%C3%ACnh-minh-h%E1%BB%8Da-vector-ki%E1%BB%83u-ph%E1%BA%B3ng-m%C3%A0u-%C4%91%E1%BB%8F.jpg?s=612x612&w=0&k=20&c=5K2ccYprzYJPLkzD7JmVCxSRpk3yATnO_kzKmb1dOkw="
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                />
                <p className="text-xl font-medium text-red-700">{user.fullName}</p>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-20">
                    <div className="flex flex-col items-center">
                        <MdOutlinePayment className="text-red-700 size-8" />
                        <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                        <p className="text-red-700 font-medium">13,599,000đ</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaBirthdayCake className="text-red-700 size-8" />
                        <p className="text-sm text-gray-600">Sinh nhật</p>
                        <p className="text-red-700 font-medium">{user.birthday || "29/06/2004"}</p>
                    </div>
                </div>
                <Link
                    to="/edit-profile"
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Chỉnh sửa hồ sơ
                </Link>
            </div>

        </div>

    );
}