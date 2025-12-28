import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, DollarSign, CheckCircle, Clock, Eye, X } from 'lucide-react';
import { auth } from '../firebase';

const FilingTracker = () => {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiling, setSelectedFiling] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchUserFilings();
  }, []);

  const fetchUserFilings = async () => {
    setLoading(true);
    setError('');
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Please log in to view your filings');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/patent-filing/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filings');
      }

      const data = await response.json();
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

  const viewDetails = (filing) => {
    setSelectedFiling(filing);
    setShowDetails(true);
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
        <h2 className="text-2xl font-bold text-gray-800">My Patent Filings</h2>
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
                  onClick={() => viewDetails(filing)}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedFiling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">Patent Filing Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-blue-400 pb-2">
                  👤 Applicant Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Name" value={selectedFiling.applicantName} />
                  <DetailItem label="Email" value={selectedFiling.applicantEmail} />
                  <DetailItem label="Phone" value={selectedFiling.applicantPhone} />
                  <DetailItem label="Type" value={selectedFiling.applicantType} />
                  {selectedFiling.organizationName && (
                    <DetailItem label="Organization" value={selectedFiling.organizationName} />
                  )}
                  {selectedFiling.dateOfBirth && (
                    <DetailItem label="Date of Birth" value={formatDate(selectedFiling.dateOfBirth)} />
                  )}
                  {selectedFiling.age && (
                    <DetailItem label="Age" value={selectedFiling.age} />
                  )}
                  {selectedFiling.gender && (
                    <DetailItem label="Gender" value={selectedFiling.gender} />
                  )}
                  {selectedFiling.occupation && (
                    <DetailItem label="Occupation" value={selectedFiling.occupation} />
                  )}
                  {selectedFiling.designation && (
                    <DetailItem label="Designation" value={selectedFiling.designation} />
                  )}
                  {selectedFiling.educationalQualification && (
                    <DetailItem label="Education" value={selectedFiling.educationalQualification} />
                  )}
                  <DetailItem label="Application Date" value={formatDate(selectedFiling.applicationDate)} />
                </div>
                
                <div className="mt-4">
                  <span className="font-bold text-gray-800">Address:</span>
                  <p className="text-gray-700 mt-1">
                    {selectedFiling.applicantAddress}, {selectedFiling.applicantCity}, {selectedFiling.applicantState} - {selectedFiling.applicantPincode}, {selectedFiling.applicantCountry}
                  </p>
                </div>

                {/* Government ID Details */}
                {selectedFiling.govtIdType && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-2">Government ID Details</h4>
                    <DetailItem label="ID Type" value={selectedFiling.govtIdType} />
                    <DetailItem label="ID Number" value={selectedFiling.govtIdNumber} />
                    {selectedFiling.aadhaarNumber && (
                      <DetailItem label="Aadhaar Number" value={selectedFiling.aadhaarNumber} />
                    )}
                    {selectedFiling.panNumber && (
                      <DetailItem label="PAN Number" value={selectedFiling.panNumber} />
                    )}
                    {selectedFiling.passportCountry && (
                      <DetailItem label="Passport Country" value={selectedFiling.passportCountry} />
                    )}
                    {selectedFiling.drivingLicenseState && (
                      <DetailItem label="DL State" value={selectedFiling.drivingLicenseState} />
                    )}
                  </div>
                )}

                {/* Additional Contact */}
                {(selectedFiling.alternatePhone || selectedFiling.alternateEmail || selectedFiling.gstin) && (
                  <div className="mt-4">
                    <h4 className="font-bold text-gray-900 mb-2">Additional Contact</h4>
                    {selectedFiling.alternatePhone && (
                      <DetailItem label="Alternate Phone" value={selectedFiling.alternatePhone} />
                    )}
                    {selectedFiling.alternateEmail && (
                      <DetailItem label="Alternate Email" value={selectedFiling.alternateEmail} />
                    )}
                    {selectedFiling.gstin && (
                      <DetailItem label="GSTIN" value={selectedFiling.gstin} />
                    )}
                  </div>
                )}

                {/* Correspondence Address */}
                {selectedFiling.correspondenceAddress && !selectedFiling.sameAsApplicantAddress && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Correspondence Address:</span>
                    <p className="text-gray-700 mt-1">
                      {selectedFiling.correspondenceAddress}, {selectedFiling.correspondenceCity}, {selectedFiling.correspondenceState} - {selectedFiling.correspondencePincode}
                    </p>
                  </div>
                )}
              </div>

              {/* Invention Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-purple-400 pb-2">
                  💡 Invention Details
                </h3>
                <DetailItem label="Title" value={selectedFiling.inventionTitle} />
                <DetailItem label="Field" value={selectedFiling.inventionField} />
                {selectedFiling.targetIndustry && (
                  <DetailItem label="Target Industry" value={selectedFiling.targetIndustry} />
                )}
                <div className="mt-4">
                  <span className="font-bold text-gray-800">Description:</span>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedFiling.inventionDescription}</p>
                </div>
                {selectedFiling.keywords && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Keywords:</span>
                    <p className="text-gray-700 mt-1">{selectedFiling.keywords}</p>
                  </div>
                )}
                {selectedFiling.technicalProblem && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Technical Problem:</span>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedFiling.technicalProblem}</p>
                  </div>
                )}
                {selectedFiling.proposedSolution && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Proposed Solution:</span>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedFiling.proposedSolution}</p>
                  </div>
                )}
                {selectedFiling.advantages && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Advantages:</span>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedFiling.advantages}</p>
                  </div>
                )}
                {selectedFiling.commercialApplication && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Commercial Application:</span>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedFiling.commercialApplication}</p>
                  </div>
                )}
                {selectedFiling.priorArt && (
                  <div className="mt-4">
                    <span className="font-bold text-gray-800">Prior Art:</span>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">{selectedFiling.priorArt}</p>
                  </div>
                )}
              </div>

              {/* Patent Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-green-400 pb-2">
                  📋 Patent Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Patent Type" value={selectedFiling.patentType} />
                  <DetailItem label="Filing Type" value={selectedFiling.filingType} />
                  <DetailItem label="Number of Claims" value={selectedFiling.numberOfClaims} />
                  <DetailItem label="Number of Drawings" value={selectedFiling.numberOfDrawings} />
                  {selectedFiling.claimsPriority && selectedFiling.priorityDate && (
                    <>
                      <DetailItem label="Priority Date" value={formatDate(selectedFiling.priorityDate)} />
                      <DetailItem label="Priority Number" value={selectedFiling.priorityNumber} />
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
                  {selectedFiling.descriptionFileUrl && (
                    <DocumentLink label="Description" url={selectedFiling.descriptionFileUrl} />
                  )}
                  {selectedFiling.claimsFileUrl && (
                    <DocumentLink label="Claims" url={selectedFiling.claimsFileUrl} />
                  )}
                  {selectedFiling.abstractFileUrl && (
                    <DocumentLink label="Abstract" url={selectedFiling.abstractFileUrl} />
                  )}
                  {selectedFiling.drawingsFileUrl && (
                    <DocumentLink label="Drawings" url={selectedFiling.drawingsFileUrl} />
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-yellow-400 pb-2">
                  💳 Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Amount" value={`₹${selectedFiling.paymentAmount} ${selectedFiling.paymentCurrency}`} />
                  <DetailItem label="Payment ID" value={selectedFiling.paymentId} />
                  <DetailItem label="Status" value={selectedFiling.paymentStatus} />
                  <DetailItem label="Payment Time" value={formatDateTime(selectedFiling.paymentTimestamp)} />
                  {selectedFiling.paymentOrderId && (
                    <DetailItem label="Order ID" value={selectedFiling.paymentOrderId} />
                  )}
                </div>
              </div>

              {/* Filing Status */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-pink-400 pb-2">
                  📊 Filing Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Status" value={selectedFiling.status} />
                  <DetailItem label="Filing Date" value={formatDateTime(selectedFiling.filingDate)} />
                  <DetailItem label="Created At" value={formatDateTime(selectedFiling.createdAt)} />
                  <DetailItem label="Updated At" value={formatDateTime(selectedFiling.updatedAt)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
