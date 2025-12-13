import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
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
    lastSignInTime: '',
    authProvider: '',
    createdAt: null,
    updatedAt: null
  });

  // DEVELOPMENT MODE: Use test UID if no real authentication
  const isDevelopmentMode = true;
  const TEST_UID = "qLrmSMxqHeP42Rjxtmrxq77j2Ef2";

  // Monitor authentication state
  useEffect(() => {
    console.log('🔄 Setting up auth listener...');
    
    // Give MORE time for Firebase to restore auth state from other app
    const timer = setTimeout(() => {
      if (!auth.currentUser) {
        console.log('⏰ Timeout: No user found after 5 seconds');
        
        // In development mode, fetch data with TEST_UID
        if (isDevelopmentMode) {
          console.log('🔧 Development mode: Fetching data with TEST_UID');
          fetchUserDataWithUID(TEST_UID);
        }
        
        setLoading(false);
      }
    }, 5000);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timer); // Clear timeout if auth state changes
      console.log("🔐 Dashboard auth state changed!");
      console.log("Current User Object:", currentUser);
      console.log("User UID:", currentUser?.uid);
      console.log("User Email:", currentUser?.email);
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // Fetch user data from Firestore with real user
        fetchUserDataWithUID(currentUser.uid, currentUser);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Fetch user data from Firestore - works with or without authenticated user
  const fetchUserDataWithUID = async (uid, authenticatedUser = null) => {
    try {
      console.log('📥 Fetching user data for UID:', uid);
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const firestoreData = userDocSnap.data();
        console.log('✅ Firestore user data found:', firestoreData);
        
        const profileData = {
          firstName: firestoreData.firstName || '',
          lastName: firestoreData.lastName || '',
          email: firestoreData.email || authenticatedUser?.email || '',
          company: firestoreData.company || '',
          position: firestoreData.position || '',
          uid: uid,
          photoURL: firestoreData.photoURL || authenticatedUser?.photoURL || '',
          phoneNumber: firestoreData.phoneNumber || authenticatedUser?.phoneNumber || '',
          emailVerified: authenticatedUser?.emailVerified || false,
          creationTime: authenticatedUser?.metadata?.creationTime || '',
          lastSignInTime: authenticatedUser?.metadata?.lastSignInTime || '',
          authProvider: firestoreData.authProvider || '',
          createdAt: firestoreData.createdAt,
          updatedAt: firestoreData.updatedAt
        };
        
        console.log('📝 Setting profile data:', profileData);
        setUserProfile(profileData);
      } else {
        console.log('⚠️ No Firestore document found for UID:', uid);
        
        // Fallback to Firebase Auth data if available
        if (authenticatedUser) {
          console.log('Using Firebase Auth data as fallback');
          const displayName = authenticatedUser.displayName || '';
          let firstName = 'User';
          let lastName = '';
          
          if (displayName) {
            const nameParts = displayName.split(' ');
            firstName = nameParts[0] || 'User';
            lastName = nameParts.slice(1).join(' ') || '';
          } else if (authenticatedUser.email) {
            const emailName = authenticatedUser.email.split('@')[0];
            firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          }
          
          setUserProfile({
            firstName: firstName,
            lastName: lastName,
            email: authenticatedUser.email || '',
            company: '',
            position: '',
            uid: uid,
            photoURL: authenticatedUser.photoURL || '',
            phoneNumber: authenticatedUser.phoneNumber || '',
            emailVerified: authenticatedUser.emailVerified,
            creationTime: authenticatedUser.metadata.creationTime,
            lastSignInTime: authenticatedUser.metadata.lastSignInTime,
            authProvider: '',
            createdAt: null,
            updatedAt: null
          });
        } else {
          console.log('⚠️ No authenticated user data available');
          // Set minimal profile with just the UID
          setUserProfile(prev => ({
            ...prev,
            uid: uid
          }));
        }
      }
    } catch (error) {
      console.error('❌ Error fetching user data from Firestore:', error);
    }
  };



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
        lastSignInTime: '',
        authProvider: '',
        createdAt: null,
        updatedAt: null
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
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-800 text-xl font-semibold">Loading Dashboard...</p>
            <p className="text-gray-600 text-sm mt-2">Checking authentication (this may take a few seconds)</p>
            <p className="text-gray-500 text-xs mt-3">If this takes too long, please refresh the page</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if authentication is required (already declared at top)
  if (!user && !loading && !isDevelopmentMode) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-purple-500">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Not Authenticated</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access the dashboard.</p>
          <p className="text-sm text-gray-500 mb-6">Please login first, then the dashboard will load automatically.</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                console.log("Redirecting to login page...");
                window.location.href = "http://localhost:3000";
              }}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Go to Login Page
            </button>
            <button
              onClick={() => {
                console.log("Refreshing page...");
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
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