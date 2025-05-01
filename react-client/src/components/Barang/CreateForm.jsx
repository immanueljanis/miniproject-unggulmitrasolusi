import React, { useState } from 'react';
import axios from 'axios';

export default function CreateForm({ closeModal, refreshData, showToast, kategoriOptions }) {
    const [formData, setFormData] = useState({
        nama: '',
        kategori: '',
        harga: 0
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'harga' ? parseFloat(value) || 0 : value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nama.trim()) newErrors.nama = 'Nama barang wajib diisi';
        if (!formData.kategori) newErrors.kategori = 'Kategori wajib dipilih';
        if (formData.harga <= 0) newErrors.harga = 'Harga harus lebih dari 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            await axios.post('http://127.0.0.1:8000/api/barang', formData);
            showToast('Barang berhasil ditambahkan', 'success');
            closeModal();
            refreshData();
        } catch (err) {
            console.error("Error creating barang", err);
            const errorMsg = err.response?.data?.message || 'Gagal menambahkan barang';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Tambah Barang</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block">Nama Barang</label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                        {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block">Kategori</label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Pilih Kategori</option>
                            {kategoriOptions.map(kategori => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.nama}
                                </option>
                            ))}
                        </select>
                        {errors.kategori && <p className="text-red-500 text-sm">{errors.kategori}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block">Harga</label>
                        <input
                            type="number"
                            name="harga"
                            value={formData.harga}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            min="0"
                        />
                        {errors.harga && <p className="text-red-500 text-sm">{errors.harga}</p>}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white p-2 rounded"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}