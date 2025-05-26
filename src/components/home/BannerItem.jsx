import { GET_ALL } from '@api/apiService';
import React, { useState, useEffect } from 'react';

function BannerItem() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const bannersResponse = await GET_ALL("banners");
                if (bannersResponse.status === 200) {
                    setBanners(bannersResponse.data.data);
                }
            } catch (error) {
                console.error("Error fetching banners: ", error);
            }
        })();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 500);

        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div className="flex justify-center w-full mb-4">
            {banners.length > 0 && (
                <img
                    src={`${banners[currentImageIndex].imageUrl}`}
                    alt={`Banner ${currentImageIndex + 1}`}
                    className="w-full h-[150px] sm:h-[280px] md:h-[250] object-fill transition-all duration-700 ease-in-out"
                />
            )}
        </div>

    );
}

export default BannerItem;
