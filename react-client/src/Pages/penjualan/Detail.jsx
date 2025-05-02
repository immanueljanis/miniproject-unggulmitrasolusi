import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APP_API_URL } from "../../env";
import axios from "axios";

export default function DetailPenjualan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [penjualan, setPenjualan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`${APP_API_URL}/penjualan/${id}`);
                setPenjualan(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Gagal memuat detail penjualan");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p>Memuat detail penjualan...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Detail Penjualan</h1>
            <div className="bg-white p-4 rounded shadow mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>No. Nota:</strong> {penjualan.id_nota}</p>
                        <p><strong>Tanggal:</strong> {penjualan.tgl}</p>
                    </div>
                    <div>
                        <p><strong>Pelanggan:</strong> {penjualan.pelanggan_nama}</p>
                        <p><strong>Total Item:</strong> {penjualan.item_penjualan.length}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-3">Daftar Barang</h2>
            <div className="bg-white p-4 rounded shadow mb-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-4">Nama Barang</th>
                                <th className="text-right py-2 px-4">Harga</th>
                                <th className="text-right py-2 px-4">Qty</th>
                                <th className="text-right py-2 px-4">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penjualan.item_penjualan.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2 px-4">{item.barang_nama}</td>
                                    <td className="text-right py-2 px-4">Rp {item.barang_harga.toLocaleString()}</td>
                                    <td className="text-right py-2 px-4">{item.qty}</td>
                                    <td className="text-right py-2 px-4">Rp {(item.barang_harga * item.qty).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-end justify-end">
                <p><strong>Total:</strong> Rp {penjualan.subtotal.toLocaleString()}</p>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Kembali
            </button>
        </div>
    );
}