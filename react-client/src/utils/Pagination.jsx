export default function Pagination({ meta, onPageChange }) {
    const { current_page, total_pages } = meta;

    const pages = [...Array(total_pages).keys()].map(i => i + 1);

    return (
        <div className="flex gap-2 mt-4">
            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded ${p === current_page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    {p}
                </button>
            ))}
        </div>
    );
}
