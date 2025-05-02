export interface Kategori {
    id: number;
    nama: string;
}

export interface Barang {
    id: number;
    kode: string;
    nama: string;
    kategori: Kategori;
    harga: number;
    active: number;
}

export interface BarangResponse {
    status: string;
    message: string;
    data: Barang[];
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