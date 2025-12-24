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
import { authAPI } from './services/ai.js';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // ✅ State to hold the specific patent clicked
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
          console.error('Session expired:', error);
          handleLogout();
        }
      }
      setLoading(false);
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

  // ✅ HANDLER: View Patent Details
  // This function is passed down to SearchResultsPage and PatentsPage
  const handleViewPatent = (patent) => {
    console.log("Saving patent to state:", patent); // Debug log
    setSelectedPatent(patent);      // Save data
    setCurrentPage('patent-details'); // Switch view
  };

  const handleUpdateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const renderPage = () => {
    const protectedPages = ['dashboard', 'profile', 'patents', 'new-filing', 'analysis', 'settings', 'search', 'patent-details'];
    
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
            {currentPage === 'dashboard'  && <DashboardHome onNavigate={handleNavigate} />}
            {currentPage === 'profile'    && <ProfilePage user={user} onUpdateUser={handleUpdateUser} />}
            
            {/* ✅ Updated PatentsPage to receive the view handler */}
            {currentPage === 'patents'    && (
              <PatentsPage onViewPatent={handleViewPatent} />
            )}
            
            {currentPage === 'new-filing' && <NewFilingPage />}
            {currentPage === 'analysis'   && <AnalysisPage />} 
            {currentPage === 'settings'   && <SettingsPage />} 
            
            {/* ✅ Updated SearchResultsPage to receive the view handler */}
            {currentPage === 'search'     && (
              <SearchResultsPage 
                initialKeyword={searchKeyword} 
                onViewPatent={handleViewPatent} 
              />
            )}

            {/* ✅ PatentDetailsPage receives the data and back handler */}
            {currentPage === 'patent-details' && (
              <PatentDetailsPage 
                patent={selectedPatent} 
                onBack={() => setCurrentPage('search')} 
              />
            )}
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