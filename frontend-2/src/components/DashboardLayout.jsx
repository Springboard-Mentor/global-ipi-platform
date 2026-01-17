import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  Shield,
  Activity,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Search,
  Menu,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Clock,
  X
} from 'lucide-react';

const DashboardLayout = ({ user, onLogout, currentPage, onNavigate, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Inspirational quotes for the header
  const quotes = [
    "Innovation distinguishes between a leader and a follower.",
    "The best way to predict the future is to create it.",
    "Protecting today's ideas for tomorrow's world.",
    "Knowledge is the only asset that grows when shared and protected."
  ];

  // Memoize quote so it doesn't change on every re-render
  const activeQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate('search', searchTerm);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'patents', label: 'My Patents', icon: FileText },
    { id: 'search', label: 'Search IP Analysis', icon: Search },
    { id: 'filing-tracker', label: 'Filing Tracker', icon: Clock },
    
    // ✅ ANALYTICS ITEMS
    { id: 'legal-dashboard', label: 'Legal Dashboard', icon: BarChart3 },
    { id: 'landscape', label: 'Landscape View', icon: TrendingUp },

    { id: 'new-filing', label: 'New Filing', icon: Shield },
    { id: 'analysis', label: 'AI Analysis', icon: Activity },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const userNameDisplay = user?.name || user?.displayName || 'Authorized User';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-left font-sans selection:bg-indigo-100">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        w-72 bg-[#0F172A] text-white fixed h-full z-[70] transition-transform duration-300 border-r border-white/5 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter uppercase leading-none">Global IP</h2>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1.5">Intelligence</p>
            </div>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-6 space-y-1.5 flex-1 custom-scrollbar overflow-y-auto h-[calc(100vh-200px)]">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group 
              ${currentPage === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {currentPage === item.id && <ChevronRight size={14} className="animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </nav>

        {/* Bottom Logout Section */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10 bg-slate-900/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen relative">

        {/* HEADER / TOP BAR */}
        <header className="h-20 px-6 md:px-10 flex justify-between items-center border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-40">
          
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>

            {/* Quote or Search Section */}
            <div className="hidden lg:block border-l-4 border-indigo-500 pl-4 py-1 max-w-sm">
              <p className="text-slate-500 italic font-medium text-xs leading-relaxed">
                "{activeQuote}"
              </p>
            </div>

            {/* Integrated Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs ml-4 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
              />
            </form>
          </div>

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-4 md:gap-8">
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <button
              onClick={() => onNavigate('profile')} 
              className="flex items-center gap-3 md:gap-4 hover:bg-slate-50 p-1.5 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-black shadow-md group-hover:scale-105 transition-transform">
                {userNameDisplay.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left pr-2">
                <p className="text-sm font-black text-slate-900 tracking-tight leading-none capitalize">
                  {userNameDisplay} 
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                   <Shield size={10} className="text-indigo-500" /> Verified Analyst
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-10 bg-[#F8FAFC] animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;