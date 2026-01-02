import React from 'react';
import { Map } from 'lucide-react';
import IndiaPatentMap from './IndiaPatentMap';

const IndiaPatentPanel = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
          <Map className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">India Patent Distribution</h2>
          <p className="text-sm text-gray-600">Interactive state and city-wise patent analytics</p>
        </div>
      </div>
      <div className="min-h-[500px] h-[600px]">
        <IndiaPatentMap />
      </div>
    </div>
  );
};

export default IndiaPatentPanel;
