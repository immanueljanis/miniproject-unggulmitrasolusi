import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { Barang } from '@/app/types/barang';

interface BarangDetailProps {
    data: Barang;
    onClose: () => void;
    onEdit: () => void;
}

export default function BarangDetail({ data, onClose, onEdit }: BarangDetailProps) {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Detail Barang</ThemedText>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Kode:</ThemedText>
                <ThemedText>{data.kode}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Nama:</ThemedText>
                <ThemedText>{data.nama}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Kategori:</ThemedText>
                <ThemedText>{data.kategori.nama}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Harga:</ThemedText>
                <ThemedText>Rp {data.harga.toLocaleString()}</ThemedText>
            </View>

            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={onClose}>
                    <ThemedText>Tutup</ThemedText>
                </Button>
                <Button style={styles.button} onPress={onEdit}>
                    <ThemedText>Edit</ThemedText>
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
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
};