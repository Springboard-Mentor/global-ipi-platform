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
  PlusCircle,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = ({ user, onLogout, currentPage, onNavigate, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Premium Dashboard Quotes
  const quotes = [
    "Innovation distinguishes between a leader and a follower.",
    "The best way to predict the future is to create it.",
    "Protecting today's ideas for tomorrow's world.",
    "Knowledge is the only asset that grows when shared and protected."
  ];

  const activeQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  /**
   * ✅ NAVIGATION CONFIGURATION
   * These IDs must match the paths in App.jsx Route components.
   */
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard }, 
    { id: 'patents', label: 'My Patents', icon: FileText },
    { id: 'search', label: 'Search IP Analysis', icon: Search },
    
    // ANALYTICS PAGES
    { id: 'legal-dashboard', label: 'Legal Dashboard', icon: BarChart3 },
    { id: 'landscape', label: 'Landscape View', icon: TrendingUp },

    { id: 'new-filing', label: 'New Filing', icon: PlusCircle },
    { id: 'analysis', label: 'AI Analysis', icon: Activity },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const userNameDisplay = user?.name || user?.displayName || 'Authorized User';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-left font-sans selection:bg-indigo-100">
      
      {/* Mobile Menu Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Dark Premium Theme */}
      <aside className={`w-72 bg-[#0F172A] text-white flex flex-col fixed h-full z-50 transition-transform duration-300 border-r border-white/5 shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter uppercase leading-none">Global IP</h2>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1.5">Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-6 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group 
              ${currentPage === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {currentPage === item.id && <ChevronRight size={14} className="animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </nav>

        {/* User Sign Out */}
        <div className="p-6 border-t border-white/10 bg-slate-900/50">
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

        {/* Top Header - Glassmorphism */}
        <header className="h-24 px-10 flex justify-between items-center border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-40">
          
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="p-2 text-slate-500 md:hidden hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Motivational Quote Display */}
            <div className="hidden lg:block flex-1 max-w-xl pr-10">
              <p className="text-slate-500 italic font-medium text-sm leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
                "{activeQuote}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Notification Bell */}
            <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all relative group">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
            </button>

            <div className="h-10 w-px bg-slate-200" />

            {/* Profile Button */}
            <button
              onClick={() => onNavigate('profile')} 
              className="flex items-center gap-5 hover:bg-slate-50 p-2 rounded-[1.5rem] transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform uppercase">
                {userNameDisplay.charAt(0)}
              </div>
              <div className="hidden lg:block text-left pr-4">
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

        {/* Dynamic Page Content Render */}
        <main className="flex-1 p-10 bg-[#F8FAFC] overflow-y-auto relative animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;