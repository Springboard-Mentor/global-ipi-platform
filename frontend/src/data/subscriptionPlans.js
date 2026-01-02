export const subscriptionPlans = {
  free: {
    name: 'Free',
    price: 0,
    period: 'month',
    features: {
      ipSearch: { limit: 10, name: 'IP Searches' },
      filingTracker: { limit: 5, name: 'Filing Tracking' },
      alerts: false,
      analytics: false,
      apiAccess: false,
      support: 'Community'
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    period: 'month',
    features: {
      ipSearch: { limit: 100, name: 'IP Searches' },
      filingTracker: { limit: 50, name: 'Filing Tracking' },
      alerts: true,
      analytics: true,
      apiAccess: false,
      support: 'Email'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    features: {
      ipSearch: { limit: -1, name: 'Unlimited IP Searches' },
      filingTracker: { limit: -1, name: 'Unlimited Filing Tracking' },
      alerts: true,
      analytics: true,
      apiAccess: true,
      support: 'Priority'
    }
  }
};

export const featureList = [
  { key: 'ipSearch', name: 'IP Searches', free: '10/month', pro: '100/month', enterprise: 'Unlimited' },
  { key: 'filingTracker', name: 'Filing Tracking', free: '5 filings', pro: '50 filings', enterprise: 'Unlimited' },
  { key: 'alerts', name: 'Email Alerts', free: '✗', pro: '✓', enterprise: '✓' },
  { key: 'analytics', name: 'Advanced Analytics', free: '✗', pro: '✓', enterprise: '✓' },
  { key: 'apiAccess', name: 'API Access', free: '✗', pro: '✗', enterprise: '✓' },
  { key: 'support', name: 'Support', free: 'Community', pro: 'Email', enterprise: 'Priority' }
];