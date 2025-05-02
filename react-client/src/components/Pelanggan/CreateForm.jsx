import React, { useState } from 'react';
import axios from 'axios';
import { APP_API_URL } from '../../env';

export default function CreateForm({ closeModal, refreshData, showToast }) {
    const [formData, setFormData] = useState({
        nama: '',
        domisili: '',
        jenis_kelamin: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nama) newErrors.nama = 'Nama is required';
        if (!formData.domisili) newErrors.domisili = 'Domisili is required';
        if (!formData.jenis_kelamin) newErrors.jenis_kelamin = 'Jenis Kelamin is required';
        if (formData.jenis_kelamin && !['pria', 'wanita'].includes(formData.jenis_kelamin)) {
            newErrors.jenis_kelamin = 'Jenis Kelamin must be either "pria" or "wanita"';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            await axios.post(`${APP_API_URL}/pelanggan`, formData);
            showToast('Pelanggan created successfully', 'success');
            closeModal();
            refreshData();
        } catch (err) {
            console.error("Error creating pelanggan", err);
            const errorMsg = err.response?.data?.message || 'Error creating pelanggan';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
                <h2 className="text-2xl mb-4">Create Pelanggan</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block">Nama</label>
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
                        <label className="block">Domisili</label>
                        <input
                            type="text"
                            name="domisili"
                            value={formData.domisili}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                        {errors.domisili && <p className="text-red-500 text-sm">{errors.domisili}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block">Jenis Kelamin</label>
                        <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select Jenis Kelamin</option>
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                        </select>
                        {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}