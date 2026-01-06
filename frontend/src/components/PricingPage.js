import React from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionPlans, featureList } from '../data/subscriptionPlans';
import { useSubscription } from '../context/SubscriptionContext';

const PricingPage = () => {
  const navigate = useNavigate();
  const { currentPlan } = useSubscription();

  const handleSelectPlan = (planKey) => {
    if (planKey === 'free') {
      navigate('/subscription-status');
    } else {
      navigate(`/checkout/${planKey}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-white/70 text-lg">Select the perfect plan for your IP management needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(subscriptionPlans).map(([key, plan]) => (
            <div key={key} className={`bg-white/10 backdrop-blur-xl rounded-xl p-6 border ${
              currentPlan === key ? 'border-purple-400' : 'border-white/20'
            } relative`}>
              {currentPlan === key && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Current Plan</span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-white/70">/{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  {plan.features.ipSearch.limit === -1 ? 'Unlimited' : plan.features.ipSearch.limit} IP Searches
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  {plan.features.filingTracker.limit === -1 ? 'Unlimited' : plan.features.filingTracker.limit} Filing Tracking
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${plan.features.alerts ? 'text-green-400' : 'text-red-400'}`}>
                    {plan.features.alerts ? '✓' : '✗'}
                  </span>
                  Email Alerts
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${plan.features.analytics ? 'text-green-400' : 'text-red-400'}`}>
                    {plan.features.analytics ? '✓' : '✗'}
                  </span>
                  Advanced Analytics
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${plan.features.apiAccess ? 'text-green-400' : 'text-red-400'}`}>
                    {plan.features.apiAccess ? '✓' : '✗'}
                  </span>
                  API Access
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  {plan.features.support} Support
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan(key)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  currentPlan === key
                    ? 'bg-gray-600 text-white cursor-not-allowed'
                    : key === 'enterprise'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                disabled={currentPlan === key}
              >
                {currentPlan === key ? 'Current Plan' : key === 'free' ? 'Get Started' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4">Pro</th>
                  <th className="text-center p-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureList.map((feature, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="p-4 text-center">{feature.free}</td>
                    <td className="p-4 text-center">{feature.pro}</td>
                    <td className="p-4 text-center">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;