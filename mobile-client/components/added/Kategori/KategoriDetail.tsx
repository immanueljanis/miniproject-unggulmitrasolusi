import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';

interface KategoriDetailProps {
    data: { id: number; nama: string };
    onClose: () => void;
    onEdit: () => void;
}

export default function KategoriDetail({ data, onClose, onEdit }: KategoriDetailProps) {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Detail Kategori</ThemedText>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>ID:</ThemedText>
                <ThemedText>{data.id}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Nama:</ThemedText>
                <ThemedText>{data.nama}</ThemedText>
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
        justifyContent: 'text-start',
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