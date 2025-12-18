import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const IPDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Data 
  const ip = {
    title: "Decentralized Autonomous Organization for Patent Management",
    owner: "FutureTech Innovations Inc.",
    authority: "USPTO",
    coverage: "Global / USA",
    duration: "20 Years (Expires 2042-03-15)",
    description:
      "Decentralized Autonomous Organization for Patent Management implements community-driven and automated systems that enhance decentralized patent filing and lifecycle management.",
    timeline: [
      { date: "2022-03-15", label: "Application Filed", color: "bg-blue-400" },
      {
        date: "2022-09-20",
        label: "Examination Commenced",
        color: "bg-purple-400",
      },
      { date: "2024-05-25", label: "Patent Granted", color: "bg-pink-500" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-blue-300 transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white">IP Details</h1>
        <svg
          className="w-6 h-6 text-white hover:text-blue-400 cursor-pointer"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
          <path d="M16 6l-4-4-4 4M12 2v14" />
        </svg>
      </div>

      {/* Top Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">{ip.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-300">
          <div>
            <span className="text-white">Owner:</span> {ip.owner}
          </div>
          <div>
            <span className="text-white">Issuing Authority:</span>{" "}
            {ip.authority}
          </div>
          <div>
            <span className="text-white">Area of Coverage:</span> {ip.coverage}
          </div>
          <div>
            <span className="text-white">Duration:</span> {ip.duration}
          </div>
        </div>

        <p className="mt-4 text-gray-400 text-sm">
          <span className="text-white">Description:</span> {ip.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">
            Legal Status Timeline
          </h3>
          <div className="space-y-6">
            {ip.timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 ${item.color}`} />
                <div>
                  <p className="text-white text-sm">{item.label}</p>
                  <p className="text-gray-400 text-xs">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-300 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          <p className="text-gray-300 text-sm">Patent Document</p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Download PDF
          </button>
        </div>

        {/* Citation Trend */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Citation Trend</h3>

          {/* Simple visual placeholder */}
          <div className="h-32 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-xl" />
          <p className="text-gray-400 text-xs mt-2">
            Citation growth over time (visual analytics)
          </p>
        </div>
      </div>
    </div>
  );
};

export default IPDetails;
