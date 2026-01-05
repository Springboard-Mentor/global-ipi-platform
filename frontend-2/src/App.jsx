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
import SearchResultsPage from './components/SearchResultsPage.jsx'; 
import PatentDetailsPage from './components/PatentDetailsPage.jsx'; 

// ✅ NEW IMPORTS FOR VISUALIZATION
import LegalDashboardPage from './components/LegalDashboardPage.jsx';
import LandscapeVisualizationPage from './components/LandscapeVisualizationPage.jsx';

import { authAPI } from './services/ai.js';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPatent, setSelectedPatent] = useState(null);

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
          handleLogout();
        }
      }
      setLoading(false); // ✅ Fix: Safety stop for spinner
    };
    checkAuth();
  }, []);

  const handleLogin = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page, keyword = '') => {
    if (keyword) setSearchKeyword(keyword);
    setCurrentPage(page);
  };

  const handleViewPatent = (patent) => {
    setSelectedPatent(patent);
    setCurrentPage('patent-details');
  };

  const handleUpdateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const renderPage = () => {
    // ✅ NEW ANALYTICS PAGES ADDED TO PROTECTED LIST
    const protectedPages = [
        'dashboard', 'profile', 'patents', 'new-filing', 
        'analysis', 'settings', 'search', 'patent-details',
        'legal-dashboard', 'landscape'
    ];
    
    if (protectedPages.includes(currentPage) && !user) {
      return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'landing': return <LandingPage onNavigate={handleNavigate} />;
      case 'login': return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'register': return <RegisterPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      
      default:
        return (
          <DashboardLayout
            user={user}
            onLogout={handleLogout}
            currentPage={currentPage}
            onNavigate={handleNavigate}
          >
            {/* --- CORE PAGES --- */}
            {currentPage === 'dashboard' && <DashboardHome user={user} onNavigate={handleNavigate} />}
            {currentPage === 'profile' && <ProfilePage user={user} onUpdateUser={handleUpdateUser} onBack={() => setCurrentPage('dashboard')} />}
            {currentPage === 'patents' && <PatentsPage onViewPatent={handleViewPatent} />}
            {currentPage === 'new-filing' && <NewFilingPage />}
            {currentPage === 'analysis' && <AnalysisPage />} 
            {currentPage === 'settings' && <SettingsPage />} 
            
            {/* ✅ NEW COLORFUL VISUALIZATION PAGES */}
            {currentPage === 'legal-dashboard' && <LegalDashboardPage />}
            {currentPage === 'landscape' && <LandscapeVisualizationPage />}

            {/* --- SEARCH PAGES --- */}
            {currentPage === 'search' && <SearchResultsPage initialKeyword={searchKeyword} onViewPatent={handleViewPatent} />}
            {currentPage === 'patent-details' && <PatentDetailsPage patent={selectedPatent} onBack={() => setCurrentPage('search')} />}
          </DashboardLayout>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <div className="min-h-screen font-sans text-slate-900 bg-white">{renderPage()}</div>;
};

export default App;