import React, { useState } from 'react';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('plans');

  const subscriptionPlans = [
    { id: 1, name: 'Free', price: '$0', users: 1245, features: { search: true, analytics: false, alerts: false, api: false, support: false } },
    { id: 2, name: 'Basic', price: '$29', users: 456, features: { search: true, analytics: true, alerts: false, api: false, support: true } },
    { id: 3, name: 'Premium', price: '$99', users: 892, features: { search: true, analytics: true, alerts: true, api: true, support: true } },
    { id: 4, name: 'Enterprise', price: '$299', users: 254, features: { search: true, analytics: true, alerts: true, api: true, support: true } }
  ];

  const featureModules = [
    { name: 'Patent Search', key: 'search', description: 'Advanced patent search capabilities' },
    { name: 'Analytics Dashboard', key: 'analytics', description: 'Detailed analytics and reporting' },
    { name: 'Real-time Alerts', key: 'alerts', description: 'Patent filing and status alerts' },
    { name: 'API Access', key: 'api', description: 'Full API access for integrations' },
    { name: 'Priority Support', key: 'support', description: '24/7 priority customer support' }
  ];

  const recentSubscriptions = [
    { user: 'John Doe', plan: 'Premium', action: 'Upgraded', date: '2024-01-15', amount: '$99' },
    { user: 'Jane Smith', plan: 'Basic', action: 'New', date: '2024-01-14', amount: '$29' },
    { user: 'Bob Johnson', plan: 'Free', action: 'Downgraded', date: '2024-01-13', amount: '$0' },
  ];

  const handleFeatureToggle = (planId, featureKey) => {
    console.log(`Toggle ${featureKey} for plan ${planId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">
          + Create Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/20">
        {['plans', 'features', 'analytics'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 capitalize transition ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Monthly Revenue</p>
          <p className="text-2xl font-bold text-white">$127,450</p>
          <p className="text-green-400 text-sm">+15% from last month</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Subscriptions</p>
          <p className="text-2xl font-bold text-white">2,847</p>
          <p className="text-green-400 text-sm">+8% growth</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Churn Rate</p>
          <p className="text-2xl font-bold text-white">2.3%</p>
          <p className="text-red-400 text-sm">-0.5% improvement</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Avg Revenue Per User</p>
          <p className="text-2xl font-bold text-white">$44.78</p>
          <p className="text-green-400 text-sm">+12% increase</p>
        </div>
      </div>

      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Subscription Plans */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Subscription Plans</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="bg-black/20 border border-white/10 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                    <p className="text-2xl font-bold text-blue-400">{plan.price}<span className="text-sm text-gray-400">/month</span></p>
                    <p className="text-gray-400 text-sm">{plan.users.toLocaleString()} users</p>
                  </div>
                  <div className="space-y-2">
                    {featureModules.map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{feature.name}</span>
                        <button onClick={() => handleFeatureToggle(plan.id, feature.key)} className={`w-8 h-4 rounded-full transition ${plan.features[feature.key] ? 'bg-green-500' : 'bg-gray-600'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${plan.features[feature.key] ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition">Edit</button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Subscription Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 py-3">User</th>
                    <th className="text-left text-gray-400 py-3">Plan</th>
                    <th className="text-left text-gray-400 py-3">Action</th>
                    <th className="text-left text-gray-400 py-3">Date</th>
                    <th className="text-right text-gray-400 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubscriptions.map((sub, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="text-white py-3">{sub.user}</td>
                      <td className="text-white py-3">{sub.plan}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${sub.action === 'Upgraded' ? 'bg-green-500' : sub.action === 'New' ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
                          {sub.action}
                        </span>
                      </td>
                      <td className="text-gray-400 py-3">{sub.date}</td>
                      <td className="text-right text-white py-3">{sub.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Feature Module Management</h3>
          <div className="space-y-4">
            {featureModules.map((feature) => (
              <div key={feature.key} className="bg-black/20 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{feature.name}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition">Configure</button>
                    <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white text-sm transition">Usage Stats</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Trends</h3>
            <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">💰</div>
                <p>Revenue Analytics Chart</p>
                <p className="text-sm">Monthly growth: +15%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Plan Distribution</h3>
            <div className="h-64 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📊</div>
                <p>Plan Distribution Chart</p>
                <p className="text-sm">Most popular: Premium</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;