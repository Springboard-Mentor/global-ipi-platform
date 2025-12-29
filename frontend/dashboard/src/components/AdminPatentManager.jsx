import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Mail, RefreshCw, AlertCircle, LogIn, LogOut, User, Shield } from 'lucide-react';

const AdminPatentManager = () => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  
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
      const stageUpdates = {
        [stageName]: value
      };

      console.log('Updating stage:', patentId, stageUpdates);

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
    setMessage('Granting patent and sending email...');
    try {
      const stageUpdates = {
        stage1Filed: true,
        stage2AdminReview: true,
        stage3TechnicalReview: true,
        stage4Verification: true,
        stage5Granted: true
      };

      console.log('Granting all stages for patent:', patent.id);

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
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                <div className="md:hidden flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-center text-gray-600 mb-8">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginAdminId}
                        onChange={(e) => setLoginAdminId(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your admin ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginAdminName}
                        onChange={(e) => setLoginAdminName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    <LogIn className="w-5 h-5" />
                    Login to Admin Panel
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Secure admin access • All activities are logged
                  </p>
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

          {/* Patent Management Section */}
          {loading && patents.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading patents...</p>
            </div>
          ) : patents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg">No patents found in the system.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {patents.map((patent) => (
                <div key={patent.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {patent.inventionTitle || 'Untitled Patent'}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Applicant:</span>{' '}
                          <span className="font-semibold">{patent.applicantName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>{' '}
                          <span className="font-semibold text-blue-600">{patent.applicantEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Filing ID:</span>{' '}
                          <span className="font-mono">#{patent.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>{' '}
                          <span className={`font-semibold ${
                            patent.status === 'Granted' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {patent.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stages */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Patent Stages:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {[
                        { key: 'stage1Filed', label: '1. Filed', name: 'stage1Filed' },
                        { key: 'stage2AdminReview', label: '2. Admin Review', name: 'stage2AdminReview' },
                        { key: 'stage3TechnicalReview', label: '3. Technical', name: 'stage3TechnicalReview' },
                        { key: 'stage4Verification', label: '4. Verification', name: 'stage4Verification' },
                        { key: 'stage5Granted', label: '5. Granted', name: 'stage5Granted' },
                      ].map((stage) => (
                        <button
                          key={stage.key}
                          onClick={() => updateStage(patent.id, stage.name, !patent[stage.key])}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            patent[stage.key]
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {patent[stage.key] ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{stage.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <button
                      onClick={() => grantAllStages(patent)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold"
                    >
                      <Mail className="w-4 h-4" />
                      Grant Patent & Send Email
                    </button>
                    <button
                      onClick={() => resetStages(patent.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset Stages
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPatentManager;
