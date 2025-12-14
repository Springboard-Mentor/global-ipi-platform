import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import DashboardHome from './components/DashboardHome.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import PatentsPage from './components/PatentsPage.jsx';
import NewFilingPage from './components/NewFilingPage.jsx';
import AnalysisPage from './components/AnalysisPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import { authAPI } from './services/ai.js';

// --- Placeholder Components (Removed the need for these by importing the actual components) ---
// Note: Keeping the AnalysisPage and SettingsPage imports above assumes you have saved 
// the rich code I provided for those pages in their respective files.

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          if (['landing', 'login', 'register'].includes(currentPage)) {
             setCurrentPage('dashboard');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setCurrentPage('landing');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []); 

  const handleLogin = async (userData) => {
    if (!userData) {
      try {
        userData = await authAPI.getCurrentUser();
      } catch (error) {
        console.error("Could not fetch user data on login", error);
        return;
      }
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentPage('landing');
    }
  };

  // ✅ FINAL FIX: Ensures 'bio' is correctly maintained in the frontend state
  // This is vital since the backend does not store 'bio' but the frontend needs it.
  const handleUpdateUser = (updates) => {
    if (user) {
      const updatedUser = { 
          ...user, 
          ...updates 
      };
      
      // If the backend didn't send 'bio' back, we must keep the old 'bio' or use the new one from 'updates'.
      const finalUser = {
          ...updatedUser,
          bio: updates.bio !== undefined ? updates.bio : updatedUser.bio
      };

      setUser(finalUser);
      localStorage.setItem('user', JSON.stringify(finalUser));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Router logic
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      
      case 'register':
        return <RegisterPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      
      // --- PROTECTED ROUTES ---
      case 'dashboard':
      case 'profile':
      case 'patents':
      case 'new-filing':
      case 'analysis':
      case 'settings':
        
        if (!user) {
          return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
        }
        
        return (
          <DashboardLayout 
            user={user} 
            onLogout={handleLogout} 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          >
            {/* Dashboard Overview */}
            {currentPage === 'dashboard' && <DashboardHome onNavigate={setCurrentPage} />}
            
            {/* Profile Page */}
            {currentPage === 'profile' && <ProfilePage user={user} onUpdateUser={handleUpdateUser} />}
            
            {/* Patents List */}
            {currentPage === 'patents' && <PatentsPage />}
            
            {/* New Filing Form */}
            {currentPage === 'new-filing' && <NewFilingPage />}

            {/* IP Analysis Page */}
            {currentPage === 'analysis' && <AnalysisPage />} 

            {/* Settings Page */}
            {currentPage === 'settings' && <SettingsPage />} 

          </DashboardLayout>
        );
      
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900">
      {renderPage()}
    </div>
  );
};

export default App;