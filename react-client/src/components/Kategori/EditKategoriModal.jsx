import { useState } from 'react';
import axios from 'axios';

export default function EditKategoriModal({ data, onClose, refreshData, showToast }) {
    const [nama, setNama] = useState(data.nama || '');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        // Validate the 'nama' field
        if (!nama.trim()) {
            setErrors({ nama: 'Nama tidak boleh kosong' });
            return;
        }

        const payload = { nama };

        try {
            setLoading(true);
            await axios.put(`http://localhost:8000/api/kategori/${data.id}`, payload);
            showToast('Kategori berhasil diperbarui');
            onClose();
            refreshData();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal memperbarui kategori';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Kategori</h2>
                <div className="mb-4">
                    <label className="block mb-1">Nama</label>
                    <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={nama}
                        onChange={(e) => {
                            setNama(e.target.value);
                            setErrors({}); // Clear error when the user types
                        }}
                        placeholder="Masukkan nama baru"
                    />
                    {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}