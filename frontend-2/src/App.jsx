import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Component Imports
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
import LegalDashboardPage from './components/LegalDashboardPage.jsx';
import LandscapeVisualizationPage from './components/LandscapeVisualizationPage.jsx';
import FilingTrackerPage from './components/FilingTrackerPage.jsx';
import PricingPage from './components/PricingPage.jsx';

// Services & Styles
import { authAPI } from './services/ai.js';
import 'leaflet/dist/leaflet.css';

// --- WRAPPER COMPONENTS ---

const DashboardWithRouter = ({ user, handleLogout, handleUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path, keyword = '') => {
    if (path === 'dashboard' || path === 'overview') {
      navigate('/overview');
    } else if (path === 'search' && keyword) {
      navigate('/search', { state: { keyword } });
    } else {
      navigate(`/${path}`);
    }
  };

  const getCurrentPageId = () => {
    const path = location.pathname.substring(1); 
    // Return path or default to dashboard
    return path.split('/')[0] || 'dashboard';
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      currentPage={getCurrentPageId()} 
      onNavigate={handleNavigate} 
    >
      <Routes>
        <Route path="overview" element={<DashboardHome user={user} onNavigate={handleNavigate} />} />
        <Route path="profile" element={<ProfilePage user={user} onUpdateUser={handleUpdateUser} onBack={() => navigate('/overview')} />} />
        <Route path="patents" element={<PatentsWithNav />} />
        <Route path="new-filing" element={<NewFilingPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="search" element={<SearchWithNav />} />
        <Route path="patent-details" element={<DetailsWithNav />} />
        
        {/* Analytics & Specialized Routes */}
        <Route path="legal-dashboard" element={<LegalDashboardPage />} />
        <Route path="landscape" element={<LandscapeVisualizationPage />} />
        <Route path="filing-tracker" element={<FilingTrackerPage user={user} onNavigate={handleNavigate} />} />
        <Route path="pricing" element={<PricingPage onNavigate={handleNavigate} onUpdateUser={handleUpdateUser} />} />

        {/* Catch-all for dashboard */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

const PatentsWithNav = () => {
  const navigate = useNavigate();
  const handleViewPatent = (patent) => {
    navigate('/patent-details', { state: { patent } });
  };
  return <PatentsPage onViewPatent={handleViewPatent} />;
};

const SearchWithNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialKeyword = location.state?.keyword || '';

  const handleViewPatent = (patent) => {
    navigate('/patent-details', { state: { patent } });
  };
  return <SearchResultsPage initialKeyword={initialKeyword} onViewPatent={handleViewPatent} />;
};

const DetailsWithNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patent = location.state?.patent;

  if (!patent) return <Navigate to="/search" />;

  return <PatentDetailsPage patent={patent} onBack={() => navigate(-1)} />;
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Session expired:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUpdateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onNavigate={(path) => window.location.href = path} />} />
        
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/overview" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <RegisterPage onLogin={handleLogin} /> : <Navigate to="/overview" />} 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/*" 
          element={
            user ? (
              <DashboardWithRouter 
                user={user} 
                handleLogout={handleLogout} 
                handleUpdateUser={handleUpdateUser} 
              />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </div>
  );
};

export default App;