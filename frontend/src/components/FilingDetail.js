import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockFilings } from '../data/mockFilings';

const FilingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const filing = mockFilings.find(f => f.id === parseInt(id));
  const [alertEnabled, setAlertEnabled] = useState(filing?.alertEnabled || false);

  if (!filing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
        <div className="text-center">Filing not found</div>
      </div>
    );
  }

  const getTimelineStatus = (status, index, timeline) => {
    const currentIndex = timeline.findIndex(t => t.status === status);
    if (currentIndex === -1) return 'upcoming';
    return index <= currentIndex ? 'completed' : 'upcoming';
  };

  const allStatuses = ['Filed', 'Under Examination', 'Granted', 'Expiry'];

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
                <p className="font-medium">{filing.type}</p>
              </div>
              <div>
                <label className="text-sm text-white/70">Jurisdiction</label>
                <p className="font-medium">{filing.jurisdiction}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/70">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                filing.status === 'Granted' ? 'bg-green-500/20 text-green-400' :
                filing.status === 'Expired' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {filing.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Filing Date</label>
                <p className="font-medium">{filing.filingDate}</p>
              </div>
              <div>
                <label className="text-sm text-white/70">Expiry Date</label>
                <p className="font-medium">{filing.expiryDate || 'N/A'}</p>
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
            {allStatuses.map((status, index) => {
              const timelineItem = filing.timeline.find(t => t.status === status);
              const itemStatus = getTimelineStatus(status, index, filing.timeline);
              
              return (
                <div key={status} className="flex items-center space-x-4">
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
                        {status}
                      </span>
                      {timelineItem && (
                        <span className="text-sm text-white/70">{timelineItem.date}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilingDetail;