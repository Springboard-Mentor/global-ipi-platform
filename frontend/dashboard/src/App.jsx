import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import IPAssetPanel from './components/IPAssetPanel';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    position: '',
    uid: '',
    photoURL: '',
    phoneNumber: '',
    emailVerified: false,
    creationTime: '',
    lastSignInTime: ''
  });

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Dashboard auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // Update user profile with comprehensive real user data
        const displayName = currentUser.displayName || '';
        let firstName = 'User';
        let lastName = '';
        
        if (displayName) {
          const nameParts = displayName.split(' ');
          firstName = nameParts[0] || 'User';
          lastName = nameParts.slice(1).join(' ') || '';
        } else if (currentUser.email) {
          // Extract name from email
          const emailName = currentUser.email.split('@')[0];
          // Handle specific case for vikas emails
          if (emailName.toLowerCase().includes('vikas')) {
            firstName = 'Vikas';
          } else {
            // Capitalize first letter of email username
            firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          }
        }
        
        setUserProfile({
          firstName: firstName,
          lastName: lastName,
          email: currentUser.email || '',
          company: 'IP Intelligence Corp', // Default company
          position: 'IP Analyst', // Default position
          uid: currentUser.uid,
          photoURL: currentUser.photoURL || '',
          phoneNumber: currentUser.phoneNumber || '',
          emailVerified: currentUser.emailVerified,
          creationTime: currentUser.metadata.creationTime,
          lastSignInTime: currentUser.metadata.lastSignInTime
        });
      } else {
        // Reset to empty state when no user
        setUserProfile({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          position: '',
          uid: '',
          photoURL: '',
          phoneNumber: '',
          emailVerified: false,
          creationTime: '',
          lastSignInTime: ''
        });
      }
      // Removed automatic redirect for standalone testing
    });

    // Set loading to false after a short delay for standalone mode
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?\n\nYou will be redirected to the login page."
    );
    
    if (!confirmLogout) {
      return; // User cancelled
    }

    try {
      console.log("Logging out user...");
      await signOut(auth);
      console.log("User logged out successfully");
      
      // Clear any cached auth state
      setUser(null);
      setUserProfile({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        position: '',
        uid: '',
        photoURL: '',
        phoneNumber: '',
        emailVerified: false,
        creationTime: '',
        lastSignInTime: ''
      });
      
      // Show success message and redirect
      alert("Successfully logged out! Redirecting to login page...");
      
      // Redirect to login page after short delay
      setTimeout(() => {
        window.location.href = "http://localhost:3000";
      }, 1000);
      
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error signing out: " + error.message + "\n\nRedirecting to login page anyway...");
      
      // Force redirect even if signout fails
      setTimeout(() => {
        window.location.href = "http://localhost:3000";
      }, 2000);
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-purple-500">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-purple-500 overflow-hidden">

      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        setActiveItem={(item) => {
          setActiveItem(item);
          setCurrentPage(item);
          setSidebarOpen(false);
        }}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        <HeaderBar
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setCurrentPage('profile')}
          userProfile={userProfile}
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
            ) : currentPage === 'profile' ? (
              <ProfilePage
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                onBack={() => {
                  setCurrentPage('dashboard');
                  setActiveItem('dashboard');
                }}
              />
            ) : currentPage === 'search' ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
                <p className="text-gray-600">Search functionality coming soon...</p>
              </div>
            ) : currentPage === 'filing' ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Filing Tracker</h2>
                <p className="text-gray-600">Filing tracker functionality coming soon...</p>
              </div>
            ) : currentPage === 'legal' ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Legal Status</h2>
                <p className="text-gray-600">Legal status functionality coming soon...</p>
              </div>
            ) : currentPage === 'settings' ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
                <p className="text-gray-600">Settings functionality coming soon...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <Dashboard userProfile={userProfile} />
                </div>
                <div className="xl:col-span-1">
                  <IPAssetPanel />
                </div>
              </div>
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
