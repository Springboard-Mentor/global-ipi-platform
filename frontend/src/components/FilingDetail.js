import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const FilingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filing, setFiling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertEnabled, setAlertEnabled] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const resp = await fetch(`${BASE_URL}/api/filing-tracker/${id}`, { credentials: 'include', headers });
        if (!resp.ok) {
          setError('Filing not found');
          return;
        }
        const data = await resp.json();
        setFiling(data);
        setAlertEnabled(false);
      } catch (e) {
        console.error('Failed to load filing', e);
        setError('Failed to load filing');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !filing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
        <div className="text-center">{error || 'Filing not found'}</div>
      </div>
    );
  }

  const allStatuses = ['Filed', 'Under Examination', 'Granted', 'Expiry'];

  const mapStatusToIndex = (s) => {
    if (!s) return -1;
    const ss = s.toString().toUpperCase();
    if (ss.includes('EXPIRE') || ss.includes('EXPIRED')) return 3;
    if (ss.includes('GRANT')) return 2;
    if (ss.includes('EXAM')) return 1;
    if (ss.includes('FILE')) return 0;
    return -1;
  };

  const formatDate = (d) => {
    if (!d) return null;
    // backend sends yyyy-MM-dd strings, return as-is or format
    return d;
  };

  // resolve current timeline index using explicit status first, then fallback to dates
  const resolveCurrentIndex = () => {
    const explicit = mapStatusToIndex(filing.currentStatus || filing.status);
    if (explicit >= 0) return explicit;
    // infer from dates
    try {
      const now = new Date();
      const expiry = filing.expiryDate ? new Date(filing.expiryDate) : null;
      const grant = filing.grantDate ? new Date(filing.grantDate) : null;
      const filingD = filing.filingDate ? new Date(filing.filingDate) : null;
      if (expiry && expiry < now) return 3;
      if (grant) return 2;
      if (filingD) return 0;
    } catch (e) {
      // parsing failed, fallthrough
    }
    return -1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Filing Details</h1>
        <button
          onClick={() => navigate('/filing-list')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Filing Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-white/70">Title</label>
              <p className="font-medium">{filing.title}</p>
            </div>
            <div>
              <label className="text-sm text-white/70">Application Number</label>
              <p className="font-medium">{filing.applicationNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Type</label>
                <p className="font-medium">{filing.ipType || filing.type}</p>
              </div>
              <div>
                <label className="text-sm text-white/70">Jurisdiction</label>
                <p className="font-medium">{filing.jurisdiction}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/70">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${(filing.currentStatus || '').toUpperCase() === 'GRANTED' ? 'bg-green-500/20 text-green-400' :
                  (filing.currentStatus || '').toUpperCase() === 'EXPIRED' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                }`}>
                {filing.currentStatus || filing.status || 'Unknown'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Filing Date</label>
                <p className="font-medium">{filing.filingDate || filing.filing_date || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-white/70">Expiry Date</label>
                <p className="font-medium">{filing.expiryDate || filing.expiry_date || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Alert Notifications</h3>
                <p className="text-sm text-white/70">Get notified about renewals and expiry</p>
              </div>
              <button
                onClick={() => setAlertEnabled(!alertEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alertEnabled ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alertEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-0 h-full w-px bg-white/20" />

              <div className="space-y-8">
                {[
                  { label: 'Priority Date', date: formatDate(filing.priorityDate), desc: 'Initial priority filing', active: !!filing.priorityDate },
                  { label: 'Application Filed', date: formatDate(filing.filingDate), desc: 'Patent application officially filed', active: !!filing.filingDate },
                  { label: 'Published', date: formatDate(filing.publicationDate), desc: 'Patent published for public access', active: !!filing.publicationDate },
                  { label: 'Patent Granted', date: formatDate(filing.grantDate), desc: 'Patent legally granted', active: !!filing.grantDate }
                ].map((item, index) => (
                  <div key={index} className="relative flex gap-6">
                    <div className="relative z-10 flex items-center justify-center w-6">
                      <div className={`rounded-full border-2 border-white/30 ${item.active
                          ? "w-6 h-6 bg-green-400 shadow-[0_0_14px_rgba(34,197,94,0.9)]"
                          : "w-4 h-4 bg-blue-400"
                        }`} />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium">{item.label}</h4>
                      <p className="text-gray-400 text-xs">{item.date || '—'}</p>
                      <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilingDetail;