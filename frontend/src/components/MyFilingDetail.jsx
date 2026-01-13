import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadFilings, computeStatus } from '../utils/filings';

const steps = ['Filed', 'Under Examination', 'Granted', 'Expiry'];

const FilingTimeline = ({ filing }) => {
  const now = new Date();
  const filed = filing.filingDate ? new Date(filing.filingDate) : null;
  const grant = filing.grantDate ? new Date(filing.grantDate) : null;
  const expiry = filing.expiryDate ? new Date(filing.expiryDate) : null;

  let currentIndex = 0;
  if (grant) currentIndex = 2;
  else if (expiry && now > expiry) currentIndex = 3;
  else if (expiry) currentIndex = 1; // assume under exam if not granted

  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const statusClass = i < currentIndex ? 'bg-green-500/20 text-green-300' : i === currentIndex ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/5 text-white/60';
        const dateLabel = i === 0 ? (filing.filingDate || '—') : i === 2 ? (filing.grantDate || '—') : i === 3 ? (filing.expiryDate || '—') : '—';
        return (
          <div key={s} className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${i < currentIndex ? 'bg-green-400' : i === currentIndex ? 'bg-yellow-400' : 'bg-white/10'}`} />
            <div>
              <div className={`font-medium ${i <= currentIndex ? 'text-white' : 'text-white/60'}`}>{s}</div>
              <div className="text-xs text-white/60">{dateLabel}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MyFilingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filing, setFiling] = useState(null);

  useEffect(() => {
    const all = loadFilings();
    const f = all.find(x => x.id === id);
    setFiling(f || null);
  }, [id]);

  if (!filing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 p-6 rounded-xl">Filing not found</div>
        </div>
      </div>
    );
  }

  const status = computeStatus(filing);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{filing.title}</h1>
            <p className="text-sm text-white/70">{filing.applicationNumber} • {filing.jurisdiction}</p>
          </div>
          <div>
            <div className={`px-3 py-1 rounded-full text-sm ${status==='GRANTED'? 'bg-green-500/20 text-green-300' : status==='EXPIRED' ? 'bg-red-500/20 text-red-300' : status==='EXPIRING SOON' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>{status}</div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Filing Information</h3>
            <div className="text-sm text-white/70 space-y-2">
              <div><strong>Filing Date:</strong> <span className="text-white/80">{filing.filingDate}</span></div>
              <div><strong>Grant Date:</strong> <span className="text-white/80">{filing.grantDate || '—'}</span></div>
              <div><strong>Expiry Date:</strong> <span className="text-white/80">{filing.expiryDate}</span></div>
              <div><strong>Tracked At:</strong> <span className="text-white/80">{new Date(filing.trackedAt).toLocaleString()}</span></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Timeline</h3>
            <FilingTimeline filing={filing} />
          </div>
        </div>

        <div className="mt-6">
          <button onClick={() => navigate('/my-filings')} className="px-4 py-2 bg-white/5 rounded">Back to My Filings</button>
        </div>
      </div>
    </div>
  );
};

export default MyFilingDetail;
