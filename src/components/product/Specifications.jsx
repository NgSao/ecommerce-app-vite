import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const Specifications = ({ specifications }) => {
    const [showAll, setShowAll] = useState(false);
    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const specificationArray = specifications
        ? specifications
            .split(/\.\s*/)
            .map((item) => {
                const [label, ...rest] = item.split(":");
                return label && rest.length > 0
                    ? {
                        label: label.trim(),
                        value: rest.join(":").trim(),
                    }
                    : null;
            })
            .filter(Boolean)
        : [];

    if (specificationArray.length === 0) return null;

    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-3.5 sm:mb-4">Thông số kỹ thuật</h3>
            {(showAll ? specificationArray : specificationArray.slice(0, 5)).map((spec, index) => (
                <div
                    key={index}
                    className="flex flex-row py-2 border-b border-gray-200 last:border-b-0"
                >
                    <p className="w-[30%] text-gray-600 text-sm sm:text-base">{spec.label}</p>
                    <p className="w-[70%] font-medium text-sm sm:text-base">{spec.value}</p>
                </div>
            ))}
            {specificationArray.length > 5 && (
                <button
                    className="flex flex-row items-center justify-center mt-3.5 sm:mt-4 w-full"
                    onClick={toggleShowAll}
                >
                    <p className="text-red-600 mr-1.25 sm:mr-2 text-sm sm:text-base">
                        {showAll ? "Ẩn bớt thông số" : "Xem thêm thông số"}
                    </p>
                    {showAll ? (
                        <IoChevronUp className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                        <IoChevronDown className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                </button>
            )}
        </div>
    );
};

export default Specifications;