import { useState } from "react";
import axios from "axios";
import { APP_API_URL } from "../../env"

export default function EditBarangPopup({ barang, onClose, refreshData, showToast, kategoriOptions }) {
    const newKategori = [
        ...kategoriOptions.filter(k => k.id !== barang.kategori.id),
        barang.kategori
    ];

    const [formData, setFormData] = useState({
        nama: barang.nama || '',
        kategori: barang.kategori?.id || '',
        harga: barang.harga || 0
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'harga' ? parseFloat(value) || 0 : value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
        if (!formData.kategori) newErrors.kategori = "Kategori wajib dipilih";
        if (formData.harga <= 0) newErrors.harga = "Harga harus lebih dari 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {};
            if (formData.nama !== barang.nama) payload.nama = formData.nama;
            if (formData.kategori !== barang.kategori?.id) payload.kategori = formData.kategori;
            if (formData.harga !== barang.harga) payload.harga = formData.harga;
            if (formData.active !== barang.active) payload.active = formData.active;

            if (Object.keys(payload).length === 0) {
                showToast("Tidak ada perubahan untuk disimpan", "info");
                return;
            }

            const response = await axios.put(
                `${APP_API_URL}/barang/${barang.id}`,
                payload
            );

            showToast(response?.data?.message || "Barang berhasil diupdate");
            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Gagal mengupdate barang", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Barang</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Nama Barang</label>
                        <input
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="border w-full p-2 rounded"
                        />
                        {errors.nama && <p className="text-red-500 text-sm">{errors.nama}</p>}
                    </div>
                    <div>
                        <label className="block">Kategori</label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            className="border w-full p-2 rounded"
                        >
                            <option value="">Pilih Kategori</option>
                            {newKategori.map(kategori => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.nama} {!kategori.active && "- Tidak Aktif"}
                                </option>
                            ))}
                        </select>
                        {errors.kategori && (
                            <p className="text-red-500 text-sm">{errors.kategori}</p>
                        )}
                    </div>
                    <div>
                        <label className="block">Harga</label>
                        <input
                            type="number"
                            name="harga"
                            value={formData.harga}
                            onChange={handleChange}
                            className="border w-full p-2 rounded"
                            min="0"
                        />
                        {errors.harga && <p className="text-red-500 text-sm">{errors.harga}</p>}
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
                            className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}