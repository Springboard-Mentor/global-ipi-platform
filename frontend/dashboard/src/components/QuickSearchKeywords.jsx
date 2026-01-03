import React from 'react';
import { Search, Zap } from 'lucide-react';

const QuickSearchKeywords = ({ onSearch, setSearchMode }) => {
  const keywords = [
    { text: 'Artificial Intelligence', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { text: 'Biotechnology', icon: '🧬', color: 'from-green-500 to-teal-500' },
    { text: 'Renewable Energy', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { text: 'Pharmaceuticals', icon: '💊', color: 'from-blue-500 to-indigo-500' },
    { text: 'Nanotechnology', icon: '🔬', color: 'from-cyan-500 to-blue-500' },
    { text: 'Machine Learning', icon: '🧠', color: 'from-indigo-500 to-purple-500' },
    { text: 'Quantum Computing', icon: '⚛️', color: 'from-blue-500 to-cyan-500' },
    { text: 'Medical Devices', icon: '🏥', color: 'from-red-500 to-pink-500' },
    { text: 'Telecommunications', icon: '📡', color: 'from-gray-600 to-gray-800' },
    { text: 'Robotics', icon: '🦾', color: 'from-orange-500 to-red-500' }
  ];

  const handleKeywordClick = (keyword) => {
    // Set to local database mode
    setSearchMode('local');
    localStorage.setItem('searchMode', 'local');
    
    // Trigger search with the keyword
    onSearch(keyword);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl border-2 border-white/20 w-full relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      {/* Header */}
      <div className="relative flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="bg-white/20 backdrop-blur-lg p-3 rounded-xl shadow-xl border border-white/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5 shadow-lg animate-bounce">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            Quick Search Keywords
          </h2>
          <p className="text-sm text-white/80 font-medium">Click any keyword to search instantly in local database</p>
        </div>
      </div>

      {/* Keywords Row */}
      <div className="relative flex flex-wrap gap-3 justify-center lg:justify-start">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(keyword.text)}
            className="group relative overflow-hidden px-5 py-3 bg-white rounded-xl border-2 border-white/40 hover:border-white hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 hover:-translate-y-1"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${keyword.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative flex items-center gap-2.5">
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300 drop-shadow-md">
                {keyword.icon}
              </span>
              <span className="font-bold text-gray-800 group-hover:text-gray-900 text-sm whitespace-nowrap">
                {keyword.text}
              </span>
              <Search className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
          </button>
        ))}
      </div>

      {/* Info badge */}
      <div className="relative mt-5 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-5 py-2.5 rounded-full border border-white/30 shadow-lg">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          <span className="font-bold text-white text-sm">Local Database Mode</span>
        </div>
      </div>
    </div>
  );
};

export default QuickSearchKeywords;
