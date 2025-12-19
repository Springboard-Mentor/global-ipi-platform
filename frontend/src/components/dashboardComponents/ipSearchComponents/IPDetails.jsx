import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const IPDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const ip = location.state?.ip;

  if (!ip) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div>
          <p className="mb-4">No IP data available.</p>
          <button
            onClick={() => navigate("/ip-search")}
            className="px-4 py-2 bg-blue-600 rounded-lg"
          >
            Go Back to Search
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-white">Owner:</span> {ip.assignee}
          </div>
          <div>
            <span className="text-white">Issuing Authority:</span>{" "}
            {ip.jurisdiction}
          </div>
          <div>
            <span className="text-white">IP Number:</span> {ip.number}
          </div>
          <div>
            <span className="text-white">Status:</span> {ip.status}
          </div>
        </div>

        <p className="mt-4 text-gray-400 text-sm">
          <span className="text-white">Abstract:</span> {ip.abstract}
        </p>

        <p className="mt-2 text-gray-400 text-sm">
          <span className="text-white">Filed Date:</span> {ip.date}
        </p>

        {ip.inventor && (
          <p className="mt-2 text-gray-400 text-sm">
            <span className="text-white">Inventor:</span> {ip.inventor}
          </p>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Legal Status Timeline
            </h3>
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
    </div>
  );
};

export default IPDetails;
