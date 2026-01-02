import React from 'react';
import { Map } from 'lucide-react';
import IndiaPatentMap from './IndiaPatentMap';

const IndiaPatentPanel = ({ selectedState }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-2 rounded-lg">
          <Map className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">India Patent Distribution</h2>
          <p className="text-xs text-gray-600">Interactive state-wise patent analytics</p>
        </div>
      </div>
      <div className="h-[420px]">
        <IndiaPatentMap 
          selectedState={selectedState}
        />
      </div>
    </div>
  );
};

export default IndiaPatentPanel;
