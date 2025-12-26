import React from 'react';
import { Globe } from 'lucide-react';
import IPAssetWorldMap from './IPAssetWorldMap';

const IPAssetPanel = ({ geoData }) => {
  return (
    <div className="bg-white/90 rounded-2xl p-4 shadow-lg h-full flex flex-col">
      <h2 className="font-bold text-gray-800 mb-4">IP Asset Distribution</h2>
      <div className="flex-1 min-h-[250px]">
        <IPAssetWorldMap data={geoData} />
      </div>
    </div>
  );
};

export default IPAssetPanel;
