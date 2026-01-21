import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionPlans } from '../data/subscriptionPlans';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentPlan, usage } = useSubscription();
  const [showSuccess, setShowSuccess] = useState(false);

  // Ensure we lookup with lowercase key, defaulting to 'free' if undefined
  const planKey = (currentPlan || 'free').toLowerCase();
  const plan = subscriptionPlans[planKey] || subscriptionPlans.free;

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const getUsagePercentage = (feature) => {
    const limit = plan.features[feature]?.limit;
    if (limit === -1) return 0; // Unlimited
    return Math.min((usage[feature] / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#2A1A4A] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Loading subscription details...</p>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-white/10 rounded-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-200">✅ Subscription upgraded successfully!</p>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Status</h1>
          <p className="text-white/70">Manage your subscription and view usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Plan */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-purple-400">{plan.name}</h3>
              <p className="text-3xl font-bold mt-2">
                ${plan.price}
                <span className="text-lg text-white/70">/{plan.period}</span>
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>IP Searches</span>
                <span>{plan.features.ipSearch?.limit === -1 ? 'Unlimited' : `${plan.features.ipSearch?.limit}/month`}</span>
              </div>
              <div className="flex justify-between">
                <span>Filing Tracking</span>
                <span>{plan.features.filingTracker?.limit === -1 ? 'Unlimited' : `${plan.features.filingTracker?.limit} filings`}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Alerts</span>
                <span className={plan.features.alerts ? 'text-green-400' : 'text-red-400'}>
                  {plan.features.alerts ? 'Included' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Analytics</span>
                <span className={plan.features.analytics ? 'text-green-400' : 'text-red-400'}>
                  {plan.features.analytics ? 'Included' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>API Access</span>
                <span className={plan.features.apiAccess ? 'text-green-400' : 'text-red-400'}>
                  {plan.features.apiAccess ? 'Included' : 'Not Available'}
                </span>
              </div>
            </div>

            {currentPlan?.toLowerCase() !== 'enterprise' && (
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
              >
                Upgrade Plan
              </button>
            )}
          </div>

          {/* Usage Statistics */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>IP Searches</span>
                  <span>
                    {usage.ipSearch} / {plan.features.ipSearch?.limit === -1 ? '∞' : plan.features.ipSearch?.limit}
                  </span>
                </div>
                {plan.features.ipSearch?.limit !== -1 && (
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage('ipSearch'))}`}
                      style={{ width: `${getUsagePercentage('ipSearch')}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Filing Tracking</span>
                  <span>
                    {usage.filingTracker} / {plan.features.filingTracker?.limit === -1 ? '∞' : plan.features.filingTracker?.limit}
                  </span>
                </div>
                {plan.features.filingTracker?.limit !== -1 && (
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(getUsagePercentage('filingTracker'))}`}
                      style={{ width: `${getUsagePercentage('filingTracker')}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold mb-2">Need More?</h3>
              <p className="text-sm text-white/70 mb-3">
                Upgrade your plan to get higher limits and premium features.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm"
              >
                View Plans
              </button>
            </div>
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

export default SubscriptionStatus;