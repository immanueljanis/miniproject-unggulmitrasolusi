import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-black text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Mini Project CRUD</Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/pelanggan" className="hover:underline">Pelanggan</Link>
                    <Link to="/barang" className="hover:underline">Barang</Link>
                    <Link to="/penjualan" className="hover:underline">Penjualan</Link>
                    <Link to="/kategori" className="hover:underline">Kategori</Link>
                </div>
            </div>
        </nav>
    );
}
