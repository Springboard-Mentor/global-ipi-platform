import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusChart from "./dashboardComponents/StatusChart";
import Pagination from "./dashboardComponents/Pagination";
import StatusBadge from "./dashboardComponents/StatusBadge";
import FilterBar from "./dashboardComponents/FilterBar";
import TableRow from "./dashboardComponents/TableRow";
import KPIStats from "./dashboardComponents/KPIStats";
import { logout } from "../utils/logout";
import LandscapeVisualization from "./dashboardComponents/LandscapeVisualization";
import { fetchAllIPAssets, fetchStatusSummary } from "../api/ipApi";
const IPActivity = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [statusSummary, setStatusSummary] = useState([]);
  useEffect(() => {
    fetchStatusSummary().then((summary) => {
      const formatted = Object.entries(summary).map(([status, count]) => ({
        status,
        count,
      }));
      setStatusSummary(formatted);
    });
  }, []);

  const itemsPerPage = 5;

  // legalstatus
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAllIPAssets().then(setAssets);
  }, []);

  // Filter Logic
  const filtered = assets.filter((entry) => {
    const matchText =
      entry.title?.toLowerCase().includes(search.toLowerCase()) ||
      entry.applicationNumber?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "All" ? true : entry.legalStatus === filterStatus;

    return matchText && matchStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // logout button
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-wide">
          Global-IPI-Platform
        </h1>

        <div className="flex gap-8 text-sm">
          <button
            className="hover:text-purple-300"
            onClick={() => navigate("/dashboard")}
          >
            Home
          </button>
          <button className="hover:text-purple-300 text-purple-300">
            IP Activity
          </button>
          <button
            className="hover:text-purple-300"
            onClick={() => navigate("/legal-status")}
          >
            Legal Status
          </button>
          <button
            className="hover:text-purple-300"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            🔔
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenProfileMenu(!openProfileMenu)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              👤
            </button>
            {/* Dropdown */}
            {openProfileMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-2 text-sm">
                <button
                  onClick={() => {
                    logout(); // clear tokens, sessions, etc.
                    navigate("/"); // redirect after logout
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-white/20 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <h2 className="text-3xl font-bold mb-6">IP Activity</h2>

      {/* KPI CARDS */}
      <KPIStats data={statusSummary} />

      {/* STATUS + LANDSCAPE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 mt-8 items-start">
        {/* LEFT: IP Status Overview CHART */}
        <div className="lg:sticky lg:top-24">
          <div className="animate-fadeIn">
            <StatusChart data={statusSummary} />
          </div>
        </div>

        {/* IP Landscape Visualization */}
        <div className="animate-slideUp 💡">
          <LandscapeVisualization data={assets} />
        </div>
      </div>
      {/* SECTION DIVIDER */}
      <div className="my-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* FILTER BAR */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* MAIN CARD */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 shadow-lg shadow-black/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-purple-200 border-b border-white/10">
              <th className="text-left pb-3">Patent / IP Name</th>
              <th className="text-left pb-3">Track ID</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Filed On</th>
              <th className="text-left pb-3">Last Updated</th>
              <th className="text-left pb-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item, i) => (
              <TableRow
                key={i}
                item={item}
                actions={
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row expand
                      navigate(`/ip/${item.id}`);
                    }}
                    className="px-3 py-1 bg-blue-600/80 hover:bg-blue-700 rounded text-xs text-white transition"
                  >
                    View Details
                  </button>
                }
              >
                <StatusBadge status={item.legalStatus} />
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default IPActivity;
