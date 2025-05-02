export interface Kategori {
  id: number;
  nama: string;
  created_at?: string;
  updated_at?: string;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  count: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta: Meta;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ToastMessage {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}