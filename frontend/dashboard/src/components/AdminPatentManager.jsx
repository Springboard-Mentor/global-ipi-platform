import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Mail, RefreshCw, AlertCircle } from 'lucide-react';

const AdminPatentManager = () => {
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth();
  }, []);

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Admin Patent Manager</h1>
            <button
              onClick={fetchAllPatents}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
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

          <p className="text-gray-600">
            Manage patent filing stages. When all 5 stages are complete, an email will be automatically sent to the applicant.
          </p>
        </div>

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
    </div>
  );
};

export default AdminPatentManager;
