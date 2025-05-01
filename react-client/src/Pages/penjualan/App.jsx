import { useEffect, useState } from 'react';
import Pagination from '../../utils/Pagination';
import TableActionButtons from '../../utils/ActionButton';
import axios from 'axios';
import useDebounce from '../../hooks/useDebounce';
import CreateButton from "../../components/Penjualan/CreateButton";
import DeleteConfirm from '../../components/DeleteConfirm';
import EditPenjualanPopup from '../../components/Penjualan/EditPenjualanPopUp';

export default function Penjualan() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [pelangganOptions, setPelangganOptions] = useState([]);
    const [barangOptions, setBarangOptions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPenjualan, setSelectedPenjualan] = useState(null);
    const [editingPenjualan, setEditingPenjualan] = useState(null);
    const [filters, setFilters] = useState({
        id_pelanggan: '',
        pelanggan_nama: '',
        tgl: ''
    });

    const [sort, setSort] = useState({ sort_by: 'created_at', sort_dir: 'desc' });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const debouncedFilters = useDebounce(filters, 500);

    const fetchOptions = async () => {
        try {
            setLoadingOptions(true);
            const [pelangganRes, barangRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/pelanggan', { params: { per_page: 100 } }),
                axios.get('http://127.0.0.1:8000/api/barang', { params: { per_page: 100 } })
            ]);
            setPelangganOptions(pelangganRes.data.data);
            setBarangOptions(barangRes.data.data);
        } catch (err) {
            console.error("Error fetching options", err);
        } finally {
            setLoadingOptions(false);
        }
    };

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

            const res = await axios.get('http://127.0.0.1:8000/api/penjualan', { params });
            setData(res.data.data);
            setMeta(res.data.meta);

        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
        fetchData();
    }, []);

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
        id: 'ID',
        tgl: 'Tanggal',
        id_nota: 'ID Nota',
        id_pelanggan: 'ID Pelanggan',
        pelanggan_nama: 'Nama Pelanggan',
        subtotal: 'Subtotal'
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
            const response = await axios.delete(`http://localhost:8000/api/penjualan/${selectedPenjualan.id}`);
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
                <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white 
                    ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            <DeleteConfirm
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                item={selectedPenjualan}
                itemName="penjualan"
            />

            {editingPenjualan && (
                <EditPenjualanPopup
                    penjualan={editingPenjualan}
                    onClose={() => setEditingPenjualan(null)}
                    refreshData={fetchData}
                    showToast={showToast}
                    pelangganOptions={pelangganOptions}
                    barangOptions={barangOptions}
                />
            )}

            <h1 className="text-2xl font-semibold mb-4">Data Penjualan</h1>

            <CreateButton
                refreshData={fetchData}
                showToast={showToast}
                pelangganOptions={pelangganOptions}
                barangOptions={barangOptions}
            />

            {/* Filters Section */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    name="id_pelanggan"
                    placeholder="Cari ID Pelanggan"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                />
                <input
                    name="pelanggan_nama"
                    placeholder="Cari Nama Pelanggan"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="tgl"
                    className="border p-2 rounded"
                    onChange={handleInputChange}
                />
            </div>

            {/* Loading Indicators */}
            {loadingOptions && (
                <div className="text-sm text-gray-500 mb-2">Memuat data pelanggan dan barang...</div>
            )}
            {loading && (
                <div className="flex justify-center items-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-current border-t-transparent rounded-full" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}

            {/* Table Section */}
            {!loading && (
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">No</th>
                            {['tgl', 'id_nota', 'id_pelanggan', 'pelanggan_nama', 'subtotal'].map(col => (
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
                        {data?.map((item, index) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2">{(meta.current_page - 1) * meta.per_page + index + 1}</td>
                                <td className="p-2">{new Date(item.tgl).toLocaleDateString()}</td>
                                <td className="p-2">{item.id_nota}</td>
                                <td className="p-2">{item.id_pelanggan}</td>
                                <td className="p-2">{item.pelanggan_nama}</td>
                                <td className="p-2">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    }).format(item.subtotal)}
                                </td>
                                <td className="p-2 text-center">
                                    <TableActionButtons
                                        onDetail={'/penjualan/' + item.id}
                                        onEdit={() => setEditingPenjualan(item)}
                                        onDelete={() => {
                                            setSelectedPenjualan(item);
                                            setShowDeleteModal(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Dropdown to set per page */}
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

            {/* Pagination */}
            <Pagination meta={meta} onPageChange={setPage} />
        </div>
    );
}