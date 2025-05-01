import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DetailPelanggan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pelanggan, setPelanggan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/pelanggan/${id}`);
                setPelanggan(res.data.data);
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
                <p>Memuat detail pelanggan...</p>
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
            <h1 className="text-2xl font-semibold mb-4">Detail Pelanggan</h1>
            <div className="bg-white p-4 rounded shadow">
                <p><strong>ID:</strong> {pelanggan.id_pelanggan}</p>
                <p><strong>Nama:</strong> {pelanggan.nama}</p>
                <p><strong>Domisili:</strong> {pelanggan.domisili}</p>
                <p><strong>Jenis Kelamin:</strong> {pelanggan.jenis_kelamin}</p>
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
