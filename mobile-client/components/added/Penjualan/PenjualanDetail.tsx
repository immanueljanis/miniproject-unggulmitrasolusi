import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';

interface PenjualanDetailProps {
    data: {
        id: number;
        id_nota: string;
        tgl: string;
        pelanggan_nama: string;
        subtotal: number;
        item_penjualan: Array<{
            id: number;
            qty: number;
            barang_nama: string;
            barang_harga: number;
        }>;
    };
    onClose: () => void;
    onEdit: () => void;
}

export default function PenjualanDetail({ data, onClose, onEdit }: PenjualanDetailProps) {
    return (
        <View style={styles.container}>
            <ThemedText type="title">Detail Penjualan</ThemedText>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>No. Nota:</ThemedText>
                <ThemedText>{data.id_nota}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Tanggal:</ThemedText>
                <ThemedText>{data.tgl}</ThemedText>
            </View>

            <View style={styles.detailItem}>
                <ThemedText style={styles.label}>Pelanggan:</ThemedText>
                <ThemedText>{data.pelanggan_nama}</ThemedText>
            </View>

            <ThemedText style={styles.sectionTitle}>Items:</ThemedText>

            {data.item_penjualan.map((item, index) => (
                <View key={item.id} style={styles.itemRow}>
                    <ThemedText style={styles.itemName}>{item.barang_nama}</ThemedText>
                    <View style={styles.itemDetail}>
                        <ThemedText>Qty: {item.qty}</ThemedText>
                        <ThemedText>Rp {item.barang_harga.toLocaleString()}</ThemedText>
                        <ThemedText>Rp {(item.qty * item.barang_harga).toLocaleString()}</ThemedText>
                    </View>
                </View>
            ))}

            <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Subtotal:</ThemedText>
                <ThemedText style={styles.totalValue}>Rp {data.subtotal.toLocaleString()}</ThemedText>
            </View>

            <View style={styles.buttonContainer}>
                <Button style={styles.button} onPress={onClose}>
                    <ThemedText>Tutup</ThemedText>
                </Button>
                <Button style={styles.button} onPress={onEdit}>
                    <ThemedText>Edit</ThemedText>
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
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    itemRow: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemName: {
        fontWeight: '500',
    },
    itemDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalValue: {
        fontWeight: 'bold',
        fontSize: 16,
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