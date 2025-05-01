import { useState } from "react";
import CreateForm from "./CreateForm";

export default function CreateButton({ refreshData, showToast, kategoriOptions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button
                onClick={openModal}
                className="bg-blue-500 text-white p-2 rounded mb-4"
            >
                Tambah Barang
            </button>
            {isModalOpen && (
                <CreateForm
                    closeModal={closeModal}
                    refreshData={refreshData}
                    showToast={showToast}
                    kategoriOptions={kategoriOptions}
                />
            )}
        </div>
    );
}