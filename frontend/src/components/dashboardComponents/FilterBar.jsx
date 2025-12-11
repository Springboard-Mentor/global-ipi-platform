const FilterBar = ({ search, setSearch, filterStatus, setFilterStatus }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        placeholder="Search IP, patent, tracking ID..."
        className="bg-white/5 border border-white/20 px-4 py-2 rounded-lg w-full md:w-1/3 text-sm placeholder:text-white/40"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="bg-white/5 border border-white/20 px-4 py-2 rounded-lg text-sm"
      >
        <option>All</option>
        <option>Completed</option>
        <option>Pending</option>
        <option>In Review</option>
        <option>Rejected</option>
      </select>
    </div>
  );
};

export default FilterBar;
