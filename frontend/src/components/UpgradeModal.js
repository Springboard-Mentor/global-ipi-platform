import React from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionPlans } from '../data/subscriptionPlans';

const UpgradeModal = ({ isOpen, onClose, feature, requiredPlan = 'pro' }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const plan = subscriptionPlans[requiredPlan];

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{plan.name} Feature</h2>
          <p className="text-white/70">
            {feature} is available in {plan.name} plan and above
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-white mb-2">Upgrade to {plan.name} to get:</h3>
          <ul className="space-y-1 text-sm text-white/80">
            <li>• {plan.features.ipSearch.limit === -1 ? 'Unlimited' : plan.features.ipSearch.limit} IP Searches</li>
            <li>• {plan.features.filingTracker.limit === -1 ? 'Unlimited' : plan.features.filingTracker.limit} Filing Tracking</li>
            {plan.features.alerts && <li>• Email Alerts</li>}
            {plan.features.analytics && <li>• Advanced Analytics</li>}
            {plan.features.apiAccess && <li>• API Access</li>}
            <li>• {plan.features.support} Support</li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-purple-400">
            ${plan.price}
            <span className="text-lg text-white/70">/{plan.period}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;