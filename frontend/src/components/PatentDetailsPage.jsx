import React from 'react';
import { ArrowLeft, Calendar, Globe, FileText, User, Building, ShieldCheck, Download, ExternalLink } from 'lucide-react';

const PatentDetailsPage = ({ patent, onBack }) => {
  if (!patent) return null;

  // --- 1. HANDLE DOWNLOAD (Print to PDF) ---
  const handleDownload = () => {
    window.print();
  };

  // --- 2. OPEN OFFICIAL SOURCE (Secure) ---
  const handleViewSource = () => {
    // Clean string (e.g. "US-123" -> "US123")
    const cleanNumber = (patent.patentNumber || '').replace(/[^a-zA-Z0-9]/g, '');
    const url = `https://patents.google.com/patent/${cleanNumber}/en`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {/* Back Button (Hidden during print) */}
      <button 
        onClick={onBack} 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors font-medium print:hidden"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Search Results
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white print:bg-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4 print:border print:border-gray-300">
                {patent.type || 'Patent'}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{patent.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                <span className="flex items-center gap-1 font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">
                  {patent.patentNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" /> {patent.jurisdiction}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {patent.filingDate}
                </span>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-lg text-sm font-bold border print:hidden ${
               patent.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              {patent.status || 'Unknown'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 print:block">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <FileText className="w-5 h-5 text-blue-600" /> Abstract
              </h3>
              <p className="text-gray-600 leading-relaxed text-justify bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-white print:border-none print:p-0">
                {patent.abstractText || "No abstract available."}
              </p>
            </section>

            <section className="print:hidden">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> Claims & Description
              </h3>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800 flex flex-col gap-2">
                <p>Full legal text and images are available on the official registry.</p>
                <button 
                    onClick={handleViewSource}
                    className="text-yellow-900 font-bold underline hover:text-yellow-700 text-left w-fit"
                >
                    View Full Patent Source →
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 print:mt-6">
            <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Inventors
              </h4>
              <div className="space-y-3">
                {patent.inventors?.length > 0 && patent.inventors[0] !== "Unknown Inventor" ? patent.inventors.map((inv, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 print:hidden">
                      {inv.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{inv}</span>
                  </div>
                )) : <span className="text-sm text-gray-400 italic">See official source</span>}
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm print:border-none print:shadow-none print:p-0">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" /> Assignees
              </h4>
              <div className="space-y-2">
                {patent.owners?.length > 0 && patent.owners[0] !== "Unknown Assignee" ? patent.owners.map((own, i) => (
                  <div key={i} className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 print:bg-white print:border-none print:p-0">
                    {own}
                  </div>
                )) : <span className="text-sm text-gray-400 italic">See official source</span>}
              </div>
            </div>

            {/* Actions */}
            <button 
                onClick={handleDownload}
                className="w-full py-3 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 print:hidden"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            
             <button 
                onClick={handleViewSource}
                className="w-full py-3 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors print:hidden"
            >
              <ExternalLink className="w-4 h-4" /> View Official Source
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatentDetailsPage;