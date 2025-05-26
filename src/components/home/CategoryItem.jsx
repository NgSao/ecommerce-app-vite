import { GET_ALL } from '@api/apiService';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CategoryItem() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMenu, setOpenMenu] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const categoriesResponse = await GET_ALL("categories");
            if (categoriesResponse.status === 200) {
                setCategories(categoriesResponse.data.data);
            }
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 justify-center items-center bg-gray-100">
                <div className="mt-2 text-base text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="bg-red-700 p-1 hidden md:flex flex-row">
            <div className="container mx-auto flex flex-row items-center">
                <ul className="hidden md:flex flex-row py-2 cursor-pointer">
                    <li className="flex flex-row items-center relative mr-14 hover:duration-300 group">
                        <Link to='/products'>
                            <div className="text-base ml-1 text-white">Tất cả sản phẩm</div>
                        </Link>

                    </li>
                    {categories.map(category => (
                        <li
                            key={category.id}
                            className="flex flex-row items-center relative mr-14 hover:duration-300 group "
                            onClick={() => setOpenMenu(openMenu === category.id ? null : category.id)}
                            onMouseEnter={() => setOpenMenu(category.id)}
                            onMouseLeave={() => setOpenMenu(null)}
                        >
                            <img src={category.imageUrl} className="w-7 h-auto" />
                            <div className="text-base ml-1 text-white">{category.name}</div>
                            {category.children.length > 0 && openMenu === category.id && (
                                <ul className="absolute top-full pt-0.5 left-0 w-48 bg-white text-black shadow-md border border-gray-200 rounded-sm p-2 z-10">
                                    {category.children.map(child => (
                                        <li
                                            key={child.id}
                                            className="py-1 px-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <Link to={`/products/${child.slug}`} className="block w-full">
                                                {child.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </li>


                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CategoryItem;