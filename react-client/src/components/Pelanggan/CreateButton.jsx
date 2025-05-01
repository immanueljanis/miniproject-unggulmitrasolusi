import { useState } from "react";
import CreateForm from "./CreateForm";

export default function CreateButton({ refreshData, showToast }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button
                onClick={openModal}
                className="bg-blue-500 text-white p-2 rounded mb-4"
            >
                Create Pelanggan
            </button>
            {isModalOpen && (
                <CreateForm
                    closeModal={closeModal}
                    refreshData={refreshData}
                    showToast={showToast}
                />
            )}
        </div>
    );
}