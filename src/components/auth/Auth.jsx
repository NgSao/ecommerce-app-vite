import { useAuth } from '@context/AuthContext'
import React from 'react'
import { Link } from 'react-router-dom';

export default function Auth() {
    const { user, token } = useAuth()


    return (
        <div className="hidden md:flex basis-1/5  flex-row items-center cursor-pointer gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-red-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {!token ? (
                <Link to='/login'>
                    <div>
                        <div className="text-xs font-bold hover:text-red-700">Tài khoản</div>
                        <div className="text-xs font-medium  text-red-700">Đăng nhập</div>
                    </div>
                </Link>
            ) : (
                <Link to='/account'>
                    <div>
                        <div className="text-xs font-bold hover:text-red-700">Tài khoản</div>
                        <div className="text-xs font-medium  text-red-700">{user?.fullName}</div>
                    </div>
                </Link>
            )}
        </div>
    )
}
