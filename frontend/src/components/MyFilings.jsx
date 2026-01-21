import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadFilings, computeStatus } from '../utils/filings';

const STATUS_COLOR = {
  'FILED': 'bg-blue-500/20 text-blue-300',
  'GRANTED': 'bg-green-500/20 text-green-300',
  'EXPIRING SOON': 'bg-yellow-500/20 text-yellow-300',
  'EXPIRED': 'bg-red-500/20 text-red-300'
};

const EmptyState = () => (
  <div className="text-center py-20">
    <svg width="160" height="120" viewBox="0 0 160 120" className="mx-auto mb-4 opacity-80">
      <rect x="8" y="20" width="144" height="88" rx="8" fill="#29243b" stroke="#3b3060" />
      <path d="M22 40h116v6H22zM22 58h116v6H22zM22 76h70v6H22z" fill="#3b2f57" />
    </svg>
    <h3 className="text-xl font-semibold">No filings yet</h3>
    <p className="text-sm text-white/70 mt-2">Start a new filing to see it appear here. Drafts are auto-saved.</p>
  </div>
);

const MyFilings = () => {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilings = async () => {
      try {
        setLoading(true);
        const data = await loadFilings();
        setFilings(data);
      } catch (error) {
        console.error('Failed to load filings:', error);
        setFilings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFilings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Filings</h1>
            <p className="text-sm text-white/70">All filings you created from the filing form.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-white/5 rounded-lg">Back to Dashboard</button>
            <button onClick={() => navigate('/file-patent')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">New Filing</button>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-white/70">Loading filings...</div>
            </div>
          ) : filings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filings.map(f => {
                const status = computeStatus(f);
                return (
                  <div key={f.id} className="bg-white/6 p-4 rounded-lg flex flex-col justify-between border border-white/20 hover:border-white/40 transition-colors">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{f.title}</h3>
                          <p className="text-sm text-white/60 mt-1">{f.applicationNumber} • {f.jurisdiction}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm ${STATUS_COLOR[status] || 'bg-white/10'}`} title={status}>{status}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-white/70 grid grid-cols-2 gap-2">
                        <div><strong>Filing Date:</strong> <div className="text-white/80">{f.filingDate}</div></div>
                        <div><strong>Expiry Date:</strong> <div className="text-white/80">{f.expiryDate}</div></div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-white/60">Tracked: {f.trackedAt ? new Date(f.trackedAt).toLocaleString() : 'N/A'}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/my-filings/${f.id}`)} className="px-3 py-1 bg-white/5 rounded">View</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFilings;
