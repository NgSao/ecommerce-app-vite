import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
export const CustomNextArrow = ({ onClick }) => (
    <div
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10 cursor-pointer"
        onClick={onClick}
    >
        <FaChevronRight className="text-black text-lg" />
    </div>
);

export const CustomPrevArrow = ({ onClick }) => (
    <div
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10 cursor-pointer"
        onClick={onClick}
    >
        <FaChevronLeft className="text-black text-lg" />
    </div>
);