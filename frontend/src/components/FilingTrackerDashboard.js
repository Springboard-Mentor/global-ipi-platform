import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const FilingTrackerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total:0, granted:0, renewalDue:0, expired:0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const resp = await fetch(`${BASE_URL}/api/filing-tracker/dashboard`, { credentials: 'include', headers });
        if (resp.ok) {
          const data = await resp.json();
          setStats({ total: data.total, granted: data.granted, renewalDue: data.renewalDue, expired: data.expired });
        }
        const r = await fetch(`${BASE_URL}/api/filing-tracker/my-filings`, { credentials: 'include', headers });
        if (r.ok) {
          const list = await r.json();
          setRecent(list.slice(0,3));
        }
      } catch (e) {
        console.error('Failed to load filings', e);
      }
    };
    load();
  }, []);

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
          <p className="text-3xl font-bold text-yellow-400">{stats.renewalDue}</p>
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
          {recent.map(filing => (
            <div key={filing.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <h3 className="font-medium">{filing.title}</h3>
                <p className="text-sm text-white/70">{filing.applicationNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                filing.currentStatus === 'GRANTED' ? 'bg-green-500/20 text-green-400' :
                filing.currentStatus === 'EXPIRED' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {filing.currentStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilingTrackerDashboard;