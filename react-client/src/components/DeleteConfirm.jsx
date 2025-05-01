export default function DeleteConfirm({ isOpen, onClose, onConfirm, data }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
                <p>Apakah Anda yakin ingin menghapus <strong>{data?.nama}</strong>?</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Hapus</button>
                </div>
            </div>
        </div>
    );
}
