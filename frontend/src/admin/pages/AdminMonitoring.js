import React, { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import APIHealthCharts from './monitoring/APIHealthCharts';
import ActivityTrends from './monitoring/ActivityTrends';
import PatentActivityTrends from './monitoring/PatentActivityTrends';
import LiveTraffic from './monitoring/LiveTraffic';

const AdminMonitoring = () => {
  const [activeTab, setActiveTab] = useState('api-health');

  const tabs = [
    { id: 'api-health', name: 'API Health', component: APIHealthCharts },
    { id: 'live-traffic', name: 'Live Traffic', component: LiveTraffic },
    { id: 'activity-trends', name: 'Activity Trends', component: ActivityTrends },
    { id: 'patent-trends', name: 'Patent Trends', component: PatentActivityTrends }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[calc(100vh-200px)]">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;