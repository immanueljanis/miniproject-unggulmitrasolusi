export interface ItemPenjualan {
    id: number;
    qty: number;
    barang_id: number;
    barang_nama: string;
    barang_harga: number;
}

export interface Penjualan {
    id: number;
    id_nota: string;
    tgl: string;
    subtotal: number;
    pelanggan_nama: string;
    id_pelanggan: string;
    total_item: number;
    item_penjualan?: ItemPenjualan[];
}

export interface PenjualanResponse {
    status: string;
    message: string;
    data: Penjualan[];
    meta: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

export interface SinglePenjualanResponse {
    status: string;
    message: string;
    data: Penjualan;
}