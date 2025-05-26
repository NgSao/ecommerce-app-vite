import React from 'react'

function Footer() {
    return (
        <div className="hidden md:block mt-10 bg-white border-t-2 border-t-gray-200 w-full">
            <div className='container mx-auto flex flex-col md:flex-row flex-wrap md:justify-between justify-center items-center md:items-start gap-10 pb-20 pt-20 text-center md:text-left'>

                {/* Logo + contact */}
                <div className="w-full md:w-[calc(33%-1rem)] lg:w-auto ">
                    <img src='https://minhtuanmobile.com/assets/front/img/logo.png?240904' className="w-52 mx-auto md:mx-0" />
                    <div className='pt-4'>
                        <p className='text-gray-500 text-base'>Địa chỉ: 123 Lê Văn Việt</p>
                        <p className='text-gray-500 text-base'>Điện thoại: 0392445255</p>
                        <p className='text-gray-500 text-base'>Email: minhthuanmobile@gmail.com</p>
                    </div>
                </div>

                {/* Lặp lại menu */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-full md:w-[calc(33%-1rem)] lg:w-auto">
                        <div className='pt-2 text-2xl font-medium'>Về chúng tôi</div>
                        <div>
                            <p className='text-gray-500 text-base'>Giới thiệu</p>
                            <p className='text-gray-500 text-base'>Cửa hàng</p>
                            <p className='text-gray-500 text-base'>Danh mục</p>
                            <p className='text-gray-500 text-base'>Tin tức</p>
                        </div>
                    </div>
                ))}

                {/* Tải app */}
                <div className="w-full md:w-[calc(33%-1rem)] lg:w-auto">
                    <div className='pt-2 text-2xl font-medium mb-4'>Tải app</div>
                    <div className="flex flex-col gap-2 items-center md:items-start">
                        <img src='https://minhtuanmobile.com/assets/front/img/logo.png?240904' className="w-52" />
                        <img src='https://minhtuanmobile.com/assets/front/img/logo.png?240904' className="w-52" />
                    </div>

                </div>
            </div>

            {/* Footer bottom */}
            <div className='p-10 bg-white border-t-2 border-t-gray-200'>
                <div className='container mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
                    <div>
                        © 2024 Ecommerce. <span className='text-red-700'>SaoNguyen</span>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className="text-sm">Phương thức thanh toán</span>
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                src='https://th.bing.com/th/id/R.ba6a009d3c0f8e699e7f4ac0a5694145?rik=jisEQviFEcvliw&pid=ImgRaw&r=0'
                                className='w-10 h-6'
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
