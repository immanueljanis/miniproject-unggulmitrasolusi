import { useState, useEffect } from 'react';
import { Pressable, TextInput, View, ActivityIndicator, Modal, Alert, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useDebounce from '@/hooks/useDebounce';
import PenjualanForm from '@/components/added/Penjualan/PenjualanForm';
import PenjualanDetail from '@/components/added/Penjualan/PenjualanDetail';
import { Penjualan, PenjualanResponse, SinglePenjualanResponse } from '@/app/types/penjualan';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
const screenWidth = Dimensions.get('window').width;

export default function PenjualanScreen() {
    const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        id_pelanggan: '',
        pelanggan_nama: '',
        tgl: '',
    });
    const [showDateFilterPicker, setShowDateFilterPicker] = useState(false);
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [fromTo, setFromTo] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedPenjualan, setSelectedPenjualan] = useState<Penjualan | null>(null);
    const debouncedFilters = useDebounce(filters, 500);

    const fetchPenjualans = async () => {
        try {
            setLoading(true);
            let url = `${process.env.EXPO_PUBLIC_API_URL}/penjualan`;
            const params = new URLSearchParams({
                per_page: '10',
                page: page.toString(),
                sort_by: sortField,
                sort_dir: sortDirection,
            });

            if (filters.id_pelanggan) params.append('id_pelanggan', filters.id_pelanggan);
            if (filters.pelanggan_nama) params.append('pelanggan_nama', filters.pelanggan_nama);
            if (filters.tgl && filters.tgl.trim() !== '') params.append('tgl', filters.tgl);

            const response = await fetch(`${url}?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
            }

            const data: PenjualanResponse = await response.json();

            if (!data.data) {
                throw new Error('Invalid response structure');
            }

            setPenjualans(data.data);
            setTotalPages(data.meta.total_pages);
            setTotalData(data.meta.total);
            setFromTo(data.meta);
            setError(null);
        } catch (err) {
            console.error('Error fetching penjualans:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setPenjualans([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPenjualans();
    }, [debouncedFilters, sortField, sortDirection, page]);

    const handleAdd = () => {
        setSelectedPenjualan(null);
        setModalVisible(true);
    };

    const handleDateFilterChange = (event: any, selectedDate?: Date) => {
        setShowDateFilterPicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setFilters({ ...filters, tgl: formattedDate });
        }
    };

    const handleEdit = (penjualan: Penjualan) => {
        setSelectedPenjualan(penjualan);
        setModalVisible(true);
    };

    const handleViewDetail = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/penjualan/${id}`);
            const data: SinglePenjualanResponse = await response.json();
            setSelectedPenjualan(data.data);
            setDetailVisible(true);
        } catch (error) {
            Alert.alert('Error', 'Gagal memuat detail penjualan');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Konfirmasi',
            'Apakah Anda yakin ingin menghapus penjualan ini?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', onPress: () => deletePenjualan(id) },
            ]
        );
    };

    const deletePenjualan = async (id: number) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/penjualan/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            fetchPenjualans();
            Alert.alert('Sukses', 'Penjualan berhasil dihapus');
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus penjualan');
        }
    };

    const handlePrevPage = () => page > 1 && setPage(page - 1);
    const handleNextPage = () => page < totalPages && setPage(page + 1);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <MaterialCommunityIcons
                    name="receipt"
                    size={310}
                    style={styles.headerImage}
                    color={'#D0D0D0'}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Penjualan</ThemedText>
            </ThemedView>
            <Pressable onPress={handleAdd} style={styles.createButton}>
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                <ThemedText style={styles.createButtonText}>Tambah Penjualan</ThemedText>
            </Pressable>

            {/* Filter Controls */}
            <ThemedView style={styles.filterContainer}>
                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter Kode Pelanggan"
                    value={filters.id_pelanggan}
                    onChangeText={(text) => setFilters({ ...filters, id_pelanggan: text })}
                />

                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter Nama Pelanggan"
                    value={filters.pelanggan_nama}
                    onChangeText={(text) => setFilters({ ...filters, pelanggan_nama: text })}
                />

                <View style={styles.dateInputContainer}>
                    <Pressable
                        onPress={() => setShowDateFilterPicker(true)}
                        style={styles.dateInput}>
                        <ThemedText style={styles.dateText}>
                            {filters.tgl || 'Filter Tanggal'}
                        </ThemedText>
                    </Pressable>
                    {filters.tgl && (
                        <Pressable
                            onPress={() => {
                                setFilters({ ...filters, tgl: '' });
                                setPage(1);
                            }}
                            style={styles.clearButton}>
                            <MaterialCommunityIcons name="close" size={16} color="red" />
                        </Pressable>
                    )}
                    {showDateFilterPicker && (
                        <DateTimePicker
                            value={filters.tgl ? new Date(filters.tgl) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateFilterChange}
                            style={styles.dateTimePicker}
                            textColor="black" // For Android
                            themeVariant="light" // For iOS
                        />
                    )}
                </View>
            </ThemedView>

            {/* Sorting Controls */}
            <ThemedView style={styles.sortContainer}>
                <Picker
                    selectedValue={sortField}
                    onValueChange={(itemValue) => {
                        setPage(1);
                        setSortField(itemValue);
                    }} style={styles.sortPicker}>
                    <Picker.Item label="Sort by Tanggal" value="tgl" />
                    <Picker.Item label="Sort by No. Nota" value="id_nota" />
                    <Picker.Item label="Sort by Kode Pelanggan" value="kode_pelanggan" />
                    <Picker.Item label="Sort by Nama Pelanggan" value="pelanggan_nama" />
                    <Picker.Item label="Sort by Subtotal" value="subtotal" />
                </Picker>

                <Pressable
                    onPress={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    style={styles.sortDirectionButton}>
                    <MaterialCommunityIcons
                        name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                        size={20}
                        color="#000"
                    />
                    <ThemedText>{sortDirection.toUpperCase()}</ThemedText>
                </Pressable>
            </ThemedView>

            {loading && <ActivityIndicator size="large" style={styles.loader} />}
            {error && <ThemedText style={styles.error}>{error}</ThemedText>}

            {/* Penjualan List */}
            <View style={styles.listContainer}>
                {penjualans.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={styles.itemContent}>
                            <View style={styles.itemTextContainer}>
                                <ThemedText style={styles.itemName}>{item.id_nota}</ThemedText>
                                <ThemedText style={styles.itemSubtext}>
                                    {item.tgl} • {item.pelanggan_nama} • {item.id_pelanggan}
                                </ThemedText>
                                <ThemedText style={styles.itemSubtext}>
                                    {item.total_item} item • Rp {item.subtotal.toLocaleString()}
                                </ThemedText>
                            </View>
                            <View style={styles.actionButtons}>
                                <Pressable
                                    onPress={() => handleViewDetail(item.id)}
                                    style={styles.iconButton}>
                                    <MaterialCommunityIcons name="eye" size={20} color={'blue'} />
                                </Pressable>
                                {/* <Pressable
                                    onPress={() => {
                                        setDetailVisible(false);
                                        handleEdit(selectedPenjualan);
                                    }}
                                    style={styles.iconButton}>
                                    <MaterialCommunityIcons name="pencil" size={20} color={'#000000'} />
                                </Pressable> */}
                                <Pressable
                                    onPress={() => handleDelete(item.id)}
                                    style={styles.iconButton}>
                                    <MaterialCommunityIcons name="delete" size={20} color={'red'} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <ThemedView style={styles.summaryContainer}>
                <ThemedText>Showing {fromTo?.count} of {fromTo?.total} items</ThemedText>
            </ThemedView>

            <ThemedView style={styles.pagination}>
                <Pressable
                    onPress={handlePrevPage}
                    disabled={page === 1}
                    style={[styles.paginationButton, page === 1 && styles.disabledButton]}>
                    <ThemedText>Previous</ThemedText>
                </Pressable>
                <ThemedText>Page {page} of {totalPages}</ThemedText>
                <Pressable
                    onPress={handleNextPage}
                    disabled={page === totalPages}
                    style={[styles.paginationButton, page === totalPages && styles.disabledButton]}>
                    <ThemedText>Next</ThemedText>
                </Pressable>
            </ThemedView>

            {/* Form Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <PenjualanForm
                            initialData={selectedPenjualan ? {
                                id: selectedPenjualan.id,
                                tgl: selectedPenjualan.tgl,
                                kode_pelanggan: selectedPenjualan.id_pelanggan,
                                items: selectedPenjualan.item_penjualan?.map(item => ({
                                    barang_id: item.barang_id,
                                    qty: item.qty
                                })) || []
                            } : undefined}
                            onSubmit={async (data) => {
                                try {
                                    const url = selectedPenjualan?.id
                                        ? `${process.env.EXPO_PUBLIC_API_URL}/penjualan/${selectedPenjualan.id}`
                                        : `${process.env.EXPO_PUBLIC_API_URL}/penjualan`;

                                    const method = selectedPenjualan?.id ? 'PUT' : 'POST';

                                    const response = await fetch(url, {
                                        method,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                                    });

                                    if (!response.ok) throw new Error('Failed to save');

                                    fetchPenjualans();
                                    setModalVisible(false);
                                    Alert.alert('Sukses', `Penjualan berhasil ${selectedPenjualan?.id ? 'diupdate' : 'ditambahkan'}`);
                                } catch (error) {
                                    Alert.alert('Error', 'Gagal menyimpan penjualan');
                                }
                            }}
                            onClose={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            {/* Detail Modal */}
            <Modal
                visible={detailVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDetailVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedPenjualan && (
                            <PenjualanDetail
                                data={{
                                    id: selectedPenjualan.id,
                                    id_nota: selectedPenjualan.id_nota,
                                    tgl: selectedPenjualan.tgl,
                                    pelanggan_nama: selectedPenjualan.pelanggan_nama,
                                    subtotal: selectedPenjualan.subtotal,
                                    item_penjualan: selectedPenjualan.item_penjualan || []
                                }}
                                onClose={() => setDetailVisible(false)}
                                onEdit={() => {
                                    setDetailVisible(false);
                                    handleEdit(selectedPenjualan);
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </ParallaxScrollView>
    );
}

const styles = {
    container: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxHeight: '100%',
        backgroundColor: 'white'
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10,
        backgroundColor: 'white',
    },
    itemPicker: {
        flex: 3,
        height: 50,
        backgroundColor: 'white',
        maxWidth: screenWidth * 0.6,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    filterContainer: {
        marginBottom: 16,
        gap: 8,
    },
    filterInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sortPicker: {
        flex: 1,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    sortDirectionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        gap: 4,
    },
    listContainer: {
        flex: 1,
        marginBottom: 16,
    },
    itemRow: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginVertical: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    itemTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemName: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
    },
    itemSubtext: {
        color: '#666666',
        fontSize: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
    },
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    loader: {
        marginVertical: 20,
    },
    error: {
        color: 'red',
        marginVertical: 16,
        textAlign: 'center',
    },
    summaryContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    paginationButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: 'black',
    },
    disabledButton: {
        opacity: 0.5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        maxHeight: '80%',
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: 7,
        padding: 4,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    dateInputContainer: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'start',
    },
    dateTimePicker: {
        backgroundColor: 'white',
        color: 'black',
    },
    dateText: {
        color: 'black'
    }
};