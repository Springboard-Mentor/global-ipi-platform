import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleData = [
  {
    id: "IP-12345",
    name: "AI Fraud Detection System",
    type: "Patent",
    status: "Completed",
    filedOn: "2025-01-10",
    updatedOn: "2025-02-03",
  },
  {
    id: "IP-98765",
    name: "Global IP Intelligence Tracker",
    type: "Patent",
    status: "Pending",
    filedOn: "2025-02-15",
    updatedOn: "2025-02-20",
  },
];

const getStatusColor = (status) => {
 switch (status) {
    case "Completed":
      return "bg-green-400/20 text-green-300 border-green-400/40";
    case "Pending":
      return "bg-yellow-400/20 text-yellow-300 border-yellow-400/40";
    case "In Review":
      return "bg-blue-400/20 text-blue-300 border-blue-400/40";
    case "Rejected":
      return "bg-red-400/20 text-red-300 border-red-400/40";
    default:
      return "bg-gray-400/20 text-gray-300 border-gray-400/40";
  }
};

const IPActivity = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = sampleData.filter((entry) => {
    const matchText =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.id.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "All" ? true : entry.status === filterStatus;

    return matchText && matchStatus;
  });


 return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-wide">
          Global-IPI-Platform
        </h1>

        <div className="flex gap-8 text-sm">
          <button className="hover:text-purple-300" onClick={() => navigate("/dashboard")}>
            Home
          </button>
          <button className="hover:text-purple-300 text-purple-300">
            IP Activity
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
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            👤
          </div>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <h2 className="text-3xl font-bold mb-6">IP Activity</h2>

      {/* FILTER BAR */}
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
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, i) => (
              <tr
                key={i}
                className="border-b border-white/10 hover:bg-white/5 transition"
              >
                <td className="py-3">{item.name}</td>
                <td className="py-3 text-purple-200">{item.id}</td>

                <td className="py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="py-3 text-white/60">{item.filedOn}</td>
                <td className="py-3 text-white/60">{item.updatedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default IPActivity;
