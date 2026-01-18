import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" /> },
        { name: 'User Management', path: '/admin/users', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></> },
        { name: 'Filings', path: '/admin/filings', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></> },
        { name: 'Monitoring', path: '/admin/monitoring', icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></> },
        { name: 'Finance', path: '/admin/finance', icon: <><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></> },
        { name: 'Settings', path: '/admin/settings', icon: <><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></> },
    ];

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <div className="flex h-screen bg-[#0f1214] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#161b22] border-r border-[#30363d] transition-all duration-300 flex flex-col z-20`}
            >
                <div className="h-16 flex items-center justify-center border-b border-[#30363d] cursor-pointer" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
                    {isSidebarCollapsed ? (
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">G</span>
                    ) : (
                        <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">GLOBAL IPI</span>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-3">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-blue-600/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                            : 'text-gray-400 hover:bg-[#1f2937] hover:text-white'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20" height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={`transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`}
                                        >
                                            {item.icon}
                                        </svg>
                                        {!isSidebarCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-[#30363d]">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
                </div>

                {/* Top Navbar */}
                <header className="h-16 border-b border-[#30363d] bg-[#0f1214]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-white">Dashboard Overview</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Global search..."
                                className="bg-[#161b22] border border-[#30363d] rounded-full py-1.5 px-4 pl-10 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 transition-all"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-[#1f2937]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0f1214]"></span>
                            </button>

                            <div className="flex items-center gap-3 pl-4 border-l border-[#30363d]">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-white">Super Admin</p>
                                    <p className="text-xs text-gray-500">System Administrator</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-[#0f1214]">
                                    SA
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6 z-10 scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
