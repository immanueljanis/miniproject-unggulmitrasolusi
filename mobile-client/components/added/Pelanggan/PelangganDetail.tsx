import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { Pelanggan } from '@/app/types/pelanggan';

interface PelangganDetailProps {
    data: Pelanggan;
    onClose: () => void;
    onEdit: () => void;
}

export default function PelangganDetail({ data, onClose, onEdit }: PelangganDetailProps) {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Detail Pelanggan</ThemedText>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>ID:</ThemedText>
                <ThemedText>{data.id_pelanggan}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Nama:</ThemedText>
                <ThemedText>{data.nama}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Domisili:</ThemedText>
                <ThemedText>{data.domisili}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Jenis Kelamin:</ThemedText>
                <ThemedText>{data.jenis_kelamin === 'pria' ? 'Pria' : 'Wanita'}</ThemedText>
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