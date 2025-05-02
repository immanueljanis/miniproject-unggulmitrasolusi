import { useState, useEffect } from "react";
import axios from "axios";
import { APP_API_URL } from "../../env";

export default function EditPenjualanPopup({ penjualan, onClose, refreshData, showToast, pelangganOptions, barangOptions }) {
    const [formData, setFormData] = useState({
        tgl: '',
        kode_pelanggan: '',
        items: []
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingPenjualan, setLoadingPenjualan] = useState(false);
    const [detailPelanggan, setDetailPelanggan] = useState([])
    console.log(detailPelanggan)

    useEffect(() => {
        const fetchPenjualanDetails = async () => {
            try {
                setLoadingPenjualan(true);
                const response = await axios.get(`${APP_API_URL}/penjualan/${penjualan.id}`);
                const data = response.data.data;

                setFormData({
                    tgl: data.tgl.split('T')[0],
                    kode_pelanggan: data.kode_pelanggan || data.id_pelanggan,
                    items: data?.item_penjualan?.map(item => ({
                        barang_id: item.barang_id,
                        qty: item.qty,
                    }))
                });
                setDetailPelanggan([...pelangganOptions, { id: data.id_pelanggan, nama: data.pelanggan_nama, id_pelanggan: data.pelanggan_kode }]);
            } catch (err) {
                console.error("Error fetching penjualan details", err);
                showToast("Gagal memuat detail penjualan", "error");
                onClose();
            } finally {
                setLoadingPenjualan(false);
            }
        };

        if (penjualan?.id) {
            fetchPenjualanDetails();
        }
    }, [penjualan?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'qty' ? parseInt(value) || 0 : value
        };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { barang_id: '', qty: 1 }]
        }));
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const validate = () => {
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
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                tgl: formData.tgl,
                kode_pelanggan: formData.kode_pelanggan,
                items: formData.items
            };

            const response = await axios.put(
                `${APP_API_URL}/penjualan/${penjualan.id}`,
                payload
            );

            showToast(response?.data?.message || "Penjualan berhasil diupdate");
            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Gagal mengupdate penjualan", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loadingPenjualan) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-md">
                    <p>Memuat data penjualan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Edit Penjualan - {penjualan.id_nota}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block">Tanggal</label>
                            <input
                                type="date"
                                name="tgl"
                                value={formData.tgl}
                                onChange={handleChange}
                                className="border w-full p-2 rounded"
                            />
                            {errors.tgl && <p className="text-red-500 text-sm">{errors.tgl}</p>}
                        </div>
                        <div>
                            <label className="block">Pelanggan</label>
                            <select
                                name="kode_pelanggan"
                                value={formData.kode_pelanggan}
                                onChange={handleChange}
                                className="border w-full p-2 rounded"
                            >
                                <option value="">Pilih Pelanggan</option>
                                {detailPelanggan?.map(pelanggan => (
                                    <option
                                        key={pelanggan.nama}
                                        value={pelanggan.id}
                                        selected={pelanggan.id === formData.kode_pelanggan}
                                    >
                                        {pelanggan.nama} ({pelanggan.id_pelanggan}) {`- ${pelanggan.active ? "Aktif" : "Tidak aktif"}`}
                                    </option>
                                ))}
                            </select>
                            {errors.kode_pelanggan && (
                                <p className="text-red-500 text-sm">{errors.kode_pelanggan}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Items Penjualan</label>
                        {formData.items?.map((item, index) => {
                            return (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-end">
                                    <div>
                                        <label className="block">Barang</label>
                                        <select
                                            name="barang_id"
                                            value={item.barang_id}
                                            onChange={(e) => handleItemChange(index, e)}
                                            className="border w-full p-2 rounded"
                                        >
                                            <option value="">Pilih Barang</option>
                                            {barangOptions?.map(barang => (
                                                <option
                                                    key={barang.id}
                                                    value={barang.id}
                                                    selected={barang.id === item.barang_id}
                                                >
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
                                            className="border w-full p-2 rounded"
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
                            );
                        })}
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