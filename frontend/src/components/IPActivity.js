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
import { fetchAllIPAssets, fetchStatusSummary, subscribeToIP, listSubscriptions } from "../api/ipApi";
const IPActivity = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [statusSummary, setStatusSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // legalstatus
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, assetsData] = await Promise.all([
          fetchStatusSummary().catch(err => {
            console.error("Error fetching status summary:", err);
            return {};
          }),
          fetchAllIPAssets().catch(err => {
            console.error("Error fetching IP assets:", err);
            throw err;
          })
        ]);
        
        const formatted = Object.entries(summaryData).map(([status, count]) => ({
          status,
          count,
        }));
        setStatusSummary(formatted);
        setAssets(assetsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load IP assets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filtered = assets.filter((entry) => {
    const matchText =
      entry.title?.toLowerCase().includes(search.toLowerCase()) ||
      entry.applicationNumber?.toLowerCase().includes(search.toLowerCase());

    // Normalize status comparison (case-insensitive)
    const normalizedEntryStatus = entry.legalStatus ? entry.legalStatus.toUpperCase() : "";
    const normalizedFilterStatus = filterStatus === "All" ? "All" : filterStatus.toUpperCase();
    
    const matchStatus =
      normalizedFilterStatus === "All" ? true : normalizedEntryStatus === normalizedFilterStatus;

    return matchText && matchStatus;
  });

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // State for components
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [watchedIds, setWatchedIds] = useState(new Set());

  useEffect(() => {
    // Load existing subscriptions
    listSubscriptions().then((data) => {
      const ids = new Set(data.content.map(s => s.ipAssetId));
      setWatchedIds(ids);
    }).catch(console.error);
  }, []);

  const handleWatch = async (id) => {
    try {
      await subscribeToIP(id);
      setWatchedIds(prev => new Set([...prev, id]));
      alert("Asset added to watchlist!");
    } catch (err) {
      alert("Failed to watch asset. You might already be watching it.");
    }
  };

  const handleExport = (item) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `IP_Asset_${item.applicationNumber || item.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/60">Loading IP assets...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-white/60 mb-2">No IP assets found</p>
              <p className="text-white/40 text-sm">
                {search || filterStatus !== "All"
                  ? "Try adjusting your search or filters"
                  : "Start by searching for patents from the IP Search page"}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-200 border-b border-white/10">
                <th className="text-left pb-3">Patent / IP Name</th>
                <th className="text-left pb-3">Track ID</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Filed On</th>
                <th className="text-left pb-3">Last Updated</th>
                <th className="text-left pb-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item, i) => (
                <TableRow
                  key={item.id || i}
                  item={item}
                  actions={
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Navigating to IP details for ID:", item.id);
                          if (item.id) {
                            navigate(`/ip/${item.id}`);
                          } else {
                            console.error("No ID found for item:", item);
                          }
                        }}
                        className="p-1.5 bg-blue-600/80 hover:bg-blue-700 rounded text-xs text-white transition tooltip flex items-center justify-center min-w-[32px] min-h-[32px]"
                        title="View Details"
                      >
                        <span className="text-base leading-none">👁️</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWatch(item.id);
                        }}
                        disabled={watchedIds.has(item.id)}
                        className={`p-1.5 rounded text-xs text-white transition ${
                          watchedIds.has(item.id) 
                            ? "bg-green-600/50 cursor-not-allowed" 
                            : "bg-purple-600/80 hover:bg-purple-700"
                        }`}
                        title={watchedIds.has(item.id) ? "Watching" : "Watch status"}
                      >
                        {watchedIds.has(item.id) ? "✅" : "🔔"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(item);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition"
                        title="Export JSON"
                      >
                        📥
                      </button>
                    </div>
                  }
                >
                  <StatusBadge status={item.legalStatus} />
                </TableRow>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && !error && filtered.length > 0 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
};

export default IPActivity;
