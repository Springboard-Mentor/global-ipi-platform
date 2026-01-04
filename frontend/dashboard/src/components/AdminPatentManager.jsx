import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Mail, RefreshCw, AlertCircle, LogIn, LogOut, User, Shield, Eye, EyeOff, X, ArrowLeft, Lightbulb, FileCheck, Upload, CreditCard, MessageCircle, Send, Bell } from 'lucide-react';
import { addUserNotification } from '../utils/notifications';

const AdminPatentManager = ({ onBack }) => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Quick filter state
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'granted', 'non-granted'
  
  // Admin authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAdminId, setLoginAdminId] = useState('');
  const [loginAdminName, setLoginAdminName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [showAdminTable, setShowAdminTable] = useState(false);
  const [allAdmins, setAllAdmins] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Patent details fields for each patent
  const [patentDetails, setPatentDetails] = useState({});
  
  // Track which patents have details section open and form type ('grant' or 'reject')
  const [showDetailsFor, setShowDetailsFor] = useState({});
  const [formType, setFormType] = useState({}); // 'grant' or 'reject'
  
  // Track which patent's full details are being viewed
  const [viewingPatentDetails, setViewingPatentDetails] = useState(null);

  // Admin chat states
  const [showAdminChat, setShowAdminChat] = useState(false);
  const [selectedPatentForChat, setSelectedPatentForChat] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  
  // Filter patents based on quick filter selection
  const getFilteredPatents = () => {
    if (quickFilter === 'granted') {
      return patents.filter(patent => patent.stage5Granted === true);
    } else if (quickFilter === 'non-granted') {
      return patents.filter(patent => patent.stage5Granted !== true);
    }
    return patents;
  };
  
  // Get filtered patents
  const filteredPatents = getFilteredPatents();
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPatents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatents = filteredPatents.slice(startIndex, endIndex);
  
  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [quickFilter, patents.length]);

  useEffect(() => {
    if (isAuthenticated) {
      checkBackendHealth();
    }
  }, [isAuthenticated]);

  // Admin login function
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Frontend validation
    if (!loginAdminId || !loginAdminName || !loginEmail || !loginPassword) {
      setLoginError('All fields are required');
      return;
    }

    if (!/^\d+$/.test(loginAdminId)) {
      setLoginError('Admin ID must be a number');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      setLoginError('Please enter a valid email address');
      return;
    }
    
    try {
      console.log('Attempting login with:', {
        adminId: parseInt(loginAdminId),
        adminName: loginAdminName,
        email: loginEmail,
        password: '***'
      });

      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: parseInt(loginAdminId),
          adminName: loginAdminName,
          email: loginEmail,
          password: loginPassword,
        }),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const adminInfo = await response.json();
        console.log('Login successful:', adminInfo);
        setAdminData(adminInfo);
        setIsAuthenticated(true);
        // Clear form
        setLoginAdminId('');
        setLoginAdminName('');
        setLoginEmail('');
        setLoginPassword('');
      } else {
        const errorText = await response.text();
        console.error('Login failed:', response.status, errorText);
        setLoginError(`Invalid credentials. Server responded: ${response.status}. ${errorText || 'Please verify all fields match your admin record.'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(`Cannot connect to backend at http://localhost:8080. Please ensure backend server is running. Error: ${error.message}`);
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminData(null);
    setPatents([]);
    setShowAdminTable(false);
  };

  // Fetch all admins for display
  const fetchAllAdmins = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/all', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const admins = await response.json();
        setAllAdmins(admins);
        setShowAdminTable(true);
      } else {
        setMessage('❌ Failed to fetch admin users');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setMessage('❌ Error fetching admin users');
    }
  };

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        setBackendStatus('connected');
        fetchAllPatents();
      } else {
        setBackendStatus('error');
        setMessage('❌ Backend is not responding correctly');
      }
    } catch (error) {
      setBackendStatus('error');
      setMessage('❌ Cannot connect to backend at http://localhost:8080. Please restart the backend server.');
      console.error('Backend health check failed:', error);
    }
  };

  const fetchAllPatents = async () => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Fetching from: http://localhost:8080/api/patent-filing/all');
      const response = await fetch('http://localhost:8080/api/patent-filing/all', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        setPatents(data);
        setMessage('');
        console.log('Fetched patents:', data);
        console.log('First patent userId check:', data.length > 0 ? data[0].userId : 'No patents');
      } else {
        const errorText = await response.text();
        setMessage(`❌ Failed to fetch patents: ${response.status} ${response.statusText}`);
        console.error('Response error:', errorText);
      }
    } catch (error) {
      console.error('Fetch error details:', error);
      setMessage(`❌ Error: ${error.message}. Try: 1) Check browser console (F12), 2) Clear cache and hard reload (Ctrl+Shift+R), 3) Verify backend is at http://localhost:8080`);
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (patentId, stageName, value) => {
    setMessage('Updating stage...');
    try {
      // If granting a stage, automatically grant all lower stages
      const stageUpdates = {
        [stageName]: value
      };

      if (value === true) {
        // Cascade granting: if a higher stage is granted, grant all lower stages
        const stageOrder = ['stage1Filed', 'stage2AdminReview', 'stage3TechnicalReview', 'stage4Verification', 'stage5Granted'];
        const currentStageIndex = stageOrder.indexOf(stageName);
        
        // Grant all lower stages
        for (let i = 0; i <= currentStageIndex; i++) {
          stageUpdates[stageOrder[i]] = true;
        }
      }

      console.log('Updating stage with cascade:', patentId, stageUpdates);

      const response = await fetch(`http://localhost:8080/api/patent-filing/${patentId}/stages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stageUpdates),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Update result:', result);
        
        if (result.emailSent) {
          setMessage(`✅ Patent ${patentId} granted! Email sent to applicant.`);
        } else {
          setMessage(`✅ Stage updated for patent ${patentId}`);
        }
        
        // Refresh the list
        await fetchAllPatents();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Failed to update stage for patent ${patentId}: ${response.status}`);
        console.error('Update error:', errorText);
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      setMessage(`❌ Error: ${error.message}. Check if backend is running.`);
    }
  };

  const grantAllStages = async (patent) => {
    // If details section is not open, open it first
    if (!showDetailsFor[patent.id]) {
      setShowDetailsFor({
        ...showDetailsFor,
        [patent.id]: true
      });
      setFormType({
        ...formType,
        [patent.id]: 'grant'
      });
      setMessage('📝 Please fill in the required patent details below before granting the patent.');
      setTimeout(() => {
        setMessage('');
      }, 4000);
      return;
    }
    
    // Validate required fields
    const details = patentDetails[patent.id] || {};
    const missingFields = [];
    
    if (!details.patentNumber || details.patentNumber.trim() === '') {
      missingFields.push('Patent Number');
    }
    if (!details.grantedPersonName || details.grantedPersonName.trim() === '') {
      missingFields.push('Granted Patent Person Name');
    }
    if (!details.location || details.location.trim() === '') {
      missingFields.push('Location');
    }
    
    if (missingFields.length > 0) {
      setMessage(`❌ Cannot grant patent! Please fill in the following required fields: ${missingFields.join(', ')}`);
      // Scroll to the patent details section
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }
    
    setMessage('Granting patent and sending email...');
    try {
      const stageUpdates = {
        stage1Filed: true,
        stage2AdminReview: true,
        stage3TechnicalReview: true,
        stage4Verification: true,
        stage5Granted: true,
        patentNumber: details.patentNumber,
        grantedPatentPersonName: details.grantedPersonName,
        location: details.location
      };

      console.log('Granting all stages for patent:', patent.id);
      console.log('Patent details:', details);

      const response = await fetch(`http://localhost:8080/api/patent-filing/${patent.id}/stages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stageUpdates),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Grant result:', result);
        console.log('Patent object:', patent);
        console.log('Patent userId:', patent.userId);
        console.log('Patent details:', details);
        
        // Extract userId - try multiple possible field names
        const userId = patent.userId || patent.user_id || patent.UserId;
        console.log('Extracted userId:', userId);
        
        // Add Firestore notification for the user
        if (userId) {
          try {
            console.log('🔔 Attempting to add notification for userId:', userId);
            const notificationResult = await addUserNotification(userId, {
              title: "🎉 Patent Granted!",
              message: `Congratulations! Your patent "${patent.inventionTitle}" has been granted.`,
              details: {
                patentNumber: details.patentNumber,
                grantedTo: details.grantedPersonName,
                location: details.location,
                status: 'Granted',
                filingId: patent.id
              }
            });
            console.log('✅ Firestore notification added for patent grant:', notificationResult);
          } catch (notifError) {
            console.error('❌ Failed to add Firestore notification:', notifError);
            console.error('Error details:', notifError.message, notifError.stack);
          }
        } else {
          console.warn('⚠️ No userId found in patent object - cannot send notification');
          console.log('Available patent fields:', Object.keys(patent));
          console.log('Full patent object:', JSON.stringify(patent, null, 2));
        }
        
        // Hide the patent details form
        setShowDetailsFor({
          ...showDetailsFor,
          [patent.id]: false
        });
        
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (result.emailSent) {
          setMessage(`🎉 Patent "${patent.inventionTitle}" GRANTED! Email sent to ${patent.applicantEmail}`);
        } else if (result.allStagesComplete) {
          setMessage(`✅ Patent "${patent.inventionTitle}" granted (email may have been sent previously)`);
        } else {
          setMessage(`✅ Patent "${patent.inventionTitle}" updated`);
        }
        
        // Refresh the list
        await fetchAllPatents();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Failed to grant patent ${patent.id}: ${response.status}`);
        console.error('Grant error:', errorText);
      }
    } catch (error) {
      console.error('Error granting patent:', error);
      setMessage(`❌ Error: ${error.message}. Check if backend is running.`);
    }
  };

  const rejectPatent = async (patent) => {
    // If details section is not open, open it first
    if (!showDetailsFor[patent.id]) {
      setShowDetailsFor({
        ...showDetailsFor,
        [patent.id]: true
      });
      setFormType({
        ...formType,
        [patent.id]: 'reject'
      });
      setMessage('📝 Please fill in the required rejection details below before rejecting the patent.');
      setTimeout(() => {
        setMessage('');
      }, 4000);
      return;
    }
    
    // Validate required fields for rejection
    const details = patentDetails[patent.id] || {};
    const missingFields = [];
    
    if (!details.rejectedPatentNumber || details.rejectedPatentNumber.trim() === '') {
      missingFields.push('Rejected Patent Number');
    }
    if (!details.rejectedPersonName || details.rejectedPersonName.trim() === '') {
      missingFields.push('Rejected Patent Person Name');
    }
    if (!details.location || details.location.trim() === '') {
      missingFields.push('Location');
    }
    
    if (missingFields.length > 0) {
      setMessage(`❌ Cannot reject patent! Please fill in the following required fields: ${missingFields.join(', ')}`);
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }
    
    setMessage('Rejecting patent and sending email...');
    try {
      const response = await fetch(`http://localhost:8080/api/patent-filing/${patent.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectedPatentNumber: details.rejectedPatentNumber,
          rejectedPersonName: details.rejectedPersonName,
          location: details.location,
          status: 'Patent is Rejected',
          applicantEmail: patent.applicantEmail,
          inventionTitle: patent.inventionTitle
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Rejection result:', result);
        console.log('Patent object:', patent);
        console.log('Patent userId:', patent.userId);
        console.log('Rejection details:', details);
        
        // Extract userId - try multiple possible field names
        const userId = patent.userId || patent.user_id || patent.UserId;
        console.log('Extracted userId:', userId);
        
        // Add Firestore notification for the user
        if (userId) {
          try {
            console.log('🔔 Attempting to add rejection notification for userId:', userId);
            const notificationResult = await addUserNotification(userId, {
              title: "❌ Patent Rejected",
              message: `Your patent application "${patent.inventionTitle}" has been rejected.`,
              details: {
                rejectedPatentNumber: details.rejectedPatentNumber,
                rejectedBy: details.rejectedPersonName,
                location: details.location,
                status: 'Rejected',
                filingId: patent.id
              }
            });
            console.log('✅ Firestore notification added for patent rejection:', notificationResult);
          } catch (notifError) {
            console.error('❌ Failed to add Firestore notification:', notifError);
            console.error('Error details:', notifError.message, notifError.stack);
          }
        } else {
          console.warn('⚠️ No userId found in patent object - cannot send notification');
          console.log('Available patent fields:', Object.keys(patent));
          console.log('Full patent object:', JSON.stringify(patent, null, 2));
        }
        
        // Hide the patent details form
        setShowDetailsFor({
          ...showDetailsFor,
          [patent.id]: false
        });
        
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (result.emailSent) {
          setMessage(`❌ Patent "${patent.inventionTitle}" REJECTED! Email sent to ${patent.applicantEmail}`);
        } else {
          setMessage(`❌ Patent "${patent.inventionTitle}" rejected`);
        }
        
        // Refresh the list
        await fetchAllPatents();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Failed to reject patent ${patent.id}: ${response.status}`);
        console.error('Rejection error:', errorText);
      }
    } catch (error) {
      console.error('Error rejecting patent:', error);
      setMessage(`❌ Error: ${error.message}. Check if backend is running.`);
    }
  };

  const resetStages = async (patentId) => {
    setMessage('Resetting stages...');
    try {
      const stageUpdates = {
        stage1Filed: true,
        stage2AdminReview: false,
        stage3TechnicalReview: false,
        stage4Verification: false,
        stage5Granted: false
      };

      const response = await fetch(`http://localhost:8080/api/patent-filing/${patentId}/stages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stageUpdates),
      });

      if (response.ok) {
        setMessage(`🔄 Reset stages for patent ${patentId}`);
        await fetchAllPatents();
      } else {
        const errorText = await response.text();
        setMessage(`❌ Failed to reset stages: ${response.status}`);
        console.error('Reset error:', errorText);
      }
    } catch (error) {
      console.error('Error resetting stages:', error);
      setMessage(`❌ Error: ${error.message}. Check if backend is running.`);
    }
  };

  // Admin Chat Functions
  const openAdminChat = (patent) => {
    console.log('Opening admin chat for patent:', patent);
    setSelectedPatentForChat(patent);
    setShowAdminChat(true);
    setAdminReply('');
  };

  const closeAdminChat = () => {
    setShowAdminChat(false);
    setSelectedPatentForChat(null);
    setAdminReply('');
  };

  const getReplyCount = (patent) => {
    if (!patent) return 0;
    let count = 0;
    ['r1', 'r2', 'r3', 'r4'].forEach(field => {
      if (patent[field] && patent[field].trim() !== '') {
        count++;
      }
    });
    return count;
  };

  const sendAdminReply = async () => {
    if (!adminReply.trim() || !selectedPatentForChat) {
      return;
    }

    const replyCount = getReplyCount(selectedPatentForChat);
    if (replyCount >= 4) {
      alert('Maximum 4 replies already sent for this patent!');
      return;
    }

    try {
      const replyField = `r${replyCount + 1}`;
      console.log(`Sending admin reply to ${replyField}:`, adminReply);

      const response = await fetch(`http://localhost:8080/api/patent-filing/${selectedPatentForChat.id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replyField: replyField,
          replyContent: adminReply.trim()
        }),
      });

      if (response.ok) {
        const updatedPatent = await response.json();
        console.log('Reply saved successfully:', updatedPatent);
        
        // Update patents list
        setPatents(patents.map(p => p.id === updatedPatent.id ? updatedPatent : p));
        setSelectedPatentForChat(updatedPatent);
        setAdminReply('');
        setMessage('✅ Reply sent successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        console.error('Failed to send reply:', response.status);
        alert('Failed to send reply. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please check your connection.');
    }
  };

  // Count unread user messages (messages without admin replies)
  const getUnreadMessagesCount = (patent) => {
    if (!patent) return 0;
    let unreadCount = 0;
    
    for (let i = 1; i <= 5; i++) {
      const userMsg = patent[`m${i}`];
      const adminReply = patent[`r${i}`];
      
      // If user sent a message but admin hasn't replied yet
      if (userMsg && userMsg.trim() !== '' && (!adminReply || adminReply.trim() === '')) {
        unreadCount++;
      }
    }
    
    return unreadCount;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {!isAuthenticated ? (
        // Admin Login Full Page Form
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Branding & Info */}
            <div className="hidden md:block space-y-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Admin Portal
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Secure Access to Patent Management System
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Manage patent applications</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Review and approve filings</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Track application stages</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Send automated notifications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full">
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 1px rgba(31, 38, 135, 0.1)',
              }}>
                {/* Top Strip with Back to Dashboard Button */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 flex items-center justify-between border-b border-blue-700">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">Admin Login</span>
                  </div>
                  <button
                    type="button"
                    onClick={onBack || (() => window.history.back())}
                    className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm border border-white/30 text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </button>
                </div>

                <div className="p-8 md:p-10">
                  <div className="md:hidden flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-center text-gray-700 mb-8 font-medium">
                  Sign in to access the admin dashboard
                </p>
                
                {loginError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Login Failed</p>
                      <p className="text-sm">{loginError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Admin ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginAdminId}
                        onChange={(e) => setLoginAdminId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-500 shadow-sm"
                        placeholder="Enter your admin ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Admin Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginAdminName}
                        onChange={(e) => setLoginAdminName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-500 shadow-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-500 shadow-sm"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium placeholder:text-gray-500 shadow-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-blue-700"
                  >
                    <LogIn className="w-5 h-5" />
                    Login to Admin Panel
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-700 font-medium">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Secure admin access • All activities are logged
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Admin Panel Content (after login)
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Patent Manager</h1>
                {adminData && (
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Logged in as: <strong>{adminData.adminName}</strong> ({adminData.email})</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchAllAdmins}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <User className="w-4 h-4" />
                  {showAdminTable ? 'Hide' : 'View'} Admin Users
                </button>
                <button
                  onClick={fetchAllPatents}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Patents
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.includes('❌') ? 'bg-red-100 text-red-800' : 
                message.includes('🎉') ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {message}
                </div>
              </div>
            )}

            <p className="text-gray-600 mt-4">
              Manage patent filing stages. When all 5 stages are complete, an email will be automatically sent to the applicant.
            </p>
          </div>

          {/* Admin Users Table */}
          {showAdminTable && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Admin Users</h2>
                <button
                  onClick={() => setShowAdminTable(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕ Close
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Admin ID</th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Admin Name</th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAdmins.map((admin) => (
                      <tr key={admin.adminId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono">#{admin.adminId}</td>
                        <td className="px-4 py-3 font-semibold">{admin.adminName}</td>
                        <td className="px-4 py-3 text-blue-600">{admin.email}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allAdmins.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    No admin users found in the database.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Filter and Stats Section */}
          {!loading && patents.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md p-6 mb-6 border-2 border-indigo-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-200">
                    <span className="text-sm text-gray-600">Total Patents:</span>
                    <span className="ml-2 text-lg font-bold text-indigo-600">{patents.length}</span>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg shadow-sm border border-green-300">
                    <span className="text-sm text-gray-600">Granted:</span>
                    <span className="ml-2 text-lg font-bold text-green-600">
                      {patents.filter(p => p.stage5Granted === true).length}
                    </span>
                  </div>
                  <div className="bg-orange-50 px-4 py-2 rounded-lg shadow-sm border border-orange-300">
                    <span className="text-sm text-gray-600">Pending:</span>
                    <span className="ml-2 text-lg font-bold text-orange-600">
                      {patents.filter(p => p.stage5Granted !== true).length}
                    </span>
                  </div>
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 mr-2">Quick Filter:</span>
                  <button
                    onClick={() => setQuickFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      quickFilter === 'all'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-500 hover:text-indigo-600'
                    }`}
                  >
                    All Patents
                  </button>
                  <button
                    onClick={() => setQuickFilter('granted')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      quickFilter === 'granted'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500 hover:text-green-600'
                    }`}
                  >
                    ✓ Granted Only
                  </button>
                  <button
                    onClick={() => setQuickFilter('non-granted')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      quickFilter === 'non-granted'
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    ⏳ Non-Granted Only
                  </button>
                </div>
              </div>
              
              {/* Filter Results Info */}
              {quickFilter !== 'all' && (
                <div className="mt-3 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg inline-block">
                  Showing {filteredPatents.length} of {patents.length} patents
                </div>
              )}
            </div>
          )}

          {/* Patent Management Section */}
          {loading && patents.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading patents...</p>
            </div>
          ) : filteredPatents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg">
                {quickFilter === 'granted' 
                  ? 'No granted patents found.' 
                  : quickFilter === 'non-granted' 
                  ? 'No non-granted patents found.' 
                  : 'No patents found in the system.'}
              </p>
            </div>
          ) : (
            <>
            <div className="space-y-6">
              {currentPatents.map((patent) => (
                <div key={patent.id} className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-2xl p-8 border-2 border-indigo-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-indigo-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {patent.inventionTitle || 'Untitled Patent'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                          <span className="text-gray-600 block mb-1 font-semibold">Applicant:</span>
                          <span className="font-bold text-gray-900">{patent.applicantName}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                          <span className="text-gray-600 block mb-1 font-semibold">Email:</span>
                          <span className="font-bold text-blue-600">{patent.applicantEmail}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                          <span className="text-gray-600 block mb-1 font-semibold">Filing ID:</span>
                          <span className="font-mono font-bold text-gray-900">#{patent.id}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                          <span className="text-gray-600 block mb-1 font-semibold">Status:</span>
                          <span className={`font-bold px-3 py-1 rounded-full inline-block ${
                            patent.status === 'Granted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {patent.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Patent Details Fields - Only shown when details are being filled */}
                  {showDetailsFor[patent.id] && (
                    <div className={`mb-6 p-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border-2 ${formType[patent.id] === 'reject' ? 'border-red-300' : 'border-indigo-300'} animate-fadeIn`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                          <Shield className={`w-5 h-5 ${formType[patent.id] === 'reject' ? 'text-red-600' : 'text-indigo-600'}`} />
                          {formType[patent.id] === 'reject' ? 'Rejection Details' : 'Patent Details'} 
                          <span className="text-sm text-red-600">
                            (Required for {formType[patent.id] === 'reject' ? 'rejecting' : 'granting'} patent)
                          </span>
                        </h4>
                        <button
                          onClick={() => {
                            setShowDetailsFor({
                              ...showDetailsFor,
                              [patent.id]: false
                            });
                            setFormType({
                              ...formType,
                              [patent.id]: null
                            });
                          }}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formType[patent.id] === 'grant' && (
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Patent Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={patentDetails[patent.id]?.patentNumber || ''}
                              onChange={(e) => setPatentDetails({
                                ...patentDetails,
                                [patent.id]: { ...patentDetails[patent.id], patentNumber: e.target.value }
                              })}
                              placeholder="Enter patent number"
                              className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm"
                            />
                          </div>
                        )}
                        
                        {formType[patent.id] === 'reject' && (
                          <>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Rejected Patent Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={patentDetails[patent.id]?.rejectedPatentNumber || ''}
                                onChange={(e) => setPatentDetails({
                                  ...patentDetails,
                                  [patent.id]: { ...patentDetails[patent.id], rejectedPatentNumber: e.target.value }
                                })}
                                placeholder="Enter rejected patent number"
                                className="w-full px-4 py-2.5 bg-white border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">
                                Rejected Patent Person Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={patentDetails[patent.id]?.rejectedPersonName || ''}
                                onChange={(e) => setPatentDetails({
                                  ...patentDetails,
                                  [patent.id]: { ...patentDetails[patent.id], rejectedPersonName: e.target.value }
                                })}
                                placeholder="Enter person name"
                                className="w-full px-4 py-2.5 bg-white border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm"
                              />
                            </div>
                          </>
                        )}
                        
                        {formType[patent.id] === 'grant' && (
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Granted Patent Person Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={patentDetails[patent.id]?.grantedPersonName || ''}
                              onChange={(e) => setPatentDetails({
                                ...patentDetails,
                                [patent.id]: { ...patentDetails[patent.id], grantedPersonName: e.target.value }
                              })}
                              placeholder="Enter person name"
                              className="w-full px-4 py-2.5 bg-white border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm"
                            />
                          </div>
                        )}
                        
                        <div className={formType[patent.id] === 'grant' ? 'md:col-span-2' : ''}>                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={patentDetails[patent.id]?.location || ''}
                            onChange={(e) => setPatentDetails({
                              ...patentDetails,
                              [patent.id]: { ...patentDetails[patent.id], location: e.target.value }
                            })}
                            placeholder={`Enter location where patent was ${formType[patent.id] === 'reject' ? 'rejected' : 'granted'}`}
                            className="w-full px-4 py-2.5 bg-white border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stages */}
                  <div className="border-t-2 border-indigo-200 pt-6 mb-6">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Patent Stages:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
                      {[
                        { key: 'stage1Filed', label: '1. Filed', name: 'stage1Filed' },
                        { key: 'stage2AdminReview', label: '2. Admin Review', name: 'stage2AdminReview' },
                        { key: 'stage3TechnicalReview', label: '3. Technical', name: 'stage3TechnicalReview' },
                        { key: 'stage4Verification', label: '4. Verification', name: 'stage4Verification' },
                      ].map((stage) => (
                        <button
                          key={stage.key}
                          onClick={() => !patent.stage5Granted && patent.status !== 'Patent is Rejected' && updateStage(patent.id, stage.name, !patent[stage.key])}
                          disabled={patent.stage5Granted || patent.status === 'Patent is Rejected'}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all transform shadow-md ${
                            patent.stage5Granted || patent.status === 'Patent is Rejected'
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500 text-green-800 shadow-green-200 cursor-not-allowed opacity-75'
                              : patent[stage.key]
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500 text-green-800 shadow-green-200 hover:scale-105'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:scale-105'
                          }`}
                        >
                          {patent[stage.key] ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm font-bold whitespace-nowrap">{stage.label}</span>
                        </button>
                      ))}
                      
                      {/* Stage 5: Grant & Send Email Button */}
                      {patent.status !== 'Patent is Rejected' && (
                        <button
                          onClick={() => grantAllStages(patent)}
                          disabled={patent.stage5Granted}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 transform shadow-2xl font-bold ${
                            patent.stage5Granted
                              ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500 text-green-800 shadow-green-300 cursor-not-allowed opacity-75'
                              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white border-emerald-400 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 hover:scale-110 hover:shadow-emerald-400/50 active:scale-95 animate-pulse-slow'
                          }`}
                          style={!patent.stage5Granted ? {
                            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.3)',
                          } : {}}
                        >
                          {patent.stage5Granted ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-bold whitespace-nowrap">5. Granted</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5 animate-bounce" />
                              <span className="text-sm font-extrabold tracking-wide whitespace-nowrap">5. Grant & Send Email</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {/* Show Rejected Status */}
                      {patent.status === 'Patent is Rejected' && (
                        <div className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 bg-gradient-to-br from-red-50 to-rose-100 border-red-500 text-red-800 shadow-red-300">
                          <X className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-bold whitespace-nowrap">Patent is Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`grid grid-cols-1 ${patent.stage5Granted ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3 pt-6 border-t-2 border-indigo-200`}>
                    <button
                      onClick={() => setViewingPatentDetails(patent)}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                    
                    {!patent.stage5Granted && patent.status !== 'Patent is Rejected' && (
                      <button
                        onClick={() => rejectPatent(patent)}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                      >
                        <X className="w-5 h-5" />
                        Reject Patent
                      </button>
                    )}
                    
                    <button
                      onClick={() => resetStages(patent.id)}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl hover:from-gray-500 hover:to-gray-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Reset Stages
                    </button>
                    
                    <button
                      onClick={() => openAdminChat(patent)}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative"
                    >
                      <MessageCircle className="w-5 h-5" />
                      View Chat
                      {getUnreadMessagesCount(patent) > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                          {getUnreadMessagesCount(patent)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredPatents.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-4 pb-6">
                {/* Pagination Buttons */}
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:shadow-md disabled:hover:bg-white"
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => {
                              setCurrentPage(pageNumber);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg scale-110'
                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      // Show ellipsis
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="text-gray-400 font-bold">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:shadow-md disabled:hover:bg-white"
                  >
                    Next →
                  </button>
                </div>

                {/* Results Info */}
                <div className="text-center text-sm text-gray-600 bg-white px-6 py-2 rounded-lg shadow-sm border border-gray-200">
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredPatents.length)} of {filteredPatents.length} patent{filteredPatents.length !== 1 ? 's' : ''}
                  {quickFilter !== 'all' && (
                    <span className="ml-2 text-indigo-600 font-semibold">
                      ({quickFilter === 'granted' ? 'Granted' : 'Non-Granted'})
                    </span>
                  )}
                </div>
              </div>
            )}
            </>
          )}
        </div>
      )}
      
      {/* Patent Details Modal */}
      {viewingPatentDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingPatentDetails(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header - Fixed */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-t-2xl flex items-center justify-between flex-shrink-0 z-10">
              <div>
                <h2 className="text-lg font-bold mb-1">Patent Full Details</h2>
                <p className="text-indigo-100 text-sm">Filing ID: #{viewingPatentDetails.id}</p>
              </div>
              <button
                onClick={() => setViewingPatentDetails(null)}
                className="text-white hover:text-red-300 hover:rotate-90 transition-all duration-300 transform hover:scale-110"
                aria-label="Close"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Step 1: Applicant Information */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border-2 border-cyan-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <User className="w-6 h-6 text-cyan-600" />
                  Step 1: Applicant Information
                </h3>
                
                {/* Basic Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Applicant Type</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email Address</label>
                    <p className="text-blue-600 font-bold mt-1 break-all">{viewingPatentDetails.applicantEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantPhone || viewingPatentDetails.phoneNumber || 'N/A'}</p>
                  </div>
                  {viewingPatentDetails.organizationName && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Organization Name</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.organizationName}</p>
                    </div>
                  )}
                </div>
                
                {/* Personal Details */}
                {viewingPatentDetails.applicantType === 'individual' && (
                  <div className="border-t-2 border-cyan-300 pt-4 mt-4">
                    <h4 className="text-md font-bold text-gray-800 mb-3">Personal Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.dateOfBirth ? new Date(viewingPatentDetails.dateOfBirth).toLocaleDateString() : 'Not Provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Age</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.age || 'Not Provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Gender</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.gender || 'Not Provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Occupation/Profession</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.occupation || 'Not Provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Educational Qualification</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.educationalQualification || 'Not Provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Designation/Position</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.designation || 'Not Provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Address Information */}
                <div className="border-t-2 border-cyan-300 pt-4 mt-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-600">Address</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantAddress || viewingPatentDetails.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">City</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantCity || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">State</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantState || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Pincode</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantPincode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Country</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicantCountry || viewingPatentDetails.nationality || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Contact Information */}
                <div className="border-t-2 border-cyan-300 pt-4 mt-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Additional Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Alternate Phone Number</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.alternatePhone || 'Not Provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Alternate Email Address</label>
                      <p className="text-blue-600 font-bold mt-1 break-all">{viewingPatentDetails.alternateEmail || 'Not Provided'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Identity & Tax Information */}
                <div className="border-t-2 border-cyan-300 pt-4 mt-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Identity & Tax Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Government ID Type *</label>
                      <p className="text-gray-900 font-bold mt-1 capitalize">{viewingPatentDetails.govtIdType || 'Not Provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Government ID Number *</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.govtIdNumber || 'Not Provided'}</p>
                    </div>
                    {viewingPatentDetails.govtIdType === 'passport' && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Passport Country</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.passportCountry || 'Not Provided'}</p>
                      </div>
                    )}
                    {viewingPatentDetails.govtIdType === 'drivingLicense' && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Driving License State</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.drivingLicenseState || 'Not Provided'}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Aadhaar Number</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.aadhaarNumber || 'Not Provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">PAN Number</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.panNumber || 'Not Provided'}</p>
                    </div>
                    {viewingPatentDetails.applicantType === 'organization' && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">GSTIN</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.gstin || 'Not Provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Correspondence Address */}
                <div className="border-t-2 border-cyan-300 pt-4 mt-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Correspondence Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-600">Same as Applicant Address</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.sameAsApplicantAddress ? '✓ Yes' : '✗ No'}</p>
                    </div>
                    {!viewingPatentDetails.sameAsApplicantAddress && (
                      <>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-600">Correspondence Address</label>
                          <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.correspondenceAddress || 'Not Provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">City</label>
                          <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.correspondenceCity || 'Not Provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">State</label>
                          <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.correspondenceState || 'Not Provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Pincode</label>
                          <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.correspondencePincode || 'Not Provided'}</p>
                        </div>
                      </>
                    )}
                    {viewingPatentDetails.sameAsApplicantAddress && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600 italic bg-blue-50 p-3 rounded-lg">ℹ️ Using the same address as applicant address</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Application Date */}
                <div className="border-t-2 border-cyan-300 pt-4 mt-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-600">Application Submission Date *</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicationDate ? new Date(viewingPatentDetails.applicationDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not Available'}</p>
                  </div>
                </div>
              </div>
              
              
              {/* Step 2: Invention Details */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  Step 2: Invention Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Invention Title *</label>
                    <p className="text-gray-900 font-bold mt-1 text-lg">{viewingPatentDetails.inventionTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Field of Invention *</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.inventionField || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Target Industry</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.targetIndustry || 'Not Provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Detailed Description of Invention *</label>
                    <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap leading-relaxed">{viewingPatentDetails.inventionDescription || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Keywords</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.keywords || 'Not Provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Technical Problem Addressed *</label>
                    <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap">{viewingPatentDetails.technicalProblem || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Proposed Solution *</label>
                    <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap">{viewingPatentDetails.proposedSolution || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Advantages *</label>
                    <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap">{viewingPatentDetails.advantages || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Prior Art</label>
                    <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap">{viewingPatentDetails.priorArt || 'Not Provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Commercial Application</label>
                    <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap">{viewingPatentDetails.commercialApplication || 'Not Provided'}</p>
                  </div>
                </div>
              </div>
              
              {/* Step 3: Patent Details */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-green-600" />
                  Step 3: Patent Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Patent Type *</label>
                    <p className="text-gray-900 font-bold mt-1 capitalize">{viewingPatentDetails.patentType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Filing Type *</label>
                    <p className="text-gray-900 font-bold mt-1 capitalize">{viewingPatentDetails.filingType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Number of Claims *</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.numberOfClaims || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Number of Drawings</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.numberOfDrawings !== null && viewingPatentDetails.numberOfDrawings !== undefined ? viewingPatentDetails.numberOfDrawings : 'Not Provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Claims Priority</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.claimsPriority ? '✓ Yes' : '✗ No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Priority Date</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.priorityDate ? new Date(viewingPatentDetails.priorityDate).toLocaleDateString() : 'Not Applicable'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Priority Number</label>
                    <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.priorityNumber || 'Not Applicable'}</p>
                  </div>
                </div>
              </div>
              
              {/* Step 4: Documents Upload */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-orange-600" />
                  Step 4: Documents Upload
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Description Document *</label>
                    {viewingPatentDetails.descriptionFileUrl ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-orange-200">
                        <p className="text-blue-600 font-medium flex-1 break-all text-sm">
                          {viewingPatentDetails.descriptionFileUrl}
                        </p>
                        <a 
                          href={viewingPatentDetails.descriptionFileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic bg-gray-100 p-3 rounded-lg">No file provided</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Claims Document *</label>
                    {viewingPatentDetails.claimsFileUrl ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-orange-200">
                        <p className="text-blue-600 font-medium flex-1 break-all text-sm">
                          {viewingPatentDetails.claimsFileUrl}
                        </p>
                        <a 
                          href={viewingPatentDetails.claimsFileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic bg-gray-100 p-3 rounded-lg">No file provided</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Abstract Document *</label>
                    {viewingPatentDetails.abstractFileUrl ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-orange-200">
                        <p className="text-blue-600 font-medium flex-1 break-all text-sm">
                          {viewingPatentDetails.abstractFileUrl}
                        </p>
                        <a 
                          href={viewingPatentDetails.abstractFileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic bg-gray-100 p-3 rounded-lg">No file provided</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Drawings Document</label>
                    {viewingPatentDetails.drawingsFileUrl ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-orange-200">
                        <p className="text-blue-600 font-medium flex-1 break-all text-sm">
                          {viewingPatentDetails.drawingsFileUrl}
                        </p>
                        <a 
                          href={viewingPatentDetails.drawingsFileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic bg-gray-100 p-3 rounded-lg">Not Provided</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Step 5: Review & Payment */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  Step 5: Review & Payment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {viewingPatentDetails.paymentAmount && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Payment Amount</label>
                      <p className="text-gray-900 font-bold mt-1">
                        {viewingPatentDetails.paymentCurrency || 'INR'} {viewingPatentDetails.paymentAmount}
                      </p>
                    </div>
                  )}
                  {viewingPatentDetails.agreedToTerms !== undefined && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Agreed to Terms</label>
                      <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.agreedToTerms ? '✓ Yes' : '✗ No'}</p>
                    </div>
                  )}
                </div>
                
                {/* Payment Transaction Details */}
                {(viewingPatentDetails.paymentId || viewingPatentDetails.paymentOrderId || viewingPatentDetails.paymentStatus) && (
                  <div className="border-t-2 border-indigo-300 pt-4 mt-4">
                    <h4 className="text-md font-bold text-gray-800 mb-3">Payment Transaction Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingPatentDetails.paymentId && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Payment ID</label>
                          <p className="text-gray-900 font-bold mt-1 break-all">{viewingPatentDetails.paymentId}</p>
                        </div>
                      )}
                      {viewingPatentDetails.paymentOrderId && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Payment Order ID</label>
                          <p className="text-gray-900 font-bold mt-1 break-all">{viewingPatentDetails.paymentOrderId}</p>
                        </div>
                      )}
                      {viewingPatentDetails.paymentStatus && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Payment Status</label>
                          <p className={`font-bold mt-1 inline-block px-3 py-1 rounded-full ${
                            viewingPatentDetails.paymentStatus === 'completed' || viewingPatentDetails.paymentStatus === 'success' 
                              ? 'bg-green-100 text-green-700' 
                              : viewingPatentDetails.paymentStatus === 'pending' 
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {viewingPatentDetails.paymentStatus}
                          </p>
                        </div>
                      )}
                      {viewingPatentDetails.paymentTimestamp && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Payment Timestamp</label>
                          <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.paymentTimestamp).toLocaleString()}</p>
                        </div>
                      )}
                      {viewingPatentDetails.paymentSignature && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-600">Payment Signature</label>
                          <p className="text-gray-900 font-mono text-xs mt-1 break-all bg-gray-100 p-2 rounded">{viewingPatentDetails.paymentSignature}</p>
                        </div>
                      )}
                      {viewingPatentDetails.paymentCurrency && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Payment Currency</label>
                          <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.paymentCurrency}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Account Information */}
              {(viewingPatentDetails.userId || viewingPatentDetails.userEmail || viewingPatentDetails.userName) && (
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <User className="w-6 h-6 text-teal-600" />
                    User Account Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingPatentDetails.userId && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">User ID</label>
                        <p className="text-gray-900 font-bold mt-1 break-all">{viewingPatentDetails.userId}</p>
                      </div>
                    )}
                    {viewingPatentDetails.userEmail && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">User Email</label>
                        <p className="text-blue-600 font-bold mt-1 break-all">{viewingPatentDetails.userEmail}</p>
                      </div>
                    )}
                    {viewingPatentDetails.userName && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">User Name</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.userName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              
              {/* Admin Processing Information */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5 border-2 border-rose-200">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-rose-600" />
                  Admin Processing Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Filing ID</label>
                    <p className="text-gray-900 font-bold mt-1">#{viewingPatentDetails.id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Current Status</label>
                    <p className={`font-bold mt-1 inline-block px-3 py-1 rounded-full ${
                      viewingPatentDetails.status === 'Granted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {viewingPatentDetails.status || 'Under Review'}
                    </p>
                  </div>
                </div>
                
                {/* Stage Progress */}
                <div className="border-t-2 border-rose-300 pt-4 mt-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Stage Progress</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className={`p-3 rounded-lg text-center ${viewingPatentDetails.stage1Filed ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <p className="text-xs font-semibold text-gray-600">Stage 1</p>
                      <p className="text-sm font-bold mt-1">Filed</p>
                      <p className="text-lg mt-1">{viewingPatentDetails.stage1Filed ? '✓' : '○'}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${viewingPatentDetails.stage2AdminReview ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <p className="text-xs font-semibold text-gray-600">Stage 2</p>
                      <p className="text-sm font-bold mt-1">Admin Review</p>
                      <p className="text-lg mt-1">{viewingPatentDetails.stage2AdminReview ? '✓' : '○'}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${viewingPatentDetails.stage3TechnicalReview ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <p className="text-xs font-semibold text-gray-600">Stage 3</p>
                      <p className="text-sm font-bold mt-1">Technical Review</p>
                      <p className="text-lg mt-1">{viewingPatentDetails.stage3TechnicalReview ? '✓' : '○'}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${viewingPatentDetails.stage4Verification ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <p className="text-xs font-semibold text-gray-600">Stage 4</p>
                      <p className="text-sm font-bold mt-1">Verification</p>
                      <p className="text-lg mt-1">{viewingPatentDetails.stage4Verification ? '✓' : '○'}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${viewingPatentDetails.stage5Granted ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      <p className="text-xs font-semibold text-gray-600">Stage 5</p>
                      <p className="text-sm font-bold mt-1">Granted</p>
                      <p className="text-lg mt-1">{viewingPatentDetails.stage5Granted ? '✓' : '○'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Patent Registration Details (filled by admin during grant) */}
                {patentDetails[viewingPatentDetails.id] && (
                  <div className="border-t-2 border-rose-300 pt-4 mt-4">
                    <h4 className="text-md font-bold text-gray-800 mb-3">Patent Registration Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patentDetails[viewingPatentDetails.id]?.patentNumber && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Patent Number</label>
                          <p className="text-gray-900 font-bold mt-1">{patentDetails[viewingPatentDetails.id].patentNumber}</p>
                        </div>
                      )}
                      {patentDetails[viewingPatentDetails.id]?.grantedPersonName && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Granted to Person Name</label>
                          <p className="text-gray-900 font-bold mt-1">{patentDetails[viewingPatentDetails.id].grantedPersonName}</p>
                        </div>
                      )}
                      {patentDetails[viewingPatentDetails.id]?.location && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Grant/Reject Location</label>
                          <p className="text-gray-900 font-bold mt-1">{patentDetails[viewingPatentDetails.id].location}</p>
                        </div>
                      )}
                      {patentDetails[viewingPatentDetails.id]?.rejectedPatentNumber && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Rejected Patent Number</label>
                          <p className="text-gray-900 font-bold mt-1">{patentDetails[viewingPatentDetails.id].rejectedPatentNumber}</p>
                        </div>
                      )}
                      {patentDetails[viewingPatentDetails.id]?.rejectedPersonName && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Rejected Person Name</label>
                          <p className="text-gray-900 font-bold mt-1">{patentDetails[viewingPatentDetails.id].rejectedPersonName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Dates & Timestamps */}
                <div className="border-t-2 border-rose-300 pt-4 mt-4">
                  <h4 className="text-md font-bold text-gray-800 mb-3">Dates & Timestamps</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingPatentDetails.filingDate && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Filing Date</label>
                        <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.filingDate).toLocaleString()}</p>
                      </div>
                    )}
                    {viewingPatentDetails.submittedAt && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Submitted At</label>
                        <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.submittedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {viewingPatentDetails.createdAt && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Created At</label>
                        <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.createdAt).toLocaleString()}</p>
                      </div>
                    )}
                    {viewingPatentDetails.updatedAt && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Last Updated</label>
                        <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.updatedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {viewingPatentDetails.grantedDate && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Granted Date</label>
                        <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.grantedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {viewingPatentDetails.expiryDate && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Expiry Date</label>
                        <p className="text-gray-900 font-bold mt-1">{new Date(viewingPatentDetails.expiryDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {viewingPatentDetails.applicationNumber && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Application Number</label>
                        <p className="text-gray-900 font-bold mt-1">{viewingPatentDetails.applicationNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Filing Status Information */}
                {viewingPatentDetails.filingStatus && (
                  <div className="border-t-2 border-rose-300 pt-4 mt-4">
                    <h4 className="text-md font-bold text-gray-800 mb-3">Filing Status Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Filing Status</label>
                        <p className={`font-bold mt-1 inline-block px-3 py-1 rounded-full ${
                          viewingPatentDetails.filingStatus === 'approved' || viewingPatentDetails.filingStatus === 'completed'
                            ? 'bg-green-100 text-green-700' 
                            : viewingPatentDetails.filingStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : viewingPatentDetails.filingStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {viewingPatentDetails.filingStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Admin Notes */}
                {(viewingPatentDetails.notes || viewingPatentDetails.adminNotes) && (
                  <div className="border-t-2 border-rose-300 pt-4 mt-4">
                    <h4 className="text-md font-bold text-gray-800 mb-3">Notes & Comments</h4>
                    <div className="space-y-4">
                      {viewingPatentDetails.notes && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">General Notes</label>
                          <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{viewingPatentDetails.notes}</p>
                        </div>
                      )}
                      {viewingPatentDetails.adminNotes && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Admin Notes</label>
                          <p className="text-gray-900 font-bold mt-1 whitespace-pre-wrap bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">{viewingPatentDetails.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Admin Chat Modal */}
      {showAdminChat && selectedPatentForChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeAdminChat}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideIn" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">Admin Chat</h3>
                <p className="text-purple-100 text-sm">Patent: {selectedPatentForChat.inventionTitle}</p>
                <p className="text-purple-100 text-xs mt-1">Filing ID: #{selectedPatentForChat.id}</p>
              </div>
              <button
                onClick={closeAdminChat}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
              {/* Display user messages and admin replies */}
              {['m1', 'm2', 'm3', 'm4', 'm5'].map((msgField, index) => {
                const userMessage = selectedPatentForChat[msgField];
                const replyField = `r${index + 1}`;
                const adminReplyMsg = selectedPatentForChat[replyField];
                
                return (
                  <div key={msgField}>
                    {/* User Message - LEFT side (from user) */}
                    {userMessage && userMessage.trim() !== '' && (
                      <div className="flex justify-start mb-3">
                        <div className="max-w-[75%] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tl-sm px-5 py-3 shadow-lg">
                          <p className="text-xs font-semibold mb-1 opacity-90">User Message {index + 1}</p>
                          <p className="text-sm leading-relaxed">{userMessage}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Admin Reply - RIGHT side (from you) */}
                    {adminReplyMsg && adminReplyMsg.trim() !== '' && (
                      <div className="flex justify-end mb-3">
                        <div className="max-w-[75%] bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 rounded-2xl rounded-tr-sm px-5 py-3 shadow-md border border-purple-200">
                          <p className="text-xs font-semibold mb-1 text-purple-600">Admin Reply {index + 1}</p>
                          <p className="text-sm leading-relaxed">{adminReplyMsg}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* No messages */}
              {!['m1', 'm2', 'm3', 'm4', 'm5'].some(field => selectedPatentForChat[field] && selectedPatentForChat[field].trim() !== '') && (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No messages from user yet</p>
                </div>
              )}
            </div>

            {/* Reply Input Area */}
            <div className="bg-white p-6 rounded-b-2xl border-t-2 border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Replies: {getReplyCount(selectedPatentForChat)}/4
                </span>
                {getReplyCount(selectedPatentForChat) >= 4 && (
                  <span className="text-xs text-red-600 font-medium">
                    Maximum replies reached
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendAdminReply();
                    }
                  }}
                  placeholder={getReplyCount(selectedPatentForChat) >= 4 ? "Maximum replies sent" : "Type your reply..."}
                  disabled={getReplyCount(selectedPatentForChat) >= 4}
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 font-medium placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendAdminReply}
                  disabled={!adminReply.trim() || getReplyCount(selectedPatentForChat) >= 4}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPatentManager;

// Add inline styles for animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`;
if (!document.querySelector('style[data-admin-animations]')) {
  style.setAttribute('data-admin-animations', 'true');
  document.head.appendChild(style);
}
