import { useState, useRef, useEffect } from "react";

const ImageCarousel = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselRef = useRef(null);

    const handleScroll = () => {
        if (carouselRef.current) {
            const scrollPosition = carouselRef.current.scrollLeft;
            const imageWidth = carouselRef.current.clientWidth;
            const newIndex = Math.round(scrollPosition / imageWidth);
            setCurrentImageIndex(newIndex);
        }
    };

    const handleThumbnailClick = (index) => {
        if (carouselRef.current) {
            const imageWidth = carouselRef.current.clientWidth;
            carouselRef.current.scrollTo({
                left: index * imageWidth,
                behavior: "smooth",
            });
            setCurrentImageIndex(index);
        }
    };

    useEffect(() => {
        // Ensure correct image is shown on first render
        if (carouselRef.current) {
            carouselRef.current.scrollTo({
                left: currentImageIndex * carouselRef.current.clientWidth,
                behavior: "instant",
            });
        }
    }, [currentImageIndex]);

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-4 w-full max-w-[400px] mx-auto">
                <div className="relative mb-4 rounded-lg overflow-hidden bg-white">
                    <div
                        ref={carouselRef}
                        className="w-full overflow-x-auto snap-x snap-mandatory flex scroll-smooth no-scrollbar"
                        onScroll={handleScroll}
                    >
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-[300px] sm:h-[300px] md:h-[400px] object-contain snap-center flex-shrink-0"
                            />
                        ))}
                    </div>
                    <div className="flex flex-row justify-center mt-2.5">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full mx-1 ${currentImageIndex === index ? "bg-red-600" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg overflow-hidden cursor-pointer hover:border-red-600 ${currentImageIndex === index ? "border-red-600" : "border-gray-200"
                                }`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <img
                                src={image || "/placeholder.svg"}
                                alt={`Product thumbnail ${index + 1}`}
                                className="w-full h-[75px] sm:h-[100px] object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageCarousel;
