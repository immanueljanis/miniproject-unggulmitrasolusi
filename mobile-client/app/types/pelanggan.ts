export interface Pelanggan {
    id: string;
    id_pelanggan: string;
    nama: string;
    domisili: string;
    jenis_kelamin: 'pria' | 'wanita';
}

export interface PelangganResponse {
    status: string;
    message: string;
    data: Pelanggan[];
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