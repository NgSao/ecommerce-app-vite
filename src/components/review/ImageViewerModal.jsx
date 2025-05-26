import { IoClose } from "react-icons/io5";

const ImageViewerModal = ({ imageViewerVisible, setImageViewerVisible, selectedViewImage }) => {
    return (
        <>
            {imageViewerVisible && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                    <button
                        className="absolute top-10 right-5 sm:right-10 z-10"
                        onClick={() => setImageViewerVisible(false)}
                    >
                        <IoClose className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                    {selectedViewImage && (
                        <img
                            src={selectedViewImage}
                            alt="Full screen view"
                            className="w-full h-[80%] object-contain"
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default ImageViewerModal;