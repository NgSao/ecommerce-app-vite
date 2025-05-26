import React from "react";

const LogoutModal = ({ visible, onConfirm, onCancel }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
                <h3 className="text-lg font-bold mb-4">Đăng xuất</h3>
                <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất?</p>
                <div className="flex flex-row gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;