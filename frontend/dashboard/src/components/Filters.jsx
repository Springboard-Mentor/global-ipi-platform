import React from 'react';
import { Eye, Briefcase, UserCircle, Globe } from 'lucide-react';

const Filters = () => {
  const filters = [
    { icon: Eye, label: 'AI Patents' },
    { icon: Briefcase, label: 'TechCorp' },
    { icon: UserCircle, label: 'Dr. Smith' },
    { icon: Globe, label: 'US Jurisdiction' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter, index) => (
        <button
          key={index}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl"
        >
          <filter.icon size={16} className="text-gray-600" />
          <span className="text-sm">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Filters;
