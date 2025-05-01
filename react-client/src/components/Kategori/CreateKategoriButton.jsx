import { useState } from 'react';
import axios from 'axios';

export default function CreateKategoriButton({ refreshData, showToast }) {
    const [show, setShow] = useState(false);
    const [nama, setNama] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        setError('');
        if (!nama.trim()) {
            setError('Nama tidak boleh kosong');
            return;
        }

        const payload = {
            nama: nama.trim()
        };

        try {
            setLoading(true);
            await axios.post('http://localhost:8000/api/kategori', payload);
            showToast('Kategori berhasil ditambahkan');
            setShow(false);
            setNama('');
            refreshData();
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal menambahkan kategori';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShow(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Tambah Kategori
            </button>

            {show && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Tambah Kategori</h2>
                        <div className="mb-4">
                            <label className="block mb-1">Nama</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Masukkan nama kategori"
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShow(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}