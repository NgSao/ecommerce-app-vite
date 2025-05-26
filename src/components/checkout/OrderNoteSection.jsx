function OrderNoteSection({ note, setNote }) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Ghi chú đơn hàng</h2>
            <textarea
                className="w-full p-3 border rounded-lg resize-none"
                placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
        </div>
    );
}

export default OrderNoteSection;