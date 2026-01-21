import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const API_URL = "http://localhost:8081/api/admin/patent-filings";
const BASE_URL = "http://localhost:8081";

const AdminFilingsManagement = () => {
  const [activeTab, setActiveTab] = useState("filings");
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [selectedFiling, setSelectedFiling] = useState(null); // For View/Feedback modal
  const [feedbackText, setFeedbackText] = useState("");
  const [requestedFields, setRequestedFields] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");

  const statusOptions = [
    "FILED",
    "Under Examination",
    "Under Review",
    "Pending Response",
    "APPROVED",
    "GRANTED",
    "REJECTED",
    "Withdrawn",
    "EXPIRED",
    "EXPIRING SOON"
  ];

  const statusBadge = {
    APPROVED: "bg-green-500 text-white",
    GRANTED: "bg-green-500 text-white",
    FILED: "bg-blue-500 text-white",
    "Under Review": "bg-blue-500 text-white",
    "Under Examination": "bg-yellow-500 text-black",
    "Pending Response": "bg-orange-500 text-white",
    REJECTED: "bg-red-500 text-white",
    Withdrawn: "bg-gray-500 text-white",
    EXPIRED: "bg-gray-500 text-white",
    "EXPIRING SOON": "bg-orange-500 text-white"
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/monitoring/all-data`, getAuthHeaders());
      if (response.data && response.data.chartData) {
        setAnalyticsData(response.data.chartData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  useEffect(() => {
    fetchFilings();
    fetchAnalytics();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchFilings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthHeaders());
      setFilings(res.data);
    } catch (err) {
      console.error("Error fetching filings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export`, {
        ...getAuthHeaders(),
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'filings.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed", error);
      alert("Export failed");
    }
  };

  const handleBulkAction = async (action, value) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to ${action} ${selectedIds.length} items?`)) return;

    try {
      await axios.post(`${API_URL}/bulk-action`, {
        ids: selectedIds,
        action, // "DELETE" or "UPDATE_STATUS"
        value
      }, getAuthHeaders());

      setSelectedIds([]);
      fetchFilings();
      alert("Bulk action successful");
    } catch (error) {
      console.error("Bulk action failed", error);
      alert("Bulk action failed");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, newStatus, {
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "text/plain"
        }
      });
      fetchFilings();
    } catch (error) {
      console.error("Update status failed", error);
      alert("Update status failed");
    }
  };

  const handleSendFeedback = async () => {
    if (!selectedFiling) return;
    try {
      const payload = {
        feedback: feedbackText,
        requestedFields: requestedFields
      };
      await axios.put(`${API_URL}/${selectedFiling.id}/feedback`, payload, getAuthHeaders());
      alert("Feedback sent!");
      setFeedbackText("");
      setRequestedFields([]);
      setSelectedFiling(null); // close modal
      fetchFilings();
    } catch (error) {
      console.error("Send feedback failed", error);
      alert("Failed to send feedback");
    }
  };

  const openModal = (filing) => {
    setSelectedFiling(filing);
    setFeedbackText(filing.adminFeedback || "");
    setRequestedFields(filing.requestedUpdateFields || []);
  };

  // Filter logic
  const filteredFilings = filings.filter(f => {
    const matchesStatus = filterStatus === "All Status" || f.status === filterStatus;
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Stats
  const stats = {
    total: filings.length,
    underReview: filings.filter(f => f.status === "Under Review" || f.status === "FILED").length,
    approved: filings.filter(f => f.status === "APPROVED" || f.status === "GRANTED").length,
    pending: filings.filter(f => f.status === "Pending Response").length
  };

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFilings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFilings.map(f => f.id));
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Filing Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
            >
              Export Report
            </button>

            {/* Bulk Actions Dropdown could go here, simplified as buttons for now */}
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("DELETE", "")}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                >
                  Delete Selected ({selectedIds.length})
                </button>
                <button
                  onClick={() => handleBulkAction("UPDATE_STATUS", "APPROVED")}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                >
                  Approve Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#30363d]">
          {["filings", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize ${activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Total Filings", stats.total],
            ["Under Review / Filed", stats.underReview],
            ["Approved / Granted", stats.approved],
            ["Pending Response", stats.pending],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#161b22] border border-[#30363d] rounded-lg p-4"
            >
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* FILINGS TAB */}
        {activeTab === "filings" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Patent Filings
              </h3>

              <div className="flex gap-3">
                <input
                  placeholder="Search..."
                  className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <select
                  className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option>All Status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#21262d] border-b border-[#30363d]">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={selectedIds.length === filteredFilings.length && filteredFilings.length > 0}
                      />
                    </th>
                    {[
                      "Filing Details",
                      "Status",
                      "Date",
                      "App Number",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#30363d]">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-4 text-gray-400">Loading filings...</td></tr>
                  ) : (
                    filteredFilings.map((f) => (
                      <tr key={f.id} className="hover:bg-[#21262d]">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(f.id)}
                            onChange={() => toggleSelection(f.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{f.title}</p>
                          <p className="text-gray-400 text-sm">{f.applicantName} ({f.applicantType})</p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${statusBadge[f.status] || "bg-gray-700 text-gray-300"}`}
                          >
                            {f.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-300">
                          {f.filingDate}
                        </td>

                        <td className="px-6 py-4 text-gray-300 text-sm font-mono">
                          {f.applicationNumber}
                        </td>

                        <td className="px-6 py-4 flex gap-3">
                          <button
                            onClick={() => openModal(f)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            View / Feedback
                          </button>

                          <select
                            className="bg-[#0d1117] border border-[#30363d] text-xs text-white rounded px-2 py-1"
                            value={f.status}
                            onChange={(e) => handleUpdateStatus(f.id, e.target.value)}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {!loading && filteredFilings.length === 0 && (
                <div className="text-center py-8 text-gray-500">No filings found.</div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filing Trends Chart */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Filing Trends (Last 12 Months)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData?.filingTrends || []}>
                    <defs>
                      <linearGradient id="colorFilings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="month" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px' }}
                      itemStyle={{ color: '#c9d1d9' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" dataKey="filings" name="Total Filings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFilings)" />
                    <Area type="monotone" dataKey="grants" name="Grants" stroke="#10b981" fillOpacity={0.3} fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Processing Times Chart */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Avg. Processing Days by Field</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData?.processingTimes || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="field" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px' }}
                      itemStyle={{ color: '#c9d1d9' }}
                    />
                    <Bar dataKey="avgDays" name="Avg. Days to Grant" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* MODAL - View / Feedback */}
        {selectedFiling && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Filing Details
                </h3>
                <button
                  onClick={() => setSelectedFiling(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-300">
                <div>
                  <span className="block text-gray-500">Title</span>
                  <span className="text-white">{selectedFiling.title}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Application #</span>
                  <span className="text-white">{selectedFiling.applicationNumber}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Applicant</span>
                  <span className="text-white">{selectedFiling.applicantName}</span>
                </div>
                <div>
                  <span className="block text-gray-500">Type</span>
                  <span className="text-white">{selectedFiling.patentType}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500">Abstract</span>
                  <span className="text-white">{selectedFiling.abstractText}</span>
                </div>
              </div>

              <div className="border-t border-[#30363d] pt-4">
                <h4 className="text-white font-medium mb-2">Admin Feedback</h4>
                <p className="text-gray-400 text-xs mb-2">
                  This feedback will be visible to the user on their dashboard.
                </p>
                <textarea
                  rows="4"
                  placeholder="Enter feedback for the user (e.g., 'Please provide clearer drawings')..."
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />

                <div className="mt-4">
                  <h5 className="text-white text-sm font-medium mb-2 text-blue-300">Request Field Corrections:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "title", label: "Title" },
                      { id: "abstract", label: "Abstract" },
                      { id: "technicalField", label: "Tech Field" },
                      { id: "novelty", label: "Novelty" },
                      { id: "applicantName", label: "Applicant Name" },
                      { id: "inventors", label: "Inventors" },
                    ].map(field => (
                      <label key={field.id} className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={requestedFields.includes(field.id)}
                          onChange={(e) => {
                            if (e.target.checked) setRequestedFields([...requestedFields, field.id]);
                            else setRequestedFields(requestedFields.filter(f => f !== field.id));
                          }}
                          className="rounded border-[#30363d] bg-[#0d1117]"
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedFiling(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white py-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSendFeedback}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white py-2"
                  >
                    Save & Send Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminFilingsManagement;
