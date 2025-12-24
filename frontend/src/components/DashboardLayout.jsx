import React, { useState } from 'react';
import { 
  LayoutDashboard,
  FileText,
  Shield,
  Activity,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Menu
} from 'lucide-react';

const DashboardLayout = ({ user, onLogout, currentPage, onNavigate, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigate('search', searchTerm);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'patents', label: 'My Patents', icon: FileText },

    // ✅ NEW ITEM — ADDED BELOW "MY PATENTS"
    { id: 'search', label: 'Search IP Analysis', icon: Search },

    { id: 'new-filing', label: 'New Filing', icon: Shield },
    { id: 'analysis', label: 'IP Analysis', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`w-64 bg-indigo-900 text-white flex flex-col fixed h-full z-30
        transition-transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Global IP</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  currentPage === item.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-indigo-800 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3
                       text-slate-300 hover:text-white
                       hover:bg-red-900/30 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Menu
              className="w-6 h-6 text-slate-500 md:hidden cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            />

            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-md hidden sm:block"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search global patents and filings..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50
                           border border-slate-200 rounded-lg
                           focus:ring-2 focus:ring-indigo-500
                           outline-none text-sm transition-all"
              />
            </form>
          </div>

          {/* User */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition">
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center
                              text-indigo-700 font-bold border border-indigo-200">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.role}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
