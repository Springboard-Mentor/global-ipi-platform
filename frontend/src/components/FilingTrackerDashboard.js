import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFilings } from '../data/mockFilings';

const FilingTrackerDashboard = () => {
  const navigate = useNavigate();
  
  const stats = {
    total: mockFilings.length,
    granted: mockFilings.filter(f => f.status === 'Granted').length,
    expired: mockFilings.filter(f => f.status === 'Expired').length,
    expiringSoon: mockFilings.filter(f => {
      if (!f.expiryDate) return false;
      const expiry = new Date(f.expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 365 && diffDays > 0;
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Filing Tracker Dashboard</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-2">Total Filings</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-2">Granted</h3>
          <p className="text-3xl font-bold text-green-400">{stats.granted}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-2">Expiring Soon</h3>
          <p className="text-3xl font-bold text-yellow-400">{stats.expiringSoon}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-2">Expired</h3>
          <p className="text-3xl font-bold text-red-400">{stats.expired}</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Filings</h2>
          <button
            onClick={() => navigate('/filing-list')}
            className="px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {mockFilings.slice(0, 3).map(filing => (
            <div key={filing.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <h3 className="font-medium">{filing.title}</h3>
                <p className="text-sm text-white/70">{filing.applicationNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                filing.status === 'Granted' ? 'bg-green-500/20 text-green-400' :
                filing.status === 'Expired' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {filing.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilingTrackerDashboard;