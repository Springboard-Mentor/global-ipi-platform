import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithCustomToken, getIdToken } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';
import IPAssetPanel from './components/IPAssetPanel';
import ContactForm from './components/ContactForm';
import FeedbackForm from './components/FeedbackForm';

const App = () => {
  // Check URL parameters for auth data
  const checkURLParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');
    const userId = urlParams.get('uid');
    const userEmail = urlParams.get('email');
    
    if (authToken && userId && userEmail) {
      console.log('🔗 Found auth parameters in URL');
      return { token: authToken, uid: userId, email: userEmail };
    }
    return null;
  };
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(() => {
    return localStorage.getItem('searchMode') || 'api';
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize userProfile from localStorage if available
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        console.log('✅ Loaded user profile from localStorage');
        return JSON.parse(savedProfile);
      }
    } catch (error) {
      console.error('❌ Error loading profile from localStorage:', error);
    }
    
    // Return default values if nothing in localStorage
    return {
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
    };
  });

  // Dynamic authentication - using real user authentication
  const isDevelopmentMode = false; // Set to false in production
  const TEST_UID = "JBKwcX248aeStcb15EnK8M8jwSW2";

  // Save userProfile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile.uid) {
      try {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        console.log('💾 Saved user profile to localStorage');
      } catch (error) {
        console.error('❌ Error saving profile to localStorage:', error);
      }
    }
  }, [userProfile]);

  // Monitor authentication state
  useEffect(() => {
    console.log('🔄 Setting up auth listener...');
    console.log('🔍 Auth persistence:', auth.config?.authDomain);
    
    // Check URL parameters first for direct authentication
    const urlAuthData = checkURLParams();
    if (urlAuthData) {
      console.log('🔗 Found auth data in URL, authenticating...');
      const authUser = { uid: urlAuthData.uid, email: urlAuthData.email };
      setUser(authUser);
      
      // Also set a basic userProfile immediately to pass auth check
      setUserProfile(prev => ({
        ...prev,
        uid: urlAuthData.uid,
        email: urlAuthData.email
      }));
      
      fetchUserDataWithUID(urlAuthData.uid, authUser);
      setLoading(false);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    // Check localStorage for existing auth state first
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.uid) {
          console.log('💾 Found saved user profile in localStorage:', profile.email);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('❌ Error parsing saved profile:', error);
      }
    }
    
    // Give MORE time for Firebase to restore auth state from other app
    const timer = setTimeout(() => {
      if (!auth.currentUser) {
        console.log('⏰ Timeout: No authenticated user found after 8 seconds');
        console.log('👤 Auth currentUser:', auth.currentUser);
        console.log('💾 LocalStorage profile:', savedProfile ? 'exists' : 'none');
        
        // If we have a saved profile, try to use it
        if (savedProfile) {
          console.log('🔧 Using saved profile from localStorage');
          const profile = JSON.parse(savedProfile);
          if (profile.uid && profile.email) {
            console.log('✅ Valid profile found, continuing with saved data');
            setUser({ uid: profile.uid, email: profile.email });
            setUserProfile(profile);
            setLoading(false);
            return;
          }
        }
        
        console.log('👤 User must log in to access dashboard');
        setLoading(false);
      }
    }, 8000); // Increased timeout for auth state restoration
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timer); // Clear timeout if auth state changes
      console.log("🔐 Dashboard auth state changed!");
      console.log("Current User Object:", currentUser);
      console.log("User UID:", currentUser?.uid);
      console.log("User Email:", currentUser?.email);
      console.log('User Display Name:', currentUser?.displayName);
      console.log('User Email Verified:', currentUser?.emailVerified);
      
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        console.log('✅ User authenticated, fetching profile data...');
        // Fetch user data from Firestore with real user
        fetchUserDataWithUID(currentUser.uid, currentUser);
      } else {
        console.log('❌ No authenticated user found');
        // Check if we have a saved profile to use
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile);
            if (profile.uid) {
              console.log('💾 Using saved profile for user:', profile.email);
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('❌ Error parsing saved profile:', error);
          }
        }
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Real-time subscription listener
  useEffect(() => {
    if (!userProfile?.uid) return;

    console.log('📡 Setting up real-time subscription listener for:', userProfile.uid);
    
    const userRef = doc(db, 'users', userProfile.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('🔄 Subscription updated:', data.subscriptionType);
        
        setUserProfile(prev => ({
          ...prev,
          subscriptionType: data.subscriptionType || 'basic',
          subscriptionPrice: data.subscriptionPrice || 0,
          subscriptionStartDate: data.subscriptionStartDate,
          subscriptionEndDate: data.subscriptionEndDate,
          subscriptionUpdatedAt: data.subscriptionUpdatedAt,
        }));
      }
    }, (error) => {
      console.error('❌ Error listening to subscription updates:', error);
    });

    return () => unsubscribe();
  }, [userProfile?.uid]);

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
          updatedAt: firestoreData.updatedAt,
          subscriptionType: firestoreData.subscriptionType || 'basic',
          subscriptionPrice: firestoreData.subscriptionPrice || 0,
          subscriptionStartDate: firestoreData.subscriptionStartDate,
          subscriptionEndDate: firestoreData.subscriptionEndDate,
          subscriptionUpdatedAt: firestoreData.subscriptionUpdatedAt,
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
      
      // Clear localStorage
      localStorage.removeItem('userProfile');
      console.log('🗑️ Cleared user profile from localStorage');
      
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

  // Check if authentication is required - allow if user exists OR we have valid profile data
  if (!user && !userProfile.uid && !loading) {
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
        userProfile={userProfile}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>

        <HeaderBar
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setCurrentPage('profile')}
          userProfile={userProfile}
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage('search');
            setActiveItem('search');
          }}
          currentPage={currentPage}
          sidebarOpen={sidebarOpen}
        />

        <div className="flex-1 overflow-auto" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          <div className="p-4 lg:p-6 w-full">

            {currentPage === 'dashboard' ? (
              <Dashboard 
                userProfile={userProfile} 
                searchMode={searchMode}
                setSearchMode={(mode) => {
                  setSearchMode(mode);
                  localStorage.setItem('searchMode', mode);
                }}
              />
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
              <SearchResultsPage 
                query={searchQuery} 
                searchMode={searchMode}
                setSearchMode={(mode) => {
                  setSearchMode(mode);
                  localStorage.setItem('searchMode', mode);
                }}
                onBack={() => {
                  setCurrentPage('dashboard');
                  setActiveItem('dashboard');
                  setSearchQuery('');
                }} 
              />
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
            ) : currentPage === 'contact' ? (
              <ContactForm onClose={() => {
                setCurrentPage('dashboard');
                setActiveItem('dashboard');
              }} />
            ) : currentPage === 'feedback' ? (
              <FeedbackForm 
                userProfile={userProfile}
                onClose={() => {
                  setCurrentPage('dashboard');
                  setActiveItem('dashboard');
                }} 
              />
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

          {/* Enhanced Footer with Quick Links */}
          <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 py-8 px-6 mt-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                {/* About Section */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Global IP Platform</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Advanced intellectual property management and analytics platform for modern businesses.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => {
                          setCurrentPage('dashboard');
                          setActiveItem('dashboard');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setCurrentPage('search');
                          setActiveItem('search');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Search Patents
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setActiveItem('profile');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        My Profile
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Support</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => {
                          setCurrentPage('contact');
                          setActiveItem('contact');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Contact Support
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setCurrentPage('feedback');
                          setActiveItem('feedback');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Send Feedback
                      </button>
                    </li>
                    <li>
                      <a
                        href="mailto:vikaskumaryadav068@gmail.com"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Email Support
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Documentation
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Developer Info */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Developer</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <strong>Vikas Yadav</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Full Stack Developer
                    </p>
                    <a
                      href="mailto:vikaskumaryadav068@gmail.com"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline block"
                    >
                      vikaskumaryadav068@gmail.com
                    </a>
                    <div className="flex gap-3 mt-3">
                      <a
                        href="https://github.com/Vikasyadav068"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/vikas-kumar-2b695a276/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-6 border-t border-gray-300">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600 text-center md:text-left">
                    © {new Date().getFullYear()} Global IP Intelligence Platform. All rights reserved.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800 hover:underline">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800 hover:underline">
                      Terms of Service
                    </a>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-800 hover:underline">
                      Cookie Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </div>

    </div>
  );
};

export default App;
