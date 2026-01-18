import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";

const FilingManagement = () => {
  const [activeTab, setActiveTab] = useState("filings");
  const [selectedFiling, setSelectedFiling] = useState(null);

  const filings = [
    {
      id: 1,
      title: "AI-Based Medical Diagnosis System",
      applicant: "TechCorp Inc.",
      status: "Under Review",
      priority: "High",
      submittedDate: "2024-01-10",
      examiner: "Dr. Smith",
      feedback: "Requires additional technical specifications",
    },
    {
      id: 2,
      title: "Renewable Energy Storage Device",
      applicant: "GreenTech Ltd.",
      status: "Pending Response",
      priority: "Medium",
      submittedDate: "2024-01-08",
      examiner: "Prof. Johnson",
      feedback: "Claims need clarification on novelty aspects",
    },
    {
      id: 3,
      title: "Blockchain Security Protocol",
      applicant: "CryptoSafe Corp.",
      status: "Approved",
      priority: "Low",
      submittedDate: "2024-01-05",
      examiner: "Dr. Brown",
      feedback: "Application meets all requirements",
    },
  ];

  const statusOptions = [
    "Under Review",
    "Pending Response",
    "Approved",
    "Rejected",
    "Withdrawn",
  ];

  const priorityOptions = ["Low", "Medium", "High", "Critical"];

  const statusBadge = {
    Approved: "bg-green-900 text-green-300",
    "Under Review": "bg-blue-900 text-blue-300",
    "Pending Response": "bg-yellow-900 text-yellow-300",
    Rejected: "bg-red-900 text-red-300",
    Withdrawn: "bg-gray-700 text-gray-300",
  };

  const priorityBadge = {
    Critical: "bg-red-900 text-red-300",
    High: "bg-orange-900 text-orange-300",
    Medium: "bg-yellow-900 text-yellow-300",
    Low: "bg-green-900 text-green-300",
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Filing Management</h1>
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white">
              Export Report
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
              Bulk Actions
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#30363d]">
          {["filings", "analytics", "feedback"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize ${
                activeTab === tab
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
            ["Total Filings", "1,247"],
            ["Under Review", "456"],
            ["Approved", "678"],
            ["Pending Response", "113"],
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
                <select className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white text-sm">
                  <option>All Status</option>
                  {statusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <select className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white text-sm">
                  <option>All Priority</option>
                  {priorityOptions.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#21262d] border-b border-[#30363d]">
                  <tr>
                    {[
                      "Filing Details",
                      "Status",
                      "Priority",
                      "Examiner",
                      "Date",
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
                  {filings.map((f) => (
                    <tr key={f.id} className="hover:bg-[#21262d]">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{f.title}</p>
                        <p className="text-gray-400 text-sm">{f.applicant}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${statusBadge[f.status]}`}
                        >
                          {f.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${priorityBadge[f.priority]}`}
                        >
                          {f.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {f.examiner}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {f.submittedDate}
                      </td>

                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => setSelectedFiling(f)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View
                        </button>
                        <button className="text-green-400 hover:text-green-300 text-sm">
                          Feedback
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {["Filing Trends", "Processing Times"].map((title) => (
              <div
                key={title}
                className="bg-[#161b22] border border-[#30363d] rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {title}
                </h3>
                <div className="h-64 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center text-gray-400">
                  Chart Placeholder
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FEEDBACK */}
        {activeTab === "feedback" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4">
            {filings.map((f) => (
              <div
                key={f.id}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{f.title}</p>
                    <p className="text-gray-400 text-sm">{f.applicant}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${statusBadge[f.status]}`}
                  >
                    {f.status}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3">{f.feedback}</p>

                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm">
                    Send Update
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm">
                    Request Info
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white text-sm">
                    Schedule Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedFiling && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Filing Details
                </h3>
                <button
                  onClick={() => setSelectedFiling(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-white mb-2">{selectedFiling.title}</p>
              <p className="text-gray-400 mb-4">{selectedFiling.feedback}</p>

              <textarea
                rows="4"
                placeholder="Enter feedback..."
                className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-white"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setSelectedFiling(null)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white py-2"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white py-2">
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default FilingManagement;
