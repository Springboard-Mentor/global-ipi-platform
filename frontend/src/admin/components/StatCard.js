import React from 'react';

const StatCard = ({ title, value, subtext, icon, color, status }) => {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'users': return <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>;
            case 'file-text': return <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>;
            case 'credit-card': return <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>;
            case 'activity': return <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>;
            default: return null;
        }
    };

    const getSubIcon = (iconName) => {
        switch (iconName) {
            case 'users': return <circle cx="9" cy="7" r="4"></circle>;
            case 'file-text': return <><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></>;
            case 'credit-card': return <line x1="1" y1="10" x2="23" y2="10"></line>;
            default: return null;
        }
    }

    const getColorClasses = (c) => {
        switch (c) {
            case 'blue': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'purple': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'green': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl hover:bg-[#1f2937] transition-all duration-300 group shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(color)} group-hover:scale-105 transition-transform`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {getIcon(icon)}
                        {getSubIcon(icon)}
                    </svg>
                </div>
                {status === 'online' && (
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-xs text-gray-500 mt-2">{subtext}</p>
            </div>
        </div>
    );
};

export default StatCard;
