import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [usage, setUsage] = useState({
    ipSearch: 3,
    filingTracker: 2
  });

  const upgradePlan = (plan) => {
    setCurrentPlan(plan);
  };

  const checkFeatureAccess = (feature) => {
    const plans = {
      free: { search: true, filingTracker: false, alerts: false, analytics: false, apiAccess: false },
      pro: { search: true, filingTracker: true, alerts: true, analytics: true, apiAccess: false },
      enterprise: { search: true, filingTracker: true, alerts: true, analytics: true, apiAccess: true }
    };
    return plans[currentPlan][feature] || false;
  };

  const checkUsageLimit = (feature) => {
    const limits = {
      free: { ipSearch: 10, filingTracker: 5 },
      pro: { ipSearch: 100, filingTracker: 50 },
      enterprise: { ipSearch: -1, filingTracker: -1 }
    };
    const limit = limits[currentPlan][feature];
    return limit === -1 || usage[feature] < limit;
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      usage,
      upgradePlan,
      checkFeatureAccess,
      checkUsageLimit
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};