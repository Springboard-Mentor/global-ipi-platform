import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Crown, Zap, Calendar, Clock } from 'lucide-react';

const HeaderBar = ({ onMenuClick, onProfileClick, userProfile, onSearch, currentPage, sidebarOpen }) => {
  const [query, setQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    if (currentPage === 'dashboard') {
      setQuery('');
    }
  }, [currentPage]);

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  // Format date and time
  const formatDateTime = () => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    const date = currentDateTime.toLocaleDateString('en-US', options);
    const time = currentDateTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
    return { date, time };
  };

  const { date, time } = formatDateTime();

  // Calculate subscription details
  const getSubscriptionDetails = () => {
    if (!userProfile?.subscriptionType || userProfile?.subscriptionType === 'basic') {
      return null;
    }

    try {
      let endDate;
      if (userProfile.subscriptionEndDate instanceof Date) {
        endDate = userProfile.subscriptionEndDate;
      } else if (userProfile.subscriptionEndDate?.toDate) {
        endDate = userProfile.subscriptionEndDate.toDate();
      } else if (typeof userProfile.subscriptionEndDate === 'string') {
        endDate = new Date(userProfile.subscriptionEndDate);
      } else {
        return null;
      }

      let startDate;
      if (userProfile.subscriptionStartDate instanceof Date) {
        startDate = userProfile.subscriptionStartDate;
      } else if (userProfile.subscriptionStartDate?.toDate) {
        startDate = userProfile.subscriptionStartDate.toDate();
      } else if (typeof userProfile.subscriptionStartDate === 'string') {
        startDate = new Date(userProfile.subscriptionStartDate);
      } else {
        startDate = new Date();
      }

      const now = new Date();
      const diffTime = endDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const daysLeft = diffDays > 0 ? diffDays : 0;

      return {
        type: userProfile.subscriptionType,
        daysLeft,
        startDate: startDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        endDate: endDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        price: userProfile.subscriptionPrice || 0,
        paymentId: userProfile.lastPayment?.razorpayPaymentId || 'N/A',
        orderId: userProfile.lastPayment?.razorpayOrderId || 'N/A',
        amount: userProfile.lastPayment?.amount || userProfile.subscriptionPrice || 0,
        currency: userProfile.lastPayment?.currency || 'INR'
      };
    } catch (error) {
      console.error('Error calculating subscription details:', error);
      return null;
    }
  };

  const subscriptionDetails = getSubscriptionDetails();
  
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-3 sm:px-6 py-3 sm:py-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">

        <button 
          onClick={onMenuClick}
          className={`p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl ${sidebarOpen ? 'invisible' : ''}`}
        >
          <Menu size={24} className="text-gray-700" />
        </button>

        {/* Date and Time Display - Responsive */}
        <div className="hidden lg:flex flex-col items-start ml-4 mr-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar size={16} className="text-blue-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} className="text-purple-500" />
            <span>{time}</span>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patents..."
              className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-2 sm:py-2.5 text-sm bg-white border border-gray-200 rounded-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
          {/* Date/Time Mobile View */}
          <div className="lg:hidden flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
              <Calendar size={12} />
              <span className="hidden sm:inline">{date.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{time}</span>
            </div>
          </div>

          {/* Subscription Badge with Hover Details */}
          {subscriptionDetails ? (
            <div className="relative group">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md cursor-pointer">
                <Crown size={14} className="animate-pulse" />
                <span className="text-xs font-bold uppercase hidden sm:inline">
                  {subscriptionDetails.type}
                </span>
                <span className="text-xs font-bold">
                  • {subscriptionDetails.daysLeft}d
                </span>
              </div>

              {/* Hover Tooltip - Subscription Details */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="flex items-center justify-between mb-3 pb-3 border-b">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Crown size={18} className="text-purple-600" />
                    {subscriptionDetails.type.toUpperCase()} Plan
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span className="font-semibold text-gray-800">{subscriptionDetails.daysLeft} days</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-800 text-xs">{subscriptionDetails.startDate}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium text-gray-800 text-xs">{subscriptionDetails.endDate}</span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-green-600">
                        ₹{subscriptionDetails.amount} {subscriptionDetails.currency}
                      </span>
                    </div>
                  </div>

                  {subscriptionDetails.paymentId !== 'N/A' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs text-gray-700">{subscriptionDetails.paymentId}</span>
                      </div>
                      
                      {subscriptionDetails.orderId !== 'N/A' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-mono text-xs text-gray-700">{subscriptionDetails.orderId}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 text-white shadow-md">
              <Zap size={14} />
              <span className="text-xs font-bold uppercase hidden sm:inline">BASIC</span>
            </div>
          )}

          <button className="p-2 sm:p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl relative">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-gray-700">
                {userProfile.firstName} {userProfile.lastName}
              </div>
              <div className="text-xs text-gray-500">{userProfile.email}</div>
            </div>
            
            <button 
              onClick={onProfileClick}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden"
              title={`${userProfile.firstName} ${userProfile.lastName}`}
            >
              {userProfile.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs sm:text-sm font-medium">
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
