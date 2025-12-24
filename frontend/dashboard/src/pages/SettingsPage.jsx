import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, Activity, LogOut, Bell, Palette, Globe, FileText, 
  HelpCircle, Trash, CreditCard, Download, Moon, Sun, Settings, Clock, 
  AlertCircle, Calendar, Crown, Shield, User, Mail
} from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, updateDoc, serverTimestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { storage } from '../firebase';

const SettingsPage = ({ userProfile, setUserProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState('security');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    lastUpdated: null
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    paymentAlerts: true,
    searchAlerts: false,
    systemAnnouncements: true
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const currentUID = auth.currentUser?.uid || userProfile?.uid;

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUID) {
        setIsLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUID);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          
          // Set user basic details
          setUserDetails({
            name: userProfile?.firstName || data.firstName || data.name || auth.currentUser?.displayName || 'User',
            email: data.email || auth.currentUser?.email || '',
            lastUpdated: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || null)
          });
          
          if (data.notificationSettings) {
            setNotificationSettings(data.notificationSettings);
          }
          
          if (data.preferences) {
            setPreferences(data.preferences);
          }
        } else {
          // If no Firestore data, use auth data
          setUserDetails({
            name: userProfile?.firstName || auth.currentUser?.displayName || 'User',
            email: auth.currentUser?.email || '',
            lastUpdated: null
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [currentUID]);

  // Security Settings Handlers
  const handleSendPasswordReset = async () => {
    try {
      const email = userDetails.email || auth.currentUser?.email;
      
      if (!email) {
        alert('Email not found. Please login again.');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      alert(`Password reset email sent to ${email}. Please check your inbox.`);
      
      // Reset the message after 5 seconds
      setTimeout(() => {
        setResetEmailSent(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      if (error.code === 'auth/too-many-requests') {
        alert('Too many requests. Please try again later.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };



  // Notification Settings Handler
  const handleSaveNotifications = async () => {
    try {
      const userRef = doc(db, 'users', currentUID);
      await updateDoc(userRef, {
        notificationSettings: notificationSettings,
        updatedAt: serverTimestamp()
      });
      alert('Notification settings saved!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    }
  };

  // Preferences Handler
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', currentUID);
      await updateDoc(userRef, {
        preferences: preferences,
        updatedAt: serverTimestamp()
      });
      
      alert('Preferences saved!');
    } catch (error) {
      alert('Error saving preferences: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Apply theme whenever preferences.theme changes
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSavePreferences();
    }
  };

  // Account Management
  const handleDeactivateAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account? You can reactivate it by logging in again.')) return;
    
    try {
      const userRef = doc(db, 'users', currentUID);
      await updateDoc(userRef, {
        accountStatus: 'deactivated',
        deactivatedAt: serverTimestamp()
      });
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', currentUID));
      
      // Delete user's photos from Storage
      try {
        const photoRef = ref(storage, `users/${currentUID}/profile.jpg`);
        await deleteObject(photoRef);
      } catch (e) {
        console.log('No photos to delete');
      }
      
      // Delete auth account
      await auth.currentUser.delete();
      
      alert('Account deleted successfully');
      window.location.href = '/';
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'legal', label: 'Legal & Support', icon: FileText },
    { id: 'account', label: 'Account Management', icon: AlertCircle }
  ];

  // Render Security Tab Content
  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* User Basic Details */}
      <div className="bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <User className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">User Details</h3>
            <p className="text-sm text-gray-500">Your basic account information</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all">
            <div className="flex items-center gap-3">
              <User className="text-indigo-500" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-500">First Name</p>
                <p className="font-bold text-gray-800">{userDetails.name}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all">
            <div className="flex items-center gap-3">
              <Mail className="text-indigo-500" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-500">Email</p>
                <p className="font-bold text-gray-800">{userDetails.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all">
            <div className="flex items-center gap-3">
              <Clock className="text-indigo-500" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-500">Last Updated</p>
                <p className="font-bold text-gray-800">
                  {userDetails.lastUpdated ? new Date(userDetails.lastUpdated).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password */}
      <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Lock className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Reset Password</h3>
            <p className="text-sm text-gray-500">Send password reset link to your email</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
            <p className="text-gray-700 mb-2">
              Click the button below to receive a password reset link at:
            </p>
            <p className="font-bold text-blue-600 flex items-center gap-2">
              <Mail size={18} />
              {userDetails.email}
            </p>
          </div>
          
          {resetEmailSent && (
            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-700 font-semibold">
                ✓ Reset email sent! Check your inbox.
              </p>
            </div>
          )}
          
          <button
            onClick={handleSendPasswordReset}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
          >
            Send Reset Password Email
          </button>
        </div>
      </div>

    </div>
  );

  // Render Subscription Tab Content
  const renderSubscriptionTab = () => {
    const subscriptionType = userProfile?.subscriptionType || 'basic';
    const subscriptionPrice = userProfile?.subscriptionPrice || 0;
    const endDate = userProfile?.subscriptionEndDate ? 
      (userProfile.subscriptionEndDate.toDate ? userProfile.subscriptionEndDate.toDate() : new Date(userProfile.subscriptionEndDate)) : 
      null;
    const daysLeft = endDate ? Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crown size={32} />
              <div>
                <h3 className="text-2xl font-bold capitalize">{subscriptionType} Plan</h3>
                <p className="text-blue-100">Currently Active</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₹{subscriptionPrice}</p>
              <p className="text-blue-100">/month</p>
            </div>
          </div>
          
          {endDate && (
            <div className="bg-white/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Next Billing Date</p>
                  <p className="font-semibold">{endDate.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Days Remaining</p>
                  <p className="font-bold text-2xl">{daysLeft}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-green-500" size={24} />
            Payment History
          </h3>
          
          {userProfile?.lastPayment ? (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Last Payment</p>
                  <p className="text-sm text-gray-500">
                    ₹{userProfile.lastPayment.amount} {userProfile.lastPayment.currency}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full h-fit">Success</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Payment ID</p>
                  <p className="font-mono text-xs text-gray-800 break-all">{userProfile.lastPayment.razorpayPaymentId}</p>
                </div>
                
                {userProfile.lastPayment.razorpayOrderId && (
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-mono text-xs text-gray-800 break-all">{userProfile.lastPayment.razorpayOrderId}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No payment history available</p>
          )}
        </div>

        {/* Upgrade/Cancel Options */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Subscription</h3>
          <div className="space-y-3">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
              Upgrade Plan
            </button>
            <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Notifications Tab Content
  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Bell className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Manage how you receive updates</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: '📧' },
            { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified about payments and billing', icon: '💳' },
            { key: 'searchAlerts', label: 'Search Alerts', desc: 'Alerts for new search results', icon: '🔍' },
            { key: 'systemAnnouncements', label: 'System Announcements', desc: 'Important platform updates', icon: '📢' }
          ].map(({ key, label, desc, icon }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{label}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[key]}
                  onChange={(e) => setNotificationSettings({...notificationSettings, [key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleSaveNotifications}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
        >
          Save Notification Settings
        </button>
      </div>
    </div>
  );

  // Render Preferences Tab Content
  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Palette className="text-purple-500" size={24} />
          App Preferences
        </h3>
        
        <div className="space-y-4" onKeyPress={handleKeyPress}>
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() => setPreferences({...preferences, theme: 'light'})}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                  preferences.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Sun size={20} />
                Light
              </button>
              <button
                onClick={() => setPreferences({...preferences, theme: 'dark'})}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                  preferences.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Moon size={20} />
                Dark
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST - Indian Standard Time)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST - Gulf Standard Time)</option>
              <option value="America/New_York">America/New York (EST - Eastern Time)</option>
              <option value="Europe/London">Europe/London (GMT - Greenwich Mean Time)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST - Japan Standard Time)</option>
              <option value="Australia/Sydney">Australia/Sydney (AEST - Australian Eastern Time)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
          <p className="text-sm text-gray-500">Press Enter to save</p>
        </div>
      </div>
    </div>
  );

  // Render Legal & Support Tab Content
  const renderLegalTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="text-blue-500" size={24} />
          Legal Documents
        </h3>
        
        <div className="space-y-3">
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <span className="font-medium text-gray-800">Terms & Conditions</span>
            <Download size={18} className="text-gray-500" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <span className="font-medium text-gray-800">Privacy Policy</span>
            <Download size={18} className="text-gray-500" />
          </a>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <HelpCircle className="text-green-500" size={24} />
          Help & Support
        </h3>
        
        <div className="space-y-3">
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <span className="font-medium text-gray-800">FAQ / Help Center</span>
          </a>
          <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <span className="font-medium text-gray-800">Contact Support</span>
          </a>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Version: 1.0.0</p>
            <p className="text-sm text-gray-600">© 2025 Global IP Intelligence Platform</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Account Management Tab Content
  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <AlertCircle className="text-yellow-600" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Danger Zone</h3>
            <p className="text-sm text-gray-600">Proceed with caution</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white border-2 border-yellow-300 rounded-xl p-5 hover:shadow-md transition-all">
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Deactivate Account</h4>
            <p className="text-sm text-gray-600 mb-4">Temporarily disable your account. You can reactivate it anytime by logging in.</p>
            <button
              onClick={handleDeactivateAccount}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
            >
              Deactivate Account
            </button>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-5 hover:shadow-md transition-all">
            <h4 className="font-bold text-red-800 mb-2 text-lg">Delete Account</h4>
            <p className="text-sm text-red-700 mb-4 font-medium">
              ⚠️ Permanently delete your account and all associated data. This action cannot be undone!
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="font-bold text-red-700 bg-red-200 p-3 rounded-lg border-2 border-red-400">⚠️ Are you absolutely sure? This cannot be undone!</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-3"></div>
            <p className="text-blue-800">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-10 text-white">
          <button
            onClick={onBack}
            className="mb-6 text-white/80 hover:text-white flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-blue-100 mt-1">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                  activeTab === id 
                    ? 'border-blue-500 text-blue-600 font-semibold' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'subscription' && renderSubscriptionTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'legal' && renderLegalTab()}
          {activeTab === 'account' && renderAccountTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
