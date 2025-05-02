import { useState } from "react";
import axios from "axios";
import { APP_API_URL } from "../../env";

export default function EditPelangganPopup({ pelanggan, onClose, refreshData, showToast }) {
    const [formData, setFormData] = useState({
        nama: pelanggan.nama || '',
        domisili: pelanggan.domisili || '',
        jenis_kelamin: pelanggan.jenis_kelamin || '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
        if (!formData.domisili.trim()) newErrors.domisili = "Domisili wajib diisi";
        if (!['pria', 'wanita'].includes(formData.jenis_kelamin))
            newErrors.jenis_kelamin = "Jenis kelamin harus pria atau wanita";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {};
            if (formData.nama !== pelanggan.nama) payload.nama = formData.nama;
            if (formData.domisili !== pelanggan.domisili) payload.domisili = formData.domisili;
            if (formData.jenis_kelamin !== pelanggan.jenis_kelamin)
                payload.jenis_kelamin = formData.jenis_kelamin;

            if (Object.keys(payload).length === 0) {
                showToast("Tidak ada perubahan untuk disimpan", "error");
                return;
            }

            const response = await axios.put(`${APP_API_URL}/pelanggan/${pelanggan.id}`, payload);

            showToast(response?.data?.message);
            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            showToast("Gagal mengupdate pelanggan", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Pelanggan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Nama</label>
                        <input
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="border w-full p-2 rounded"
                        />
                        {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                    </div>
                    <div>
                        <label className="block">Domisili</label>
                        <input
                            name="domisili"
                            value={formData.domisili}
                            onChange={handleChange}
                            className="border w-full p-2 rounded"
                        />
                        {errors.domisili && <p className="text-red-500 text-sm">{errors.domisili}</p>}
                    </div>
                    <div>
                        <label className="block">Jenis Kelamin</label>
                        <select
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleChange}
                            className="border w-full p-2 rounded"
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                        </select>
                        {errors.jenis_kelamin && (
                            <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
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
