import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import UpgradeModal from './UpgradeModal';

const ProtectedFilingTracker = ({ children }) => {
  const { checkFeatureAccess } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(true);

  if (!checkFeatureAccess('filingTracker')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔒</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Pro Feature</h1>
            <p className="text-white/70 text-lg mb-6">
              Filing Tracker is available in Pro and Enterprise plans
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
            >
              Upgrade to Access
            </button>
          </div>
        </div>
        
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="Filing Tracker"
          requiredPlan="pro"
        />
      </div>
    );
  }

  return children;
};

export default ProtectedFilingTracker;