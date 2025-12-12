import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const HeaderBar = ({ onMenuClick, onProfileClick, userProfile }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">

        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
        
        <div className="flex-1 max-w-md ml-4 lg:ml-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
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
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              title={`${userProfile.firstName} ${userProfile.lastName}`}
            >
              <span className="text-white text-sm font-medium">
                {userProfile.firstName.charAt(0)}{userProfile.lastName.charAt(0)}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeaderBar;
