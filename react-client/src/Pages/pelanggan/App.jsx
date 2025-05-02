import { useEffect, useState } from 'react';
import Pagination from '../../utils/Pagination';
import TableActionButtons from '../../utils/ActionButton';
import axios from 'axios';
import useDebounce from '../../hooks/useDebounce';
import CreateButton from "../../components/Pelanggan/CreateButton"
import DeleteConfirm from '../../components/DeleteConfirm';
import EditPelangganPopup from '../../components/Pelanggan/EditPelangganPopup';
import { APP_API_URL } from '../../env';

export default function Pelanggan() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    const [editingPelanggan, setEditingPelanggan] = useState(null);
    const [filters, setFilters] = useState({
        id_pelanggan: '',
        nama: '',
        domisili: '',
        jenis_kelamin: ''
    });

    const [sort, setSort] = useState({ sort_by: 'created_at', sort_dir: 'desc' });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const debouncedFilters = useDebounce(filters, 500);

    const fetchData = async () => {
        try {
            setLoading(true);

            const params = {
                ...debouncedFilters,
                ...sort,
                page,
                per_page: perPage,
            };

            Object.keys(params).forEach((key) => {
                if (params[key] === '' || params[key] == null) {
                    delete params[key];
                }
            });

            const res = await axios.get(`${APP_API_URL}/pelanggan`, { params });
            setData(res.data.data);
            setMeta(res.data.meta);

        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [debouncedFilters, sort, page, perPage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPage(1);
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSort = (column) => {
        setSort(prev => ({
            sort_by: column,
            sort_dir: prev.sort_dir === 'asc' ? 'desc' : 'asc',
        }));
    };

    const columnHeaders = {
        id_pelanggan: 'ID Pelanggan',
        nama: 'Nama',
        domisili: 'Domisili',
        jenis_kelamin: 'Jenis Kelamin'
    };

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setPage(1);
    };

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${APP_API_URL}/pelanggan/${selectedPelanggan.id}`);
            showToast(response?.data?.message, 'success');
            fetchData();
        } catch (err) {
            showToast(err?.response?.data?.message, 'error');
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="p-6">
            {toast.show && (
                <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white 
                    ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    {toast.message}
                </div>
            )}

            <DeleteConfirm
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                pelanggan={selectedPelanggan}
            />

            {editingPelanggan && (
                <EditPelangganPopup
                    pelanggan={editingPelanggan}
                    onClose={() => setEditingPelanggan(null)}
                    refreshData={fetchData}
                    showToast={showToast}
                />
            )}

            <h1 className="text-2xl font-semibold mb-4">Data Pelanggan</h1>

            <CreateButton refreshData={fetchData} showToast={showToast} />

            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    name="id_pelanggan"
                    placeholder="Cari ID Pelanggan"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                />
                <input
                    name="nama"
                    placeholder="Cari Nama"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                />
                <input
                    name="domisili"
                    placeholder="Cari Domisili"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                />
                <select
                    name="jenis_kelamin"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                >
                    <option value="">Semua Jenis Kelamin</option>
                    <option value="pria">Pria</option>
                    <option value="wanita">Wanita</option>
                </select>
            </div>

            {loading && (
                <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-current border-t-transparent rounded-full" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            {!loading && (
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">No</th>
                            {['id_pelanggan', 'nama', 'domisili', 'jenis_kelamin'].map(col => (
                                <th
                                    key={col}
                                    className="p-2 cursor-pointer"
                                    onClick={() => handleSort(col)}
                                >
                                    {columnHeaders[col]} {sort.sort_by === col ? (sort.sort_dir === 'asc' ? '↑' : '↓') : ''}
                                </th>
                            ))}
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {data.map((p, index) => (
                            <tr key={p.id_pelanggan} className="border-t">
                                <td className="p-2">{(meta.current_page - 1) * meta.per_page + index + 1}</td>
                                <td className="p-2">{p.id_pelanggan}</td>
                                <td className="p-2">{p.nama}</td>
                                <td className="p-2">{p.domisili}</td>
                                <td className="p-2">{p.jenis_kelamin}</td>
                                <td className="p-2 text-center">
                                    <TableActionButtons
                                        onDetail={'/pelanggan/' + p.id}
                                        onEdit={() => setEditingPelanggan(p)}
                                        onDelete={() => {
                                            setSelectedPelanggan(p);
                                            setShowDeleteModal(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="my-4 flex items-center gap-4">
                <label htmlFor="perPage" className="text-sm">Rows per page:</label>
                <select
                    id="perPage"
                    value={perPage}
                    onChange={handlePerPageChange}
                    className="border p-2 rounded"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <div className="text-sm text-gray-500 mt-2">
                Menampilkan {meta.count} dari total {meta.total} data.
            </div>

            <Pagination meta={meta} onPageChange={setPage} />
        </div>
    );
}
