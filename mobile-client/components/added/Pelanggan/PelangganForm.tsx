import { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { Picker } from '@react-native-picker/picker';
import { Pelanggan } from '@/app/types/pelanggan';

interface PelangganFormProps {
    initialData?: Partial<Pelanggan>;
    onSubmit: (data: {
        nama: string;
        domisili: string;
        jenis_kelamin: 'pria' | 'wanita';
    }) => Promise<void>;
    onClose: () => void;
}

export default function PelangganForm({ initialData, onSubmit, onClose }: PelangganFormProps) {
    const [form, setForm] = useState({
        nama: initialData?.nama || '',
        domisili: initialData?.domisili || '',
        jenis_kelamin: initialData?.jenis_kelamin || 'pria',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.nama.trim() || !form.domisili.trim()) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(form);
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan pelanggan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">{initialData?.id ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Nama Pelanggan"
                value={form.nama}
                onChangeText={(text) => setForm({ ...form, nama: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Domisili"
                value={form.domisili}
                onChangeText={(text) => setForm({ ...form, domisili: text })}
            />

            <Picker
                selectedValue={form.jenis_kelamin}
                onValueChange={(value) => setForm({ ...form, jenis_kelamin: value })}
                style={styles.picker}>
                <Picker.Item label="Pria" value="pria" />
                <Picker.Item label="Wanita" value="wanita" />
            </Picker>

            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={onClose}>
                    <ThemedText>Batal</ThemedText>
                </Button>
                <Button style={styles.button} onPress={handleSubmit} loading={loading}>
                    <ThemedText>Simpan</ThemedText>
                </Button>
            </View>
        </ThemedView>
    );
}

const styles = {
    container: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
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