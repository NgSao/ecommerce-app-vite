import { formatDateNotification } from "@utils/formatUtils";

const ReviewItem = ({ item, renderRatingStars, setSelectedViewImage, setImageViewerVisible }) => (
    <div className="border-b border-gray-200 pb-5 mb-5 last:border-b-0 last:pb-0">
        <div className="flex flex-row justify-between mb-2.5">
            <div className="flex flex-row items-center">
                <div className="w-9 h-9 overflow-hidden rounded-full flex items-center justify-center mr-2.5 sm:mr-3">
                    {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt={item.fullName} className="w-10 h-10 rounded-full" />
                    ) : (
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.fullName)}&background=random&size=50`}
                            alt={item.fullName}
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                </div>
                <div>
                    <p className="font-semibold text-sm sm:text-base">{item.fullName}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{formatDateNotification(item.createAt)}</p>
                </div>
            </div>
            <div className="flex flex-row">{renderRatingStars(item?.rating || 0)}</div>
        </div>
        <p className="leading-5 sm:leading-6 text-gray-700 text-sm sm:text-base mb-2.5">{item.comment}</p>
        {item.images && item.images.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2">
                {item.images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setSelectedViewImage(image);
                            setImageViewerVisible(true);
                        }}
                    >
                        <img src={image} alt={`Review image ${index}`} className="w-20 h-20 rounded-md mr-2 mb-2" />
                    </button>
                ))}
            </div>
        )}
        {item.replies && item.replies.length > 0 && (
            <div className="border-l-2 border-red-600 pl-2.5 sm:pl-3 bg-white p-3 mt-3.5 sm:mt-4 rounded-lg shadow-sm">
                <p className="text-red-600 font-bold mb-2 text-sm sm:text-base">Phản hồi</p>
                <div className="flex flex-row items-center mb-2">
                    <img
                        src={
                            item.replies[0]?.adminAvatarUrl ||
                            "https://ui-avatars.com/api/?name=Admin&background=F44336&color=fff&size=64"
                        }
                        alt="Admin"
                        className="w-10 h-10 rounded-full mr-2.5 sm:mr-3"
                    />
                    <div>
                        <p className="font-bold text-sm sm:text-base text-red-500">Quản Trị Viên</p>
                        <p className="text-gray-500 text-xs sm:text-sm">{formatDateNotification(item.replies[0]?.createdAt)}</p>
                    </div>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-5 sm:leading-6">{item.replies[0]?.reply}</p>
            </div>
        )}
    </div>
);

export default ReviewItem;