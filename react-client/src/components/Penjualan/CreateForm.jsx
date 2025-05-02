import React, { useState } from 'react';
import axios from 'axios';
import { APP_API_URL } from '../../env';

export default function CreateForm({ closeModal, refreshData, showToast, pelangganOptions, barangOptions }) {
    const [formData, setFormData] = useState({
        tgl: new Date().toISOString().split('T')[0],
        kode_pelanggan: '',
        items: [{ barang_id: '', qty: 1 }]
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'qty' ? parseInt(value) || 0 : value
        };
        setFormData({
            ...formData,
            items: newItems
        });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { barang_id: '', qty: 1 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            items: newItems
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tgl) newErrors.tgl = 'Tanggal wajib diisi';
        if (!formData.kode_pelanggan) newErrors.kode_pelanggan = 'Pelanggan wajib dipilih';

        formData.items.forEach((item, index) => {
            if (!item.barang_id) {
                newErrors[`items[${index}].barang_id`] = 'Barang wajib dipilih';
            }
            if (item.qty <= 0) {
                newErrors[`items[${index}].qty`] = 'Jumlah harus lebih dari 0';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            await axios.post(`${APP_API_URL}/penjualan`, formData);
            showToast('Penjualan berhasil ditambahkan', 'success');
            closeModal();
            refreshData();
        } catch (err) {
            console.error("Error creating penjualan", err);
            const errorMsg = err.response?.data?.message || 'Gagal menambahkan penjualan';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl mb-4">Tambah Penjualan</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block">Tanggal</label>
                            <input
                                type="date"
                                name="tgl"
                                value={formData.tgl}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                            {errors.tgl && <p className="text-red-500 text-sm">{errors.tgl}</p>}
                        </div>
                        <div>
                            <label className="block">Pelanggan</label>
                            <select
                                name="kode_pelanggan"
                                value={formData.kode_pelanggan}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            >
                                <option value="">Pilih Pelanggan</option>
                                {pelangganOptions.map(pelanggan => (
                                    <option key={pelanggan.id} value={pelanggan.id}>
                                        {pelanggan.nama} ({pelanggan.id_pelanggan})
                                    </option>
                                ))}
                            </select>
                            {errors.kode_pelanggan && <p className="text-red-500 text-sm">{errors.kode_pelanggan}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-2">Items Penjualan</label>
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-end">
                                <div>
                                    <label className="block">Barang</label>
                                    <select
                                        name="barang_id"
                                        value={item.barang_id}
                                        onChange={(e) => handleItemChange(index, e)}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Pilih Barang</option>
                                        {barangOptions.map(barang => (
                                            <option key={barang.id} value={barang.id}>
                                                {barang.nama} ({barang.kode})
                                            </option>
                                        ))}
                                    </select>
                                    {errors[`items[${index}].barang_id`] && (
                                        <p className="text-red-500 text-sm">{errors[`items[${index}].barang_id`]}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block">Jumlah</label>
                                    <input
                                        type="number"
                                        name="qty"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, e)}
                                        className="border p-2 rounded w-full"
                                        min="1"
                                    />
                                    {errors[`items[${index}].qty`] && (
                                        <p className="text-red-500 text-sm">{errors[`items[${index}].qty`]}</p>
                                    )}
                                </div>
                                <div>
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="bg-red-500 text-white p-2 rounded w-full"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItem}
                            className="bg-gray-500 text-white p-2 rounded mt-2"
                        >
                            Tambah Item
                        </button>
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