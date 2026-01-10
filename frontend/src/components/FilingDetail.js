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
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                (filing.currentStatus || '').toUpperCase() === 'GRANTED' ? 'bg-green-500/20 text-green-400' :
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  alertEnabled ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    alertEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
          <div className="space-y-4">
            {(() => {
              const idx = resolveCurrentIndex();
              const timelineItems = [
                { status: 'Filed', date: formatDate(filing.filingDate) },
                { status: 'Under Examination', date: null },
                { status: 'Granted', date: formatDate(filing.grantDate) },
                { status: 'Expiry', date: formatDate(filing.expiryDate) }
              ];

              return timelineItems.map((item, index) => {
                let itemStatus = 'upcoming';
                if (idx >= 0) {
                  if (index < idx) itemStatus = 'completed';
                  else if (index === idx) itemStatus = 'current';
                } else {
                  // no resolved index: mark Filed as completed if filingDate exists
                  if (index === 0 && item.date) itemStatus = 'completed';
                }

                return (
                  <div key={item.status} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      itemStatus === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : itemStatus === 'current'
                        ? 'bg-yellow-500 border-yellow-500'
                        : 'border-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          itemStatus === 'completed' ? 'text-white' : 'text-white/60'
                        }`}>
                          {item.status}
                        </span>
                        {item.date && (
                          <span className="text-sm text-white/70">{item.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilingDetail;