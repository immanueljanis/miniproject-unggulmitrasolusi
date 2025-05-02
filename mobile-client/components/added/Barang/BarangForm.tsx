import { useState, useEffect } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import { Picker } from '@react-native-picker/picker';
import { Barang, Kategori } from '@/app/types/barang';

interface BarangFormProps {
    initialData?: Partial<Barang>;
    onSubmit: (data: {
        nama: string;
        kategori: number;
        harga: string;
    }) => Promise<void>;
    onClose: () => void;
}

export default function BarangForm({ initialData, onSubmit, onClose }: BarangFormProps) {
    const [form, setForm] = useState({
        nama: initialData?.nama || '',
        kategori: initialData?.kategori?.id?.toString() || '',
        harga: initialData?.harga?.toString() || '',
    });
    const [loading, setLoading] = useState(false);
    const [kategories, setKategories] = useState<Kategori[]>([]);

    useEffect(() => {
        const fetchKategories = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/kategori`);
                const data = await response.json();
                setKategories(data.data);

                if (initialData?.kategori?.id && !form.kategori) {
                    setForm(prev => ({
                        ...prev,
                        kategori: initialData.kategori.id.toString()
                    }));
                }
            } catch (error) {
                console.error('Error fetching kategories:', error);
            }
        };

        fetchKategories();
    }, [initialData]);

    const handleSubmit = async () => {
        if (!form.nama.trim() || !form.kategori || !form.harga) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        if (isNaN(Number(form.harga))) {
            Alert.alert('Error', 'Harga harus berupa angka');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                nama: form.nama,
                kategori: Number(form.kategori),
                harga: form.harga,
            });
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan barang');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText type="title">{initialData?.id ? 'Edit Barang' : 'Tambah Barang'}</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Nama Barang"
                value={form.nama}
                onChangeText={(text) => setForm({ ...form, nama: text })}
            />

            <Picker
                selectedValue={form.kategori}
                onValueChange={(value) => setForm({ ...form, kategori: value })}
                style={styles.picker}>
                <Picker.Item label="Pilih Kategori" value="" />
                {kategories.map((kategori) => (
                    <Picker.Item
                        key={kategori.id}
                        label={kategori.nama}
                        value={kategori.id.toString()}
                    />
                ))}
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Harga"
                value={form.harga}
                onChangeText={(text) => setForm({ ...form, harga: text })}
                keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={onClose}>
                    <ThemedText>Batal</ThemedText>
                </Button>
                <Button style={styles.button} onPress={handleSubmit} loading={loading}>
                    <ThemedText>Simpan</ThemedText>
                </Button>
            </View>
        </View>
    );
}

const styles = {
    container: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'black'
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
        width: '100%',
        marginVertical: 10,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
};