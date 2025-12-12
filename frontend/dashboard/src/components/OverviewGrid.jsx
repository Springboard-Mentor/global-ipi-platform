import React from 'react';
import { TrendingUp, FileCheck, AlertCircle } from 'lucide-react';
import OverviewCard from './OverviewCard';

const OverviewGrid = () => {
  const cards = [
    {
      title: 'Active Subscriptions',
      value: '12',
      subtitle: 'Monitoring 3 new sectors',
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Recent Filings',
      value: '45',
      subtitle: 'Last 24 hours: 5 new',
      icon: FileCheck,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Open Alerts',
      value: '3',
      subtitle: 'Critical actions required',
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <OverviewCard key={index} {...card} />
      ))}
    </div>
  );
};

export default OverviewGrid;
