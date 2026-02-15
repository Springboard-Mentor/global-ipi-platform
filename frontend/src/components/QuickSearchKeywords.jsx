import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const QuickSearchKeywords = ({ onSearch, setSearchMode }) => {
  // Maximum 10 keywords
  const keywords = [
    { text: 'Artificial Intelligence', icon: '🤖' },
    { text: 'Biotechnology', icon: '🧬' },
    { text: 'Renewable Energy', icon: '⚡' },
    { text: 'Pharmaceuticals', icon: '💊' },
    { text: 'Nanotechnology', icon: '🔬' },
    { text: 'Machine Learning', icon: '🧠' },
    { text: 'Quantum Computing', icon: '⚛️' },
    { text: 'Medical Devices', icon: '🏥' },
    { text: 'Robotics', icon: '🦾' },
    { text: 'Blockchain', icon: '⛓️' }
  ];

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [showComponent, setShowComponent] = useState(true);

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !wrapperRef.current) return;

      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      const keywordButtons = container.querySelectorAll('.keyword-button');
      
      if (keywordButtons.length === 0) {
        setShowComponent(false);
        return;
      }

      const containerHeight = container.scrollHeight;
      const wrapperHeight = wrapper.clientHeight;
      const hasOverflow = containerHeight > wrapperHeight + 10;

      const containerWidth = wrapper.clientWidth;
      let visibleCount = 0;
      let totalWidth = 0;
      const gap = 8;

      keywordButtons.forEach((button) => {
        const buttonWidth = button.offsetWidth;
        if (totalWidth + buttonWidth <= containerWidth) {
          visibleCount++;
          totalWidth += buttonWidth + gap;
        }
      });

      if (visibleCount < 3) {
        setShowComponent(false);
      } else {
        setShowComponent(true);
      }
    };

    const timer1 = setTimeout(checkOverflow, 50);
    const timer2 = setTimeout(checkOverflow, 200);
    const timer3 = setTimeout(checkOverflow, 500);

    window.addEventListener('resize', checkOverflow);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  const handleKeywordClick = (keyword) => {
    setSearchMode('local');
    localStorage.setItem('searchMode', 'local');
    onSearch(keyword);
  };

  if (!showComponent) {
    return null;
  }

  return (
    <div ref={wrapperRef} className="w-full flex items-center gap-3 mb-3 overflow-hidden">
      {/* Icon and Label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-lg">
          <Search className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
          Quick Search:
        </span>
      </div>

      {/* Keywords */}
      <div ref={containerRef} className="flex items-center gap-2 overflow-hidden flex-nowrap">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(keyword.text)}
            className="keyword-button group flex items-center gap-2 px-2 py-1 rounded-md flex-shrink-0 hover:scale-105 transition-transform duration-200"
          >
            <span className="text-xl">{keyword.icon}</span>
            <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 whitespace-nowrap">
              {keyword.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSearchKeywords;
