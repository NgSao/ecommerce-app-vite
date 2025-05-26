import { useState, useEffect } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import ReviewItem from "@component/review/ReviewItem";
import { useAuth } from "@context/AuthContext";
import { GET_ID, POST_TOKEN, USER_POST_UPLOAD } from "@api/apiService";
import OverallRating from "@component/review/OverallRating";
import RatingFilters from "@component/review/RatingFilters";
import ImageViewerModal from "@component/review/ImageViewerModal";
import SortOptions from "@component/review/SortOptions";
import WriteReviewModal from "@component/review/WriteReviewModal";
import { useNavigate } from "react-router-dom"; // Assuming React Router for navigation

const ReviewsSection = ({ productId }) => {
    const { isLoggedIn, token } = useAuth();
    const navigate = useNavigate(); // For web navigation

    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [sortOption, setSortOption] = useState("newest");
    const [ratingFilter, setRatingFilter] = useState(0);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [userReview, setUserReview] = useState({ rating: 5, comment: "" });
    const [reviewStats, setReviewStats] = useState({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedViewImage, setSelectedViewImage] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await GET_ID("reviews/product", productId);
            if (response.status === 200) {
                setReviews(response.data.data.reviews || []);
                setReviewStats({
                    average: response.data.data.average || 0,
                    total: response.data.data.total || 0,
                    distribution: response.data.data.distribution || {
                        5: 0,
                        4: 0,
                        3: 0,
                        2: 0,
                        1: 0,
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            alert("Không thể tải đánh giá. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredAndSortedReviews = () => {
        let filtered = [...reviews];
        if (ratingFilter > 0) {
            filtered = filtered.filter((review) => review.rating === ratingFilter);
        }
        switch (sortOption) {
            case "newest":
                filtered.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
                break;
            case "highest":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "lowest":
                filtered.sort((a, b) => a.rating - b.rating);
                break;
            default:
                break;
        }
        return filtered.slice(0, visibleReviews);
    };

    const displayedReviews = getFilteredAndSortedReviews();
    const hasMoreReviews = reviews.length > visibleReviews;

    const loadMoreReviews = () => {
        setVisibleReviews(visibleReviews + 3);
    };

    const renderRatingStars = (rating) => {
        if (!rating && rating !== 0) return null;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <IoStar key={i} className="text-yellow-400 w-4 h-4" />
                ) : (
                    <IoStarOutline key={i} className="text-yellow-400 w-4 h-4" />
                )
            );
        }
        return stars;
    };

    const pickImages = async (event) => {
        try {
            const files = Array.from(event.target.files);
            if (files.length + selectedImages.length > 5) {
                alert("Bạn chỉ có thể chọn tối đa 5 ảnh.");
                return;
            }

            const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
            const maxSize = 5 * 1024 * 1024; // 5MB

            const newImages = await Promise.all(
                files.map(async (file) => {
                    if (!validImageTypes.includes(file.type)) {
                        alert(`File ${file.name} không phải là ảnh hợp lệ (chỉ chấp nhận JPG, PNG).`);
                        return null;
                    }
                    if (file.size > maxSize) {
                        alert(`File ${file.name} vượt quá kích thước tối đa 5MB.`);
                        return null;
                    }

                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve({ file, dataUrl: reader.result });
                        reader.readAsDataURL(file);
                    });
                })
            );

            const validImages = newImages.filter((img) => img !== null);
            setSelectedImages([...selectedImages, ...validImages]);
        } catch (error) {
            console.error("Error picking images:", error);
            alert("Không thể chọn ảnh. Vui lòng thử lại sau.");
        }
    };

    const removeImage = (index) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const submitReview = async () => {
        if (!isLoggedIn) {
            alert("Bạn cần đăng nhập để đánh giá sản phẩm.");
            navigate("/login"); // Redirect to login page
            return;
        }
        if (!userReview.comment.trim()) {
            alert("Vui lòng nhập nhận xét của bạn.");
            return;
        }
        if (userReview.comment.length < 15) {
            alert("Nhận xét phải có ít nhất 15 ký tự.");
            return;
        }
        try {
            setLoading(true);
            const reviewData = {
                productId: productId,
                rating: userReview.rating,
                comment: userReview.comment,
                images: null,
            };

            const response = await POST_TOKEN("public/reviews/submit", token, reviewData);

            if (selectedImages.length > 0) {
                const formData = new FormData();
                selectedImages.forEach((img) => {
                    formData.append("file", img.file);
                });
                formData.append("productId", response.data.data.id);
                formData.append("flagData", "review");

                const uploadResponse = await USER_POST_UPLOAD(
                    "public/file/upload-images/products",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (uploadResponse.status !== 200) {
                    console.error("Image upload failed:", uploadResponse.data);
                    alert(
                        "Đánh giá đã được gửi, nhưng không thể tải ảnh lên. Vui lòng thử lại sau."
                    );
                }
            }

            if (response.status === 200) {
                alert("Cảm ơn bạn đã đánh giá sản phẩm!");
                setReviewModalVisible(false);
                setUserReview({ rating: 5, comment: "" });
                setSelectedImages([]);
                fetchReviews();
            } else {
                alert(response.error || "Không thể gửi đánh giá. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Bạn đã đánh giá sản phẩm rồi hoặc có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const calculateRatingPercentage = (rating) => {
        if (reviewStats.total === 0) return 0;
        return (reviewStats.distribution[rating] / reviewStats.total) * 100;
    };

    return (
        <div className="bg-white p-3.5 sm:p-4 md:p-6 mt-2.5 sm:mt-4 mb-20 sm:mb-24 rounded-lg shadow-sm">
            <div className="flex flex-row justify-between items-center mb-3.5 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold">Đánh giá từ khách hàng</h3>
                <button
                    className="bg-gray-100 p-1.5 sm:p-2 px-3 sm:px-4 rounded-lg border border-gray-300"
                    onClick={() => setReviewModalVisible(true)}
                >
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                        Viết đánh giá
                    </p>
                </button>
            </div>
            <OverallRating
                reviewStats={reviewStats}
                renderRatingStars={renderRatingStars}
                calculateRatingPercentage={calculateRatingPercentage}
            />
            <RatingFilters
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
                reviewStats={reviewStats}
            />
            <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
            {loading ? (
                <div className="p-5 sm:p-6 text-center">
                    <p className="text-gray-600 text-sm sm:text-base">Đang tải đánh giá...</p>
                </div>
            ) : (
                <>
                    {displayedReviews.length > 0 ? (
                        <>
                            <ul className="space-y-5">
                                {displayedReviews.map((item) => (
                                    <ReviewItem
                                        key={item.id}
                                        item={item}
                                        renderRatingStars={renderRatingStars}
                                        formatDate={formatDate}
                                        setSelectedViewImage={setSelectedViewImage}
                                        setImageViewerVisible={setImageViewerVisible}
                                    />
                                ))}
                            </ul>
                            {hasMoreReviews && (
                                <button
                                    className="w-full border border-gray-300 rounded-lg py-2.5 sm:py-3 text-center"
                                    onClick={loadMoreReviews}
                                >
                                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                                        Xem thêm đánh giá
                                    </p>
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="p-5 sm:p-6 text-center">
                            <p className="text-gray-600 mb-2.5 sm:mb-3 text-sm sm:text-base">
                                Chưa có đánh giá nào cho sản phẩm này.
                            </p>
                            <button
                                className="bg-red-600 p-2 sm:p-2.5 px-3.5 sm:px-4 rounded-lg"
                                onClick={() => setReviewModalVisible(true)}
                            >
                                <p className="text-white font-medium text-sm sm:text-base">
                                    Hãy là người đầu tiên đánh giá!
                                </p>
                            </button>
                        </div>
                    )}
                </>
            )}
            <WriteReviewModal
                reviewModalVisible={reviewModalVisible}
                setReviewModalVisible={setReviewModalVisible}
                userReview={userReview}
                setUserReview={setUserReview}
                selectedImages={selectedImages}
                pickImages={pickImages}
                removeImage={removeImage}
                submitReview={submitReview}
                loading={loading}
            />
            <ImageViewerModal
                imageViewerVisible={imageViewerVisible}
                setImageViewerVisible={setImageViewerVisible}
                selectedViewImage={selectedViewImage}
            />
        </div>
    );
};

export default ReviewsSection;