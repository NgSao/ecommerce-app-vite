const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm nào</p>
    </div>
);
export default EmptyState;