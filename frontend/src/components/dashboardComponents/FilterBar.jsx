const FilterBar = ({ search, setSearch, filterStatus, setFilterStatus }) => {
  // Status options matching backend statuses
  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "GRANTED", label: "Granted" },
    { value: "FILED", label: "Filed" },
    { value: "UNDER_EXAMINATION", label: "Under Examination" },
    { value: "PENDING_REVIEW", label: "Pending Review" },
    { value: "EXPIRED", label: "Expired" },
    { value: "PUBLISHED", label: "Published" }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        placeholder="Search IP, patent, tracking ID..."
        className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg w-full md:w-1/3 text-white text-sm placeholder:text-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg text-white text-sm"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
