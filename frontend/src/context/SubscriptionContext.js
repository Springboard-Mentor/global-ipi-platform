import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({
    ipSearch: 3,
    filingTracker: 2
  });

  const fetchCurrentSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:8081/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.subscription) {
        setCurrentPlan(response.data.subscription.toLowerCase());
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const upgradePlan = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      // Normalize plan names to match backend seeding (Free, Pro, Premium, Enterprise)
      // Frontend uses: basic, pro, enterprise
      const normalizedPlan = plan.charAt(0).toUpperCase() + plan.slice(1);

      await axios.put(`http://localhost:8081/api/users/upgrade-subscription?planName=${normalizedPlan}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCurrentPlan(normalizedPlan.toLowerCase());
      return true;
    } catch (error) {
      console.error('Upgrade failed:', error);
      return false;
    }
  };

  const checkFeatureAccess = (feature) => {
    const plan = currentPlan.toLowerCase();
    const plans = {
      free: { search: true, filingTracker: true, alerts: false, analytics: false, apiAccess: false },
      pro: { search: true, filingTracker: true, alerts: true, analytics: true, apiAccess: false },
      enterprise: { search: true, filingTracker: true, alerts: true, analytics: true, apiAccess: true }
    };
    return (plans[plan] || plans.free)[feature] || false;
  };

  const checkUsageLimit = (feature) => {
    const plan = currentPlan.toLowerCase();
    const limits = {
      free: { ipSearch: 10, filingTracker: 5 },
      pro: { ipSearch: 100, filingTracker: 50 },
      enterprise: { ipSearch: -1, filingTracker: -1 }
    };
    const limit = (limits[plan] || limits.free)[feature];
    return limit === -1 || usage[feature] < limit;
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      usage,
      loading,
      upgradePlan,
      checkFeatureAccess,
      checkUsageLimit,
      refreshSubscription: fetchCurrentSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};