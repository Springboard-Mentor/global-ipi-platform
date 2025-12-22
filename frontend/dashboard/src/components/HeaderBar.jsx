import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Crown, Zap, Calendar } from 'lucide-react';

const HeaderBar = ({ onMenuClick, onProfileClick, userProfile, onSearch, currentPage, sidebarOpen }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (currentPage === 'dashboard') {
      setQuery('');
    }
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">

        <button 
          onClick={onMenuClick}
          className={`p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl ${sidebarOpen ? 'invisible' : ''}`}
        >
          <Menu size={24} className="text-gray-700" />
        </button>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-md ml-4 lg:ml-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patents..."
              className="w-full pl-12 pr-20 py-2.5 bg-white border border-gray-200 rounded-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 ml-4">
          {/* Subscription Badges */}
          {userProfile?.subscriptionType === 'pro' || userProfile?.subscriptionType === 'enterprise' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                <Crown size={16} className="animate-pulse" />
                <span className="text-xs font-bold uppercase hidden sm:inline">
                  {userProfile?.subscriptionType}
                </span>
              </div>
              
              {userProfile?.subscriptionEndDate && (() => {
                try {
                  let end;
                  if (userProfile.subscriptionEndDate instanceof Date) {
                    end = userProfile.subscriptionEndDate;
                  } else if (userProfile.subscriptionEndDate?.toDate) {
                    end = userProfile.subscriptionEndDate.toDate();
                  } else if (typeof userProfile.subscriptionEndDate === 'string') {
                    end = new Date(userProfile.subscriptionEndDate);
                  } else {
                    return null;
                  }
                  
                  const now = new Date();
                  const diffTime = end - now;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const daysLeft = diffDays > 0 ? diffDays : 0;
                  
                  return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
                      <Calendar size={16} />
                      <span className="text-xs font-bold hidden sm:inline">
                        {daysLeft} days
                      </span>
                    </div>
                  );
                } catch (error) {
                  console.error('Error calculating days remaining:', error);
                  return null;
                }
              })()}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-md">
              <Zap size={16} />
              <span className="text-xs font-bold uppercase hidden sm:inline">BASIC</span>
            </div>
          )}

          <button className="p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-700">
                {userProfile.firstName} {userProfile.lastName}
              </div>
              <div className="text-xs text-gray-500">{userProfile.email}</div>
            </div>
            
            <button 
              onClick={onProfileClick}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden"
              title={`${userProfile.firstName} ${userProfile.lastName}`}
            >
              {userProfile.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeaderBar;
