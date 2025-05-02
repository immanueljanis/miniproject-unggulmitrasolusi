import { useState, useEffect } from 'react';
import { View, TextInput, Alert, ScrollView, Pressable, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const screenWidth = Dimensions.get('window').width;

interface PenjualanFormProps {
    initialData?: {
        id?: number;
        tgl?: string;
        kode_pelanggan?: string;
        items?: Array<{ barang_id: number; qty: number }>;
    };
    onSubmit: (data: {
        tgl?: string;
        kode_pelanggan?: string;
        items?: Array<{ barang_id: number; qty: number }>;
    }) => Promise<void>;
    onClose: () => void;
}

export default function PenjualanForm({ initialData, onSubmit, onClose }: PenjualanFormProps) {
    const [form, setForm] = useState({
        tgl: '',
        kode_pelanggan: '',
        items: [] as Array<{ barang_id: number; qty: number }>,
    });
    const [loading, setLoading] = useState(false);
    const [pelanggans, setPelanggans] = useState<Array<{ id: string, nama: string }>>([]);
    const [barangs, setBarangs] = useState<Array<{ id: number, nama: string }>>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const initializeForm = () => {
            setForm({
                tgl: initialData?.tgl || new Date().toISOString().split('T')[0],
                kode_pelanggan: initialData?.kode_pelanggan || '',
                items: initialData?.items?.length ?
                    [...initialData.items] :
                    [{ barang_id: 0, qty: 1 }]
            });
        };

        initializeForm();
    }, [initialData]);

    const fetchData = async () => {
        try {
            const [pelRes, barangRes] = await Promise.all([
                fetch(`${process.env.EXPO_PUBLIC_API_URL}/pelanggan`),
                fetch(`${process.env.EXPO_PUBLIC_API_URL}/barang`)
            ]);

            const pelData = await pelRes.json();
            const barangData = await barangRes.json();

            setPelanggans(pelData.data || []);
            setBarangs(barangData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setForm({ ...form, tgl: formattedDate });
        }
    };

    const handleAddItem = () => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, { barang_id: 0, qty: 1 }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        if (form.items.length <= 1) return;

        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...form.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setForm(prev => ({ ...prev, items: newItems }));
    };

    const handleSubmit = async () => {
        if (!form.kode_pelanggan || form.items.some(item => item.barang_id === 0)) {
            Alert.alert('Error', 'Pelanggan dan semua barang harus dipilih');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(form);
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan penjualan');
        } finally {
            setLoading(false);
        }
    };

    const truncateText = (text: string, maxLength = 20) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <ScrollView style={styles.container}>
            <ThemedText type="title">{initialData?.id ? 'Edit Penjualan' : 'Tambah Penjualan'}</ThemedText>

            <View>
                <Pressable
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateInput}>
                    <ThemedText style={styles.dateText}>{form.tgl || 'Pilih Tanggal'}</ThemedText>
                </Pressable>
                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(form.tgl || Date.now())}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <Picker
                selectedValue={form.kode_pelanggan}
                onValueChange={(value) => setForm({ ...form, kode_pelanggan: value })}
                style={styles.picker}>
                <Picker.Item label="Pilih Pelanggan" value="" />
                {pelanggans.map(pel => (
                    <Picker.Item
                        key={pel.id}
                        label={pel.nama}
                        value={pel.id}
                    />
                ))}
            </Picker>

            <ThemedText style={styles.sectionTitle}>Items:</ThemedText>

            {form.items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <Picker
                        selectedValue={item.barang_id}
                        onValueChange={(value) => handleItemChange(index, 'barang_id', value)}
                        style={styles.itemPicker}
                        dropdownIconColor="#000"
                        mode="dropdown">
                        <Picker.Item label="Pilih Barang" value={0} />
                        {barangs.map(brg => (
                            <Picker.Item
                                key={brg.id}
                                label={brg.nama}
                                value={brg.id}
                                style={{ fontSize: 8.5 }}
                            />
                        ))}
                    </Picker>

                    <TextInput
                        style={styles.qtyInput}
                        placeholder="Qty"
                        value={item.qty.toString()}
                        onChangeText={(text) => handleItemChange(index, 'qty', parseInt(text) || 0)}
                        keyboardType="numeric"
                    />

                    {form.items.length > 1 && (
                        <Pressable
                            onPress={() => handleRemoveItem(index)}
                            style={styles.removeButton}>
                            <MaterialCommunityIcons name="delete" size={20} color="red" />
                        </Pressable>
                    )}
                </View>
            ))}

            <Button style={styles.addButton} onPress={handleAddItem}>
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                <ThemedText style={styles.addButtonText}>Tambah Item</ThemedText>
            </Button>

            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={onClose}>
                    <ThemedText>Batal</ThemedText>
                </Button>
                <Button style={styles.button} onPress={handleSubmit} loading={loading}>
                    <ThemedText>Simpan</ThemedText>
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = {
    container: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxHeight: '100%',
        backgroundColor: 'black'
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white'
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10,
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 5,
    },
    itemPicker: {
        flex: 3,
        height: 50,
        backgroundColor: 'white',
        maxWidth: screenWidth * 0.65,
    },
    qtyInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
        textAlign: 'center',
    },
    removeButton: {
        padding: 10,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    button: {
        flex: 1,
        marginHorizontal: 5
    },
    dateInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    dateText: {
        color: 'black'
    }
};