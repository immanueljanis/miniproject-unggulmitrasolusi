import { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';

interface KategoriFormProps {
    initialData?: { id?: number; nama: string };
    onSubmit: (data: { nama: string }) => Promise<void>;
    onClose: () => void;
}

export default function KategoriForm({ initialData, onSubmit, onClose }: KategoriFormProps) {
    const [nama, setNama] = useState(initialData?.nama || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!nama.trim()) {
            Alert.alert('Error', 'Nama kategori tidak boleh kosong');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({ nama });
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Gagal menyimpan kategori');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">{initialData?.id ? 'Edit Kategori' : 'Tambah Kategori'}</ThemedText>

            <TextInput
                style={styles.input}
                placeholder="Nama Kategori"
                value={nama}
                onChangeText={setNama}
            />

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