import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../utils/Pagination';
import TableActionButtons from '../../utils/ActionButton';
import CreateKategoriButton from '../../components/Kategori/CreateKategoriButton';
import EditKategoriModal from '../../components/Kategori/EditKategoriModal';
import DeleteConfirm from '../../components/DeleteConfirm';
import { APP_API_URL } from '../../env';

export default function Kategori() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [selectedEdit, setSelectedEdit] = useState(null);
    const [selectedDelete, setSelectedDelete] = useState(null);

    const [filterNama, setFilterNama] = useState('');
    const [debouncedNama, setDebouncedNama] = useState('');
    const [sortField, setSortField] = useState('nama');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedNama(filterNama);
            setPage(1);
        }, 500);

        return () => clearTimeout(timeout);
    }, [filterNama]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                per_page: perPage,
                nama: debouncedNama.trim() !== '' ? debouncedNama.trim() : undefined,
                sort_by: sortField,
                sort_dir: sortDirection,
            };

            const res = await axios.get(`${APP_API_URL}/kategori`, { params });
            setData(res.data.data);
            setMeta(res.data.meta);
        } catch (err) {
            console.log(err);
            showToast('Gagal memuat data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${APP_API_URL}/kategori/${selectedDelete.id}`);
            showToast('Kategori berhasil dihapus');
            fetchData();
            setSelectedDelete(null);
        } catch {
            showToast('Gagal menghapus kategori', 'error');
        }
    };

    const toggleSort = (field) => {

        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, perPage, debouncedNama, sortField, sortDirection]);

    return (
        <div className="p-6">
            {toast.show && (
                <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            {selectedDelete && (
                <DeleteConfirm
                    isOpen={selectedDelete !== null}
                    onClose={() => setSelectedDelete(null)}
                    onConfirm={handleDelete}
                    data={selectedDelete}
                />
            )}

            <h1 className="text-2xl font-semibold mb-4">Data Kategori</h1>

            <CreateKategoriButton refreshData={fetchData} showToast={showToast} />

            <div className="my-4">
                <input
                    type="text"
                    placeholder="Cari Nama Kategori"
                    className="border p-2 rounded w-full md:w-1/3"
                    value={filterNama}
                    onChange={(e) => setFilterNama(e.target.value)}
                />
            </div>

            <div className="relative">
                {loading && (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-current border-t-transparent rounded-full" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
                {!loading && (
                    <table className="w-full table-auto border mt-4 relative z-0">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2">No</th>
                                <th className="p-2 cursor-pointer" onClick={() => toggleSort('nama')}>
                                    Nama {sortField === 'nama' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="p-2 cursor-pointer" onClick={() => toggleSort('active')}>
                                    Active {sortField === 'active' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-gray-500">Data tidak ditemukan</td>
                                </tr>
                            ) : (
                                data.map((item, i) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                                        <td className="p-2">{item.nama}</td>
                                        <td className="p-2">{item.active ? "Aktif" : "Tidak aktif"}</td>
                                        {item.active ? (
                                            <td className="p-2">
                                                <TableActionButtons
                                                    onEdit={() => setSelectedEdit(item)}
                                                    onDelete={() => setSelectedDelete(item)}
                                                />
                                            </td>
                                        ) : ""}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="my-4 flex items-center gap-4">
                <label htmlFor="perPage" className="text-sm">Rows per page:</label>
                <select
                    id="perPage"
                    value={perPage}
                    onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                    }}
                    className="border p-2 rounded"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className="text-sm text-gray-500 mt-2">Menampilkan {meta.count} dari total {meta.total} data.</div>
            <Pagination meta={meta} onPageChange={setPage} />

            {selectedEdit && (
                <EditKategoriModal
                    data={selectedEdit}
                    onClose={() => setSelectedEdit(null)}
                    refreshData={fetchData}
                    showToast={showToast}
                />
            )}
            {selectedDelete && (
                <DeleteConfirm
                    title="Hapus Kategori"
                    onConfirm={() => {
                        handleDelete(selectedDelete.id);
                        setSelectedDelete(null);
                    }}
                    onCancel={() => setSelectedDelete(null)}
                />
            )}
        </div>
    );
}