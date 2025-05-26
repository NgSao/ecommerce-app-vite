import { IoCameraOutline, IoClose, IoCloseCircle, IoStar, IoStarOutline } from "react-icons/io5";

const WriteReviewModal = ({
    reviewModalVisible,
    setReviewModalVisible,
    userReview,
    setUserReview,
    selectedImages,
    pickImages,
    removeImage,
    submitReview,
    loading,
}) => {
    return (
        <>
            {reviewModalVisible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="w-[90%] max-w-lg bg-white rounded-lg p-5 sm:p-6 max-h-[80%] overflow-y-auto">
                        <div className="flex flex-row justify-between items-center mb-5">
                            <h3 className="text-lg sm:text-xl font-bold">Viết đánh giá</h3>
                            <button onClick={() => setReviewModalVisible(false)}>
                                <IoClose className="text-gray-700 w-6 h-6 sm:w-7 sm:h-7" />
                            </button>
                        </div>
                        <div className="w-full">
                            <p className="text-base sm:text-lg mb-2.5">Đánh giá của bạn:</p>
                            <div className="flex flex-row justify-center mb-5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setUserReview({ ...userReview, rating: star })}
                                        className="mx-1.25 sm:mx-2"
                                    >
                                        {star <= userReview.rating ? (
                                            <IoStar className="text-yellow-400 w-8 h-8 sm:w-9 sm:h-9" />
                                        ) : (
                                            <IoStarOutline className="text-yellow-400 w-8 h-8 sm:w-9 sm:h-9" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-base sm:text-lg mb-2.5">Nhận xét của bạn:</p>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 text-sm sm:text-base h-24 resize-none"
                                placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này..."
                                value={userReview.comment}
                                onChange={(e) =>
                                    setUserReview({ ...userReview, comment: e.target.value })
                                }
                            />
                            <p className="text-base sm:text-lg mb-2.5 mt-5">
                                Thêm hình ảnh (tối đa 5 ảnh):
                            </p>
                            <div className="flex flex-row flex-wrap mb-5 gap-2.5">
                                {selectedImages.map((img, index) => (
                                    <div key={index} className="relative mr-2.5 mb-2.5">
                                        <img
                                            src={img.dataUrl}
                                            alt={`Selected ${index}`}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <button
                                            className="absolute -top-2 -right-2 bg-white rounded-full"
                                            onClick={() => removeImage(index)}
                                        >
                                            <IoCloseCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                    </div>
                                ))}
                                {selectedImages.length < 5 && (
                                    <label className="w-20 h-20 border border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            multiple
                                            onChange={pickImages}
                                            className="hidden"
                                        />
                                        <IoCameraOutline className="text-gray-600 w-6 h-6 sm:w-7 sm:h-7" />
                                        <p className="text-gray-600 text-xs sm:text-sm mt-1.25">
                                            Thêm ảnh
                                        </p>
                                    </label>
                                )}
                            </div>
                            <button
                                className="w-full bg-red-600 py-3 sm:py-4 rounded-lg text-center disabled:opacity-50"
                                onClick={submitReview}
                                disabled={loading}
                            >
                                <p className="text-white font-bold text-base sm:text-lg">
                                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WriteReviewModal;