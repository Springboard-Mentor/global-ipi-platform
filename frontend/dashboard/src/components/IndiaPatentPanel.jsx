import React from 'react';
import { Map, Globe } from 'lucide-react';
import IndiaPatentMap from './IndiaPatentMap';

const IndiaPatentPanel = ({ selectedState, showHeatMap = false }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 w-full h-full flex flex-col">
      <style>{`
        @keyframes blinkRedGreen {
          0%, 49% { background: linear-gradient(to right, #ef4444, #dc2626); }
          50%, 100% { background: linear-gradient(to right, #22c55e, #16a34a); }
        }
        .blink-button {
          animation: blinkRedGreen 2s infinite;
        }
      `}</style>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-2 rounded-lg">
            <Map className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">India Patent Distribution</h2>
            <p className="text-xs text-gray-600">Interactive state-wise patent analytics</p>
          </div>
        </div>
        <button className="blink-button flex items-center space-x-2 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-sm">
          <Globe className="w-4 h-4" />
          <span>All Indian States Patents</span>
        </button>
      </div>
      <div className="flex-1">
        <IndiaPatentMap 
          selectedState={selectedState}
          showHeatMap={showHeatMap}
        />
      </div>
    </div>
  );
};

export default IndiaPatentPanel;
