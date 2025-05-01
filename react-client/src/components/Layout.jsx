import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="p-6">
                <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
