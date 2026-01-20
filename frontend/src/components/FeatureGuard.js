import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import UpgradeModal from './UpgradeModal';

const FeatureGuard = ({ feature, requiredPlan = 'pro', children, fallback }) => {
  const { checkFeatureAccess } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const hasAccess = checkFeatureAccess(feature);

  if (hasAccess) {
    return children;
  }

  const handleRestrictedAccess = () => {
    setShowUpgradeModal(true);
  };

  return (
    <>
      {fallback ? (
        <div onClick={handleRestrictedAccess}>
          {fallback}
        </div>
      ) : (
        <div 
          onClick={handleRestrictedAccess}
          className="relative cursor-pointer"
        >
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
              🔒 Pro
            </span>
          </div>
        </div>
      )}
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
        requiredPlan={requiredPlan}
      />
    </>
  );
};

export default FeatureGuard;