import React from 'react';
import { Search } from 'lucide-react';

const QuickSearchKeywords = ({ onSearch, setSearchMode }) => {
  // Only 6 most popular keywords
  const keywords = [
    { text: 'Artificial Intelligence', icon: '🤖' },
    { text: 'Biotechnology', icon: '🧬' },
    { text: 'Renewable Energy', icon: '⚡' },
    { text: 'Pharmaceuticals', icon: '💊' },
    { text: 'Nanotechnology', icon: '🔬' },
    { text: 'Machine Learning', icon: '🧠' }
  ];

  const handleKeywordClick = (keyword) => {
    // Set to local database mode
    setSearchMode('local');
    localStorage.setItem('searchMode', 'local');
    
    // Trigger search with the keyword
    onSearch(keyword);
  };

  return (
    <div className="w-full flex items-center gap-3 mb-3">
      {/* Icon and Label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg">
          <Search className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-700">Quick Search:</span>
      </div>
      
      {/* Keywords in single row */}
      <div className="flex items-center gap-2 flex-wrap">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(keyword.text)}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <span className="text-base">{keyword.icon}</span>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 whitespace-nowrap">
              {keyword.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSearchKeywords;
