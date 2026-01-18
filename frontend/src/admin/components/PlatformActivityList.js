import React from 'react';

const PlatformActivityList = ({ data }) => {

    const getDotColor = (color) => {
        switch (color) {
            case 'blue': return 'bg-blue-500';
            case 'green': return 'bg-green-500';
            case 'red': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                <h3 className="text-lg font-semibold text-white">Platform Activity</h3>
            </div>

            <div className="space-y-6 relative ml-2">
                {/* Vertical line connecting dots */}
                <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-[#30363d]"></div>

                {data.map((item) => (
                    <div key={item.id} className="relative pl-6 group">
                        <span className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${getDotColor(item.status)} ring-4 ring-[#0f1214] z-10`}></span>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">{item.action}</p>
                                <p className="text-xs text-blue-400 mt-0.5">{`By ${item.user}`}</p>
                            </div>
                            <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlatformActivityList;
