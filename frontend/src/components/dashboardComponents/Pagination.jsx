const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="mt-6 flex justify-end items-center gap-2">
      {/* Prev */}
      <button
        className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-40"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded-lg border ${
            page === i + 1
              ? "bg-purple-600/40 border-purple-200 text-purple-200"
              : "bg-white/10 border-white/20 hover:bg-white/20"
          }`}
        >
          {i + 1}
        </button>
      ))}

      {/* Next */}
      <button
        className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-40"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
