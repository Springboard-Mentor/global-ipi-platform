import React from 'react';
import { Search, TrendingUp } from 'lucide-react';
import Filters from '../components/Filters';
import OverviewGrid from '../components/OverviewGrid';

const Dashboard = ({ userProfile }) => {
  return (
    <div className="space-y-8">

      <div className="bg-white/90 rounded-2xl p-8 shadow-lg">
        <p className="text-sm text-gray-500 mb-1">Welcome back,</p>
        <h1 className="text-4xl font-bold">Good Morning, {userProfile.firstName}.</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patents..."
          className="w-full pl-14 pr-36 py-4 bg-white/90 border border-gray-200 rounded-2xl"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-500 text-white rounded-xl">
          Search
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Quick Filters</h2>
        <Filters />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Overview</h2>
        <OverviewGrid />
      </div>

      <div className="bg-white/90 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-gray-600 font-semibold">Portfolio Value</h3>
          <div className="p-2 bg-blue-50 rounded-xl">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
        </div>
        <div className="mb-2">
          <span className="text-4xl font-bold">$1.2M</span>
        </div>
        <p className="text-sm text-green-600 font-medium">Up 7.5% this quarter</p>
      </div>

    </div>
  );
};

export default Dashboard;
