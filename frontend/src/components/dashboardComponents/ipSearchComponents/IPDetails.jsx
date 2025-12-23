import React, { useState, useEffect } from "react";
import GoogleMap from "../../GoogleMap";
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

  //  Derived Fields (API-Ready)
  const filingDate = ip.filingDate || ip.date;
  const publicationDate = ip.publicationDate || "2023-09-01";

  // Patent duration (20 years standard)
  const expiryYear = new Date(filingDate).getFullYear() + 20;
  const duration = `20 Years (Expires in ${expiryYear})`;

  //  Legal Timeline (Event-based)
  const timeline = ip.legalTimeline || [
    {
      label: "Application Filed",
      date: filingDate,
      description: "Provisional patent application submitted",
      active: false,
    },
    {
      label: "Examination Commenced",
      date: "2022-09-20",
      description: "Patent office started examination",
      active: false,
    },
    {
      label: "First Office Action Issued",
      date: "2023-01-05",
      description: "Initial examination report issued",
      active: false,
    },
    {
      label: "Response Filed",
      date: "2023-07-10",
      description: "Applicant responded to office action",
      active: false,
    },
    {
      label: "Published",
      date: publicationDate,
      description: "Patent published for public access",
      active: false,
    },
    {
      label: "Notice of Allowance",
      date: "2024-02-18",
      description: "Patent allowed by authority",
      active: false,
    },
    {
      label: "Patent Granted",
      date: "2024-05-25",
      description: "Patent officially granted",
      active: true,
    },
  ];
  //  Status Badge Styling
  const statusColor =
    {
      Granted: "bg-green-500",
      Active: "bg-green-500",
      Pending: "bg-yellow-500",
      Expired: "bg-gray-500",
    }[ip.status] || "bg-blue-500";

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
        <span />
      </div>

      {/* Top Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">{ip.title}</h2>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-xs rounded-full text-white ${statusColor}`}
          >
            {ip.status}
          </span>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          {/* Subscribe */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600/80 hover:bg-blue-700 rounded-lg text-white transition">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 3h14a2 2 0 012 2v16l-9-5-9 5V5a2 2 0 012-2z" />
            </svg>
            Subscribe
          </button>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600/80 hover:bg-purple-700 rounded-lg text-white transition">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            Export
          </button>

          {/* Notify */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-600/80 hover:bg-slate-700 rounded-lg text-white transition">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
              <path d="M9 17a3 3 0 006 0" />
            </svg>
            Notify
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-gray-300">
          <div>
            <span className="text-white">Owner:</span> {ip.assignee}
          </div>
          <div>
            <span className="text-white">Issuing Authority:</span>{" "}
            {ip.jurisdiction}
          </div>
          <div>
            <span className="text-white">Area of Coverage:</span>{" "}
            {ip.coverage || "United States"}
          </div>

          <div>
            <span className="text-white">Application Number:</span> {ip.number}
          </div>
          <div>
            <span className="text-white">Filed Date:</span> {filingDate}
          </div>
          <div>
            <span className="text-white">Publication Date:</span>{" "}
            {publicationDate}
          </div>

          <div>
            <span className="text-white">IP Duration:</span> {duration}
          </div>
        </div>

        <p className="mt-4 text-gray-400 text-sm">
          <span className="text-white">Abstract:</span> {ip.abstract}
        </p>

        {ip.inventor && (
          <p className="mt-2 text-gray-400 text-sm">
            <span className="text-white">Inventor(s):</span> {ip.inventor}
          </p>
        )}

        {/* Location removed from details view per user request */}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-h-[600px] overflow-y-auto hide-scrollbar">
          <h3 className="text-white font-semibold mb-6">
            Legal Status Timeline
          </h3>

          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-white/20" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6">
                  <div className="relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        item.active
                          ? "w-6 h-6 bg-green-400 shadow-[0_0_14px_rgba(34,197,94,0.9)]"
                          : "w-4 h-4 bg-blue-400"
                      } rounded-full border-2 border-white/30`}
                    />
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-400 text-xs">{item.date}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px]">
            <p className="text-gray-300 text-sm mb-3">
              Document preview unavailable
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              View Full Document
            </button>
            <p className="text-gray-500 text-xs mt-3">PDF • Patent document</p>
          </div>

          {/* Citation Trend */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Citation Trend</h3>
            <div className="h-28 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-xl" />
            <p className="text-gray-400 text-xs mt-2">
              Citation growth over time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPDetails;
