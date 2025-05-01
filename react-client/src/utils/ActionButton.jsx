import { Link } from "react-router-dom";

export default function TableActionButtons({ onEdit, onDelete, onDetail }) {
    return (
        <div className="flex gap-2">
            {onDetail && (
                <Link to={onDetail} className="text-black hover:underline">Detail</Link>
            )}
            <button onClick={onEdit} className="text-blue-600 hover:underline">Edit</button>
            <button onClick={onDelete} className="text-red-600 hover:underline">Delete</button>
        </div>
    );
}
