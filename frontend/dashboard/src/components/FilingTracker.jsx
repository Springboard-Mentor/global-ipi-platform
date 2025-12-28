import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, DollarSign, CheckCircle, Clock, Eye, X, ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import PatentProgressTracker from './PatentProgressTracker';

const FilingTracker = ({ userProfile, onBack }) => {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFilingId, setExpandedFilingId] = useState(null);

  useEffect(() => {
    if (userProfile?.uid) {
      fetchUserFilings();
    }
  }, [userProfile]);

  const fetchUserFilings = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = userProfile?.uid || auth.currentUser?.uid;
      console.log('Fetching filings for user ID:', userId);
      console.log('User profile:', userProfile);
      console.log('Auth current user:', auth.currentUser);
      
      if (!userId) {
        setError('Please log in to view your filings');
        setLoading(false);
        return;
      }

      // First try to get user's filings
      let response = await fetch(`http://localhost:8080/api/patent-filing/user/${userId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch filings');
      }

      let data = await response.json();
      console.log('Fetched filings for user:', data);
      
      // If no filings found, get all filings to check if any exist
      if (data.length === 0) {
        console.log('No filings found for user, fetching all filings to debug...');
        response = await fetch(`http://localhost:8080/api/patent-filing/all`);
        if (response.ok) {
          const allFilings = await response.json();
          console.log('All filings in database:', allFilings);
          
          // Filter by email as fallback
          const userEmail = userProfile?.email || auth.currentUser?.email;
          console.log('Trying to filter by email:', userEmail);
          
          if (userEmail) {
            data = allFilings.filter(filing => 
              filing.userEmail === userEmail || 
              filing.applicantEmail === userEmail
            );
            console.log('Filtered filings by email:', data);
          }
        }
      }
      
      setFilings(data);
    } catch (err) {
      console.error('Error fetching filings:', err);
      setError('Failed to load your patent filings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Keep the date in the same format as stored (YYYY-MM-DD)
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const toggleDetails = (filingId) => {
    setExpandedFilingId(expandedFilingId === filingId ? null : filingId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-red-600 py-8">
          <p className="text-lg font-semibold mb-2">⚠️ Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 text-gray-600 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          )}
          <h2 className="text-2xl font-bold text-gray-800">My Patent Filings</h2>
        </div>
        <button
          onClick={fetchUserFilings}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>

      {filings.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">No patent filings yet</p>
          <p className="text-gray-500 text-sm mt-2">Your submitted patents will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filings.map((filing) => (
            <div
              key={filing.id}
              className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {filing.inventionTitle}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-gray-700">
                      <User size={16} className="mr-2 text-blue-500" />
                      <span className="text-sm"><strong>Applicant:</strong> {filing.applicantName}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Calendar size={16} className="mr-2 text-purple-500" />
                      <span className="text-sm"><strong>Filed:</strong> {formatDate(filing.applicationDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FileText size={16} className="mr-2 text-green-500" />
                      <span className="text-sm"><strong>Type:</strong> {filing.patentType} ({filing.filingType})</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <DollarSign size={16} className="mr-2 text-yellow-500" />
                      <span className="text-sm"><strong>Amount:</strong> ₹{filing.paymentAmount}</span>
                    </div>
                  </div>
                  
                  {/* Progress Tracker Preview */}
                  <div className="mt-4 mb-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">Application Progress</span>
                      {filing.stage5Granted && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                          ✓ GRANTED
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {[
                        { completed: filing.stage1Filed, label: 'Filed' },
                        { completed: filing.stage2AdminReview, label: 'Admin Review' },
                        { completed: filing.stage3TechnicalReview, label: 'Technical' },
                        { completed: filing.stage4Verification, label: 'Verification' },
                        { completed: filing.stage5Granted, label: 'Granted' }
                      ].map((stage, idx) => (
                        <div key={idx} className="flex-1">
                          <div className={`h-2 rounded-full ${stage.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-xs text-gray-600 block mt-1 text-center">{stage.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(filing.status)}`}>
                      {filing.status?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Payment ID: {filing.paymentId}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleDetails(filing.id)}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                  <Eye size={16} />
                  {expandedFilingId === filing.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded Details Section */}
              {expandedFilingId === filing.id && (
                <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-6 animate-[slideDown_0.3s_ease-out]">
                  {/* Progress Tracker */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-green-400 pb-2">
                      📊 Application Progress Tracker
                    </h3>
                    <PatentProgressTracker filing={filing} />
                  </div>

                  {/* Applicant Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-blue-400 pb-2">
                      👤 Applicant Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Name" value={filing.applicantName} />
                      <DetailItem label="Email" value={filing.applicantEmail} />
                      <DetailItem label="Phone" value={filing.applicantPhone} />
                      <DetailItem label="Type" value={filing.applicantType} />
                      {filing.organizationName && (
                        <DetailItem label="Organization" value={filing.organizationName} />
                      )}
                      {filing.dateOfBirth && (
                        <DetailItem label="Date of Birth" value={formatDate(filing.dateOfBirth)} />
                      )}
                      {filing.age && (
                        <DetailItem label="Age" value={filing.age} />
                      )}
                      {filing.gender && (
                        <DetailItem label="Gender" value={filing.gender} />
                      )}
                      {filing.occupation && (
                        <DetailItem label="Occupation" value={filing.occupation} />
                      )}
                      {filing.designation && (
                        <DetailItem label="Designation" value={filing.designation} />
                      )}
                      {filing.educationalQualification && (
                        <DetailItem label="Education" value={filing.educationalQualification} />
                      )}
                      <DetailItem label="Application Date" value={formatDate(filing.applicationDate)} />
                    </div>
                    
                    <div className="mt-4">
                      <span className="font-bold text-gray-800">Address:</span>
                      <p className="text-gray-700 mt-1">
                        {filing.applicantAddress}, {filing.applicantCity}, {filing.applicantState} - {filing.applicantPincode}, {filing.applicantCountry}
                      </p>
                    </div>

                    {/* Government ID Details */}
                    {filing.govtIdType && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-2">Government ID Details</h4>
                        <DetailItem label="ID Type" value={filing.govtIdType} />
                        <DetailItem label="ID Number" value={filing.govtIdNumber} />
                        {filing.aadhaarNumber && (
                          <DetailItem label="Aadhaar Number" value={filing.aadhaarNumber} />
                        )}
                        {filing.panNumber && (
                          <DetailItem label="PAN Number" value={filing.panNumber} />
                        )}
                        {filing.passportCountry && (
                          <DetailItem label="Passport Country" value={filing.passportCountry} />
                        )}
                        {filing.drivingLicenseState && (
                          <DetailItem label="DL State" value={filing.drivingLicenseState} />
                        )}
                      </div>
                    )}

                    {/* Additional Contact */}
                    {(filing.alternatePhone || filing.alternateEmail || filing.gstin) && (
                      <div className="mt-4">
                        <h4 className="font-bold text-gray-900 mb-2">Additional Contact</h4>
                        {filing.alternatePhone && (
                          <DetailItem label="Alternate Phone" value={filing.alternatePhone} />
                        )}
                        {filing.alternateEmail && (
                          <DetailItem label="Alternate Email" value={filing.alternateEmail} />
                        )}
                        {filing.gstin && (
                          <DetailItem label="GSTIN" value={filing.gstin} />
                        )}
                      </div>
                    )}

                    {/* Correspondence Address */}
                    {filing.correspondenceAddress && !filing.sameAsApplicantAddress && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Correspondence Address:</span>
                        <p className="text-gray-700 mt-1">
                          {filing.correspondenceAddress}, {filing.correspondenceCity}, {filing.correspondenceState} - {filing.correspondencePincode}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Invention Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-purple-400 pb-2">
                      💡 Invention Details
                    </h3>
                    <DetailItem label="Title" value={filing.inventionTitle} />
                    <DetailItem label="Field" value={filing.inventionField} />
                    {filing.targetIndustry && (
                      <DetailItem label="Target Industry" value={filing.targetIndustry} />
                    )}
                    <div className="mt-4">
                      <span className="font-bold text-gray-800">Description:</span>
                      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{filing.inventionDescription}</p>
                    </div>
                    {filing.keywords && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Keywords:</span>
                        <p className="text-gray-700 mt-1">{filing.keywords}</p>
                      </div>
                    )}
                    {filing.technicalProblem && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Technical Problem:</span>
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{filing.technicalProblem}</p>
                      </div>
                    )}
                    {filing.proposedSolution && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Proposed Solution:</span>
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{filing.proposedSolution}</p>
                      </div>
                    )}
                    {filing.advantages && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Advantages:</span>
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{filing.advantages}</p>
                      </div>
                    )}
                    {filing.commercialApplication && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Commercial Application:</span>
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{filing.commercialApplication}</p>
                      </div>
                    )}
                    {filing.priorArt && (
                      <div className="mt-4">
                        <span className="font-bold text-gray-800">Prior Art:</span>
                        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{filing.priorArt}</p>
                      </div>
                    )}
                  </div>

                  {/* Patent Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-green-400 pb-2">
                      📋 Patent Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Patent Type" value={filing.patentType} />
                      <DetailItem label="Filing Type" value={filing.filingType} />
                      <DetailItem label="Number of Claims" value={filing.numberOfClaims} />
                      <DetailItem label="Number of Drawings" value={filing.numberOfDrawings} />
                      {filing.claimsPriority && filing.priorityDate && (
                        <>
                          <DetailItem label="Priority Date" value={formatDate(filing.priorityDate)} />
                          <DetailItem label="Priority Number" value={filing.priorityNumber} />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-orange-400 pb-2">
                      📎 Documents
                    </h3>
                    <div className="space-y-2">
                      {filing.descriptionFileUrl && (
                        <DocumentLink label="Description" url={filing.descriptionFileUrl} />
                      )}
                      {filing.claimsFileUrl && (
                        <DocumentLink label="Claims" url={filing.claimsFileUrl} />
                      )}
                      {filing.abstractFileUrl && (
                        <DocumentLink label="Abstract" url={filing.abstractFileUrl} />
                      )}
                      {filing.drawingsFileUrl && (
                        <DocumentLink label="Drawings" url={filing.drawingsFileUrl} />
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-yellow-400 pb-2">
                      💳 Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Amount" value={`₹${filing.paymentAmount} ${filing.paymentCurrency}`} />
                      <DetailItem label="Payment ID" value={filing.paymentId} />
                      <DetailItem label="Status" value={filing.paymentStatus} />
                      <DetailItem label="Payment Time" value={formatDateTime(filing.paymentTimestamp)} />
                      {filing.paymentOrderId && (
                        <DetailItem label="Order ID" value={filing.paymentOrderId} />
                      )}
                    </div>
                  </div>

                  {/* Filing Status */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-pink-400 pb-2">
                      📊 Filing Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Status" value={filing.status} />
                      <DetailItem label="Filing Date" value={formatDateTime(filing.filingDate)} />
                      <DetailItem label="Created At" value={formatDateTime(filing.createdAt)} />
                      <DetailItem label="Updated At" value={formatDateTime(filing.updatedAt)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            max-height: 5000px;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="mb-2">
      <span className="font-bold text-gray-800">{label}:</span>
      <span className="text-gray-700 ml-2">{value}</span>
    </div>
  );
};

const DocumentLink = ({ label, url }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <span className="font-semibold text-gray-800">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
      >
        View Document
      </a>
    </div>
  );
};

export default FilingTracker;
