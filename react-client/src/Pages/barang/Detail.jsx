import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DetailBarang() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [barang, setBarang] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/barang/${id}`);
                setBarang(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message);
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
                <p>Memuat detail barang...</p>
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
    console.log(barang)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Detail Barang</h1>
            <div className="bg-white p-4 rounded shadow">
                <p><strong>Kode Barang:</strong> {barang.kode}</p>
                <p><strong>Nama:</strong> {barang.nama}</p>
                <p><strong>Harga:</strong> {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(barang.harga)}</p>
                <p><strong>Kategori:</strong> {barang.kategori.nama}</p>
            </div>
            <button
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Kembali
            </button>
        </div>
    );
}
