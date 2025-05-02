import { StyleSheet, Pressable, TextInput, View, ActivityIndicator, Modal, Alert } from 'react-native';
import { Link } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useDebounce from '@/hooks/useDebounce';
import PelangganForm from '@/components/added/Pelanggan/PelangganForm';
import PelangganDetail from '@/components/added/Pelanggan/PelangganDetail';
import { Pelanggan, PelangganResponse } from '@/app/types/pelanggan';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function PelangganScreen() {
    const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [fromTo, setFromTo] = useState({ from: 0, to: 0 });
    const [modalVisible, setModalVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(null);
    const [filters, setFilters] = useState({
        nama: '',
        id_pelanggan: '',
        domisili: '',
        jenis_kelamin: '',
    });
    const [sortField, setSortField] = useState('id_pelanggan');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const debouncedFilters = useDebounce(filters, 500);

    const fetchPelanggans = async () => {
        try {
            setLoading(true);
            let url = `${process.env.EXPO_PUBLIC_API_URL}/pelanggan`;
            const params = new URLSearchParams({
                per_page: '5',
                page: page.toString(),
                sort_by: sortField,
                sort_dir: sortDirection,
            });

            Object.entries(debouncedFilters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await fetch(`${url}?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: PelangganResponse = await response.json();
            setPelanggans(data.data);
            setTotalPages(data.meta.total_pages);
            setTotalData(data.meta.total);
            setFromTo(data.meta);
        } catch (err) {
            console.error('Full error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPelanggans();
    }, [debouncedFilters, sortField, sortDirection, page]);

    const handleAdd = () => {
        setSelectedPelanggan(null);
        setModalVisible(true);
    };

    const handleEdit = (pelanggan: Pelanggan) => {
        setSelectedPelanggan(pelanggan);
        setModalVisible(true);
    };

    const handleViewDetail = (pelanggan: Pelanggan) => {
        setSelectedPelanggan(pelanggan);
        setDetailVisible(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Konfirmasi',
            'Apakah Anda yakin ingin menghapus pelanggan ini?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', onPress: () => deletePelanggan(id) },
            ]
        );
    };

    const deletePelanggan = async (id: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/pelanggan/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            fetchPelanggans();
            Alert.alert('Sukses', 'Pelanggan berhasil dihapus');
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus pelanggan');
        }
    };

    const handleSubmit = async (data: {
        nama: string;
        domisili: string;
        jenis_kelamin: 'pria' | 'wanita';
    }) => {
        try {
            const url = selectedPelanggan?.id
                ? `${process.env.EXPO_PUBLIC_API_URL}/pelanggan/${selectedPelanggan.id}`
                : `${process.env.EXPO_PUBLIC_API_URL}/pelanggan`;

            const method = selectedPelanggan?.id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to save');

            fetchPelanggans();
            return true;
        } catch (error) {
            console.error('Save error:', error);
            throw error;
        }
    };

    const handlePrevPage = () => page > 1 && setPage(page - 1);
    const handleNextPage = () => page < totalPages && setPage(page + 1);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <MaterialCommunityIcons
                    name="account-group"
                    size={310}
                    style={styles.headerImage}
                    color={'#D0D0D0'}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Master Pelanggan</ThemedText>
            </ThemedView>

            <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                <ThemedText style={styles.createButtonText}>Tambah Pelanggan</ThemedText>
            </Pressable>

            <ThemedView style={styles.filterContainer}>
                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter ID Pelanggan"
                    value={filters.id_pelanggan}
                    onChangeText={(text) => setFilters({ ...filters, id_pelanggan: text })}
                />

                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter Nama"
                    value={filters.nama}
                    onChangeText={(text) => setFilters({ ...filters, nama: text })}
                />

                <TextInput
                    style={styles.filterInput}
                    placeholder="Filter Domisili"
                    value={filters.domisili}
                    onChangeText={(text) => setFilters({ ...filters, domisili: text })}
                />

                <Picker
                    selectedValue={filters.jenis_kelamin}
                    onValueChange={(value) => setFilters({ ...filters, jenis_kelamin: value })}
                    style={styles.filterPicker}>
                    <Picker.Item label="Semua Jenis Kelamin" value="" />
                    <Picker.Item label="Pria" value="pria" />
                    <Picker.Item label="Wanita" value="wanita" />
                </Picker>
            </ThemedView>

            <ThemedView style={styles.sortContainer}>
                <Picker
                    selectedValue={sortField}
                    onValueChange={setSortField}
                    style={styles.sortPicker}>
                    <Picker.Item label="Sort by ID" value="id_pelanggan" />
                    <Picker.Item label="Sort by Nama" value="nama" />
                    <Picker.Item label="Sort by Domisili" value="domisili" />
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

            <View style={styles.listContainer}>
                {pelanggans.map((item, index) => (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={styles.itemContent}>
                            <ThemedText style={styles.number}>{(page - 1) * 5 + index + 1}.</ThemedText>
                            <View style={styles.itemTextContainer}>
                                <ThemedText style={styles.itemName}>{item.nama}</ThemedText>
                                <ThemedText style={styles.itemSubtext}>{item.id_pelanggan} • {item.domisili}</ThemedText>
                            </View>
                            <View style={styles.actionButtons}>
                                <Pressable onPress={() => handleViewDetail(item)} style={styles.iconButton}>
                                    <MaterialCommunityIcons name="eye" size={20} color={'blue'} />
                                </Pressable>
                                <Pressable onPress={() => handleEdit(item)} style={styles.iconButton}>
                                    <MaterialCommunityIcons name="pencil" size={20} color={'#000000'} />
                                </Pressable>
                                <Pressable onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                                    <MaterialCommunityIcons name="delete" size={20} color="red" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <ThemedView style={styles.summaryContainer}>
                <ThemedText>Showing {fromTo.count} of {fromTo.total} items</ThemedText>
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

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <PelangganForm
                            initialData={selectedPelanggan || undefined}
                            onSubmit={handleSubmit}
                            onClose={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                visible={detailVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setDetailVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedPelanggan && (
                            <PelangganDetail
                                data={selectedPelanggan}
                                onClose={() => setDetailVisible(false)}
                                onEdit={() => {
                                    setDetailVisible(false);
                                    handleEdit(selectedPelanggan);
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <PelangganForm
                            initialData={selectedPelanggan || undefined}
                            onSubmit={async (data) => {
                                try {
                                    const url = selectedPelanggan?.id
                                        ? `${process.env.EXPO_PUBLIC_API_URL}/pelanggan/${selectedPelanggan.id}`
                                        : `${process.env.EXPO_PUBLIC_API_URL}/pelanggan`;

                                    const method = selectedPelanggan?.id ? 'PUT' : 'POST';

                                    const response = await fetch(url, {
                                        method,
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                                    });

                                    if (!response.ok) throw new Error('Failed to save');

                                    fetchPelanggans();
                                    setModalVisible(false);
                                    Alert.alert('Sukses', `Pelanggan berhasil ${selectedPelanggan?.id ? 'diupdate' : 'ditambahkan'}`);
                                } catch (error) {
                                    Alert.alert('Error', 'Gagal menyimpan pelanggan');
                                }
                            }}
                            onClose={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: 'white',
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
    number: {
        width: 30,
        color: '#000000',
        fontWeight: '500',
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
    filterPicker: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
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
    createButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    createButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
    },
});