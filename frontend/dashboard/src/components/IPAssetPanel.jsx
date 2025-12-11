import React from 'react';
import { Globe } from 'lucide-react';

const IPAssetPanel = () => {
  return (
    <div className="bg-white/90 rounded-2xl p-6 shadow-lg h-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">IP Asset Distribution</h2>

      <div className="bg-gray-100 rounded-2xl p-8 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Globe size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 max-w-xs">Geographical map (simulated)</p>
        </div>
      </div>
    </div>
  );
};

export default IPAssetPanel;
