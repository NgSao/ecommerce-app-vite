import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const Description = ({ description }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const truncatedDescription =
        description && description.length > 100
            ? description.substring(0, 200) + "..."
            : description;

    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-3.5 sm:mb-4">Mô tả sản phẩm</h3>
            <p className="leading-6 sm:leading-7 text-gray-700 text-sm sm:text-base">
                {showFullDescription ? description : truncatedDescription}
            </p>
            <button
                className="flex flex-row items-center justify-center mt-3.5 sm:mt-4 w-full"
                onClick={toggleDescription}
            >
                <p className="text-red-600 mr-1.25 sm:mr-2 text-sm sm:text-base">
                    {showFullDescription ? "Ẩn mô tả" : "Xem thêm mô tả"}
                </p>
                {showFullDescription ? (
                    <IoChevronUp className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                    <IoChevronDown className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
                )}
            </button>
        </div>
    );
};

export default Description;