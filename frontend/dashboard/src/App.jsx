import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import IPAssetPanel from './components/IPAssetPanel';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    company: 'TechCorp',
    position: 'IP Manager'
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-purple-500 overflow-hidden">

      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        <HeaderBar
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setCurrentPage('profile')}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">

            {currentPage === 'dashboard' ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <Dashboard userProfile={userProfile} />
                </div>
                <div className="xl:col-span-1">
                  <IPAssetPanel />
                </div>
              </div>
            ) : (
              <ProfilePage
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                onBack={() => setCurrentPage('dashboard')}
              />
            )}

          </div>

          <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 py-4 px-6 mt-8">
            <p className="text-center text-sm text-gray-600">
              © 2025 Global IP Intelligence Platform. All rights reserved.
            </p>
          </footer>

        </div>
      </div>

    </div>
  );
};

export default App;
