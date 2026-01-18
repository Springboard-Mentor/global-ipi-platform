import React, { useState } from 'react';

const FilingManagement = () => {
  const [activeTab, setActiveTab] = useState('filings');
  const [selectedFiling, setSelectedFiling] = useState(null);

  const filings = [
    { id: 1, title: 'AI-Based Medical Diagnosis System', applicant: 'TechCorp Inc.', status: 'Under Review', priority: 'High', submittedDate: '2024-01-10', examiner: 'Dr. Smith', feedback: 'Requires additional technical specifications' },
    { id: 2, title: 'Renewable Energy Storage Device', applicant: 'GreenTech Ltd.', status: 'Pending Response', priority: 'Medium', submittedDate: '2024-01-08', examiner: 'Prof. Johnson', feedback: 'Claims need clarification on novelty aspects' },
    { id: 3, title: 'Blockchain Security Protocol', applicant: 'CryptoSafe Corp.', status: 'Approved', priority: 'Low', submittedDate: '2024-01-05', examiner: 'Dr. Brown', feedback: 'Application meets all requirements' },
  ];

  const statusOptions = ['Under Review', 'Pending Response', 'Approved', 'Rejected', 'Withdrawn'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500';
      case 'Under Review': return 'bg-blue-500';
      case 'Pending Response': return 'bg-yellow-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusUpdate = (filingId, newStatus) => {
    console.log(`Update filing ${filingId} status to ${newStatus}`);
  };

  const handleSendFeedback = (filingId, feedback) => {
    console.log(`Send feedback for filing ${filingId}: ${feedback}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Filing Management</h1>
        <div className="flex gap-3">
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition">
            Export Report
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/20">
        {['filings', 'analytics', 'feedback'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 capitalize transition ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Filings</p>
          <p className="text-2xl font-bold text-white">1,247</p>
          <p className="text-green-400 text-sm">+23 this week</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Under Review</p>
          <p className="text-2xl font-bold text-white">456</p>
          <p className="text-blue-400 text-sm">Avg. 12 days</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Approved</p>
          <p className="text-2xl font-bold text-white">678</p>
          <p className="text-green-400 text-sm">54% approval rate</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Pending Response</p>
          <p className="text-2xl font-bold text-white">113</p>
          <p className="text-yellow-400 text-sm">Awaiting applicant</p>
        </div>
      </div>

      {activeTab === 'filings' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Patent Filings</h3>
            <div className="flex gap-3">
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                <option value="all">All Priority</option>
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-400 py-3">Filing Details</th>
                  <th className="text-left text-gray-400 py-3">Status</th>
                  <th className="text-left text-gray-400 py-3">Priority</th>
                  <th className="text-left text-gray-400 py-3">Examiner</th>
                  <th className="text-left text-gray-400 py-3">Date</th>
                  <th className="text-right text-gray-400 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filings.map((filing) => (
                  <tr key={filing.id} className="border-b border-white/10">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">{filing.title}</p>
                        <p className="text-gray-400 text-sm">{filing.applicant}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <select value={filing.status} onChange={(e) => handleStatusUpdate(filing.id, e.target.value)} className={`px-2 py-1 text-xs rounded-full text-white border-0 ${getStatusColor(filing.status)}`}>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${getPriorityColor(filing.priority)}`}>
                        {filing.priority}
                      </span>
                    </td>
                    <td className="py-4 text-white">{filing.examiner}</td>
                    <td className="py-4 text-gray-400">{filing.submittedDate}</td>
                    <td className="py-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setSelectedFiling(filing)} className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                        <button className="text-green-400 hover:text-green-300 text-sm">Feedback</button>
                        <button className="text-yellow-400 hover:text-yellow-300 text-sm">Update</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Filing Trends</h3>
            <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📈</div>
                <p>Filing Trends Chart</p>
                <p className="text-sm">+23% this month</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Processing Times</h3>
            <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">⏱️</div>
                <p>Processing Time Chart</p>
                <p className="text-sm">Avg: 12 days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Feedback Management</h3>
          <div className="space-y-4">
            {filings.map((filing) => (
              <div key={filing.id} className="bg-black/20 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-medium">{filing.title}</h4>
                    <p className="text-gray-400 text-sm">{filing.applicant}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(filing.status)}`}>
                    {filing.status}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-gray-300 text-sm">{filing.feedback}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition">Send Update</button>
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition">Request Info</button>
                  <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white text-sm transition">Schedule Call</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filing Detail Modal */}
      {selectedFiling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Filing Details</h3>
              <button onClick={() => setSelectedFiling(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Title</label>
                <p className="text-white">{selectedFiling.title}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Applicant</label>
                <p className="text-white">{selectedFiling.applicant}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className="text-white">{selectedFiling.status}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Priority</label>
                  <p className="text-white">{selectedFiling.priority}</p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Current Feedback</label>
                <p className="text-white">{selectedFiling.feedback}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">New Feedback</label>
                <textarea className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400" rows="4" placeholder="Enter feedback for the applicant..."></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedFiling(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition">Cancel</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">Send Feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilingManagement;