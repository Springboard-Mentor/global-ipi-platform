import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFilings } from '../data/mockFilings';

const FilingList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    jurisdiction: ''
  });

  const filteredFilings = mockFilings.filter(filing => {
    return (!filters.status || filing.status === filters.status) &&
           (!filters.type || filing.type === filters.type) &&
           (!filters.jurisdiction || filing.jurisdiction === filters.jurisdiction);
  });

  const getStatusColor = (status) => {
    const colors = {
      'Filed': 'bg-blue-500/20 text-blue-400',
      'Under Examination': 'bg-yellow-500/20 text-yellow-400',
      'Granted': 'bg-green-500/20 text-green-400',
      'Expired': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Filing List</h1>
        <button
          onClick={() => navigate('/filing-tracker-dashboard')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 mb-6">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Statuses</option>
            <option value="Filed">Filed</option>
            <option value="Under Examination">Under Examination</option>
            <option value="Granted">Granted</option>
            <option value="Expired">Expired</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Types</option>
            <option value="Patent">Patent</option>
            <option value="Trademark">Trademark</option>
            <option value="Design">Design</option>
          </select>
          <select
            value={filters.jurisdiction}
            onChange={(e) => setFilters({...filters, jurisdiction: e.target.value})}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All Jurisdictions</option>
            <option value="US">United States</option>
            <option value="EU">European Union</option>
            <option value="JP">Japan</option>
          </select>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
        <div className="p-4 border-b border-white/20">
          <h3 className="text-lg font-semibold">Filings ({filteredFilings.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4">Application Number</th>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Filing Date</th>
                <th className="text-left p-4">Expiry Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFilings.map(filing => (
                <tr key={filing.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 font-medium">{filing.applicationNumber}</td>
                  <td className="p-4">{filing.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs">{filing.type}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(filing.status)}`}>
                      {filing.status}
                    </span>
                  </td>
                  <td className="p-4">{filing.filingDate}</td>
                  <td className="p-4">{filing.expiryDate || '-'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/filing-detail/${filing.id}`)}
                      className="px-3 py-1 bg-purple-600/40 hover:bg-purple-600/60 rounded text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilingList;