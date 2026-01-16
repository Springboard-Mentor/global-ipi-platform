import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const FilingTrackerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total:0, granted:0, renewalDue:0, expired:0 });
  const [recent, setRecent] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingRecent, setLoadingRecent] = useState(true);

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
          setRecent(list.slice(0, 10));
        } else {
          // graceful fallback to some mocked examples when backend is not reachable
          setRecent([
            { id: 'r1', title: 'Smart Widget Controller', applicationNumber: 'IN2023/000123', currentStatus: 'Filed', filingDate: '2023-08-01', expiryDate: '2043-08-01', jurisdiction: 'IN', ipType: 'Patent' },
            { id: 'r2', title: 'Adaptive Lens System', applicationNumber: 'IN2022/010987', currentStatus: 'Under Examination', filingDate: '2022-02-12', expiryDate: '2042-02-12', jurisdiction: 'IN', ipType: 'Patent' },
            { id: 'r3', title: 'Energy Recovery Inverter', applicationNumber: 'IN2019/005555', currentStatus: 'Granted', filingDate: '2019-05-23', expiryDate: '2039-05-23', jurisdiction: 'IN', ipType: 'Patent' }
          ]);
        }
        setLoadingRecent(false);
      } catch (e) {
        console.error('Failed to load filings', e);
        setRecent([
          { id: 'r1', title: 'Smart Widget Controller', applicationNumber: 'IN2023/000123', currentStatus: 'Filed', filingDate: '2023-08-01', expiryDate: '2043-08-01', jurisdiction: 'IN', ipType: 'Patent' },
          { id: 'r2', title: 'Adaptive Lens System', applicationNumber: 'IN2022/010987', currentStatus: 'Under Examination', filingDate: '2022-02-12', expiryDate: '2042-02-12', jurisdiction: 'IN', ipType: 'Patent' },
          { id: 'r3', title: 'Energy Recovery Inverter', applicationNumber: 'IN2019/005555', currentStatus: 'Granted', filingDate: '2019-05-23', expiryDate: '2039-05-23', jurisdiction: 'IN', ipType: 'Patent' }
        ]);
        setLoadingRecent(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Filing Tracker Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/file-patent')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 rounded-lg text-white font-medium"
          >
            File New Patent
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
          >
            Back
          </button>
        </div>
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
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or application #"
              className="px-3 py-2 rounded-lg bg-white/5 placeholder-white/40 focus:outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5"
            >
              <option value="all">All Statuses</option>
              <option value="Filed">Filed</option>
              <option value="Under Examination">Under Examination</option>
              <option value="Granted">Granted</option>
              <option value="Expired">Expired</option>
            </select>
            <button
              onClick={() => navigate('/filing-list')}
              className="px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg"
            >
              View All
            </button>
          </div>
        </div>

        {loadingRecent ? (
          <div className="text-center py-10">Loading recent filings...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.filter(item => {
              const q = query.trim().toLowerCase();
              if (q) {
                if (!(`${item.title || ''}`.toLowerCase().includes(q) || `${item.applicationNumber || ''}`.toLowerCase().includes(q))) return false;
              }
              if (statusFilter !== 'all' && (item.currentStatus || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
              return true;
            }).map(filing => (
              <div key={filing.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{filing.title}</h3>
                      <p className="text-sm text-white/60 mt-1">{filing.applicationNumber}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        (filing.currentStatus || '').toUpperCase() === 'GRANTED' ? 'bg-green-500/20 text-green-400' :
                        (filing.currentStatus || '').toUpperCase() === 'EXPIRED' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{filing.currentStatus || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-white/70 space-y-1">
                    <div><strong>Type:</strong> {filing.ipType || filing.type || 'Patent'}</div>
                    <div><strong>Jurisdiction:</strong> {filing.jurisdiction || 'IN'}</div>
                    <div><strong>Filed:</strong> {filing.filingDate || 'N/A'}</div>
                    <div><strong>Expiry:</strong> {filing.expiryDate || 'N/A'}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/filing/${filing.id}`)} className="px-3 py-1 bg-white/5 rounded-md">View</button>
                    <button onClick={() => navigate(`/filing/${filing.id}`)} className="px-3 py-1 bg-white/5 rounded-md">Edit</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { navigator.clipboard && navigator.clipboard.writeText(filing.applicationNumber); }}
                      className="px-2 py-1 bg-white/5 rounded-md text-sm"
                    >Copy#</button>
                    <button className="px-2 py-1 bg-white/5 rounded-md text-sm">Alerts</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilingTrackerDashboard;