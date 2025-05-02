import { StyleSheet, Pressable, TextInput, View, ActivityIndicator, Alert, Modal } from 'react-native';
import { Link } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import KategoriForm from '@/components/added/Kategori/KategoriForm';
import KategoriDetail from '@/components/added/Kategori/KategoriDetail';

interface Kategori {
    id: number;
    nama: string;
}

interface ApiResponse {
    data: Kategori[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export default function KategoriScreen() {
    const [categories, setCategories] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'nama'>('nama');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [fromTo, setFromTo] = useState({});
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<Kategori | null>(null);

    const handleViewDetail = (kategori: Kategori) => {
        setSelectedDetail(kategori);
        setDetailVisible(true);
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            let url = `${process.env.EXPO_PUBLIC_API_URL}/kategori`;
            const params = new URLSearchParams({
                per_page: '5',
                sort_by: sortBy,
                sort_dir: sortDir,
                page: page.toString(),
            });

            if (debouncedSearchTerm) {
                params.append('nama', debouncedSearchTerm);
            }

            const response = await fetch(`${url}?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();

            setCategories(data.data);
            setTotalPages(Math.ceil(data.meta.total / data.meta.per_page));
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
        fetchCategories();
    }, [debouncedSearchTerm, sortBy, sortDir, page]);

    const toggleSortDirection = () => {
        setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState<{ id?: number; nama: string } | null>(null);

    const handleAdd = () => {
        setSelectedKategori({ nama: '' });
        setModalVisible(true);
    };

    const handleEdit = (kategori: Kategori) => {
        setSelectedKategori(kategori);
        setModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Konfirmasi',
            'Apakah Anda yakin ingin menghapus kategori ini?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', onPress: () => deleteKategori(id) },
            ]
        );
    };

    const deleteKategori = async (id: number) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/kategori/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            fetchCategories();
            Alert.alert('Sukses', 'Kategori berhasil dihapus');
        } catch (error) {
            Alert.alert('Error', 'Gagal menghapus kategori');
        }
    };

    const handleSubmit = async (data: { nama: string }) => {
        try {
            const url = selectedKategori?.id
                ? `${process.env.EXPO_PUBLIC_API_URL}/kategori/${selectedKategori.id}`
                : `${process.env.EXPO_PUBLIC_API_URL}/kategori`;

            const response = await fetch(url, {
                method: selectedKategori?.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to save');

            fetchCategories();
            return true;
        } catch (error) {
            console.error('Save error:', error);
            throw error;
        }
    };


    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <MaterialCommunityIcons
                    name="newspaper-variant-multiple-outline"
                    size={310}
                    style={styles.headerImage}
                    color={'#D0D0D0'}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Master Kategori</ThemedText>
                <Link href="/kategori/create" asChild>
                    <Pressable>
                        <IconSymbol name="plus" size={24} color={'#000'} />
                    </Pressable>
                </Link>
            </ThemedView>

            <Pressable style={styles.addButton} onPress={handleAdd}>
                <MaterialCommunityIcons name="plus" size={24} color="white" />
                <ThemedText style={styles.addButtonText}>Tambah Kategori</ThemedText>
            </Pressable>

            <TextInput
                style={styles.searchInput}
                placeholder="Cari kategori..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            <ThemedView style={styles.sortContainer}>
                <Pressable onPress={toggleSortDirection} style={styles.sortButton}>
                    <ThemedText>Sort by Name: {sortDir.toUpperCase()}</ThemedText>
                    <IconSymbol name={sortDir === 'asc' ? 'arrow.up' : 'arrow.down'} size={16} color={'#000'} />
                </Pressable>
            </ThemedView>

            {loading && <ActivityIndicator size="large" style={styles.loader} />}

            {error && <ThemedText style={styles.error}>{error}</ThemedText>}

            <View style={styles.listContainer}>
                {categories.map((item, index) => (
                    <View key={item.id} style={styles.itemRow}>
                        <View style={styles.itemContent}>
                            <ThemedText style={styles.number}>{(page - 1) * 5 + index + 1}.</ThemedText>
                            <ThemedText style={styles.itemName}>{item.nama}</ThemedText>
                            {item.active && (
                                <View style={styles.actionButtons}>
                                    <Pressable
                                        style={styles.iconButton}
                                        onPress={() => handleViewDetail(item)}>
                                        <MaterialCommunityIcons name="eye" size={20} color="blue" />
                                    </Pressable>
                                    <Pressable
                                        style={styles.iconButton}
                                        onPress={() => handleEdit(item)}>
                                        <MaterialCommunityIcons name="pencil" size={20} color="black" />
                                    </Pressable>
                                    <Pressable
                                        style={styles.iconButton}
                                        onPress={() => handleDelete(item.id)}>
                                        <MaterialCommunityIcons name="delete" size={20} color="red" />
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <KategoriForm
                            initialData={selectedKategori || undefined}
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
                        {selectedDetail && (
                            <KategoriDetail
                                data={selectedDetail}
                                onClose={() => setDetailVisible(false)}
                                onEdit={() => {
                                    setDetailVisible(false);
                                    handleEdit(selectedDetail);
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>

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
        </ParallaxScrollView>
    );
}

const styles: any = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemText: {
        flex: 1,
    },
    actionButton: {
        padding: 4,
    },
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
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
    sortContainer: {
        marginBottom: 16,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
    },
    summaryContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    loader: {
        marginVertical: 20,
    },
    error: {
        color: 'red',
        marginVertical: 16,
        textAlign: 'center',
    },
    empty: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#666',
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
    listContainer: {
        flex: 1,
        marginBottom: 16,
    },
    itemRow: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginVertical: 6,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    number: {
        width: 30,
        color: '#000000',
        fontWeight: '500',
    },
    itemName: {
        flex: 1,
        color: '#000000',
        fontSize: 16,
        marginRight: 10,
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
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
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
        padding: 20,
    },
});