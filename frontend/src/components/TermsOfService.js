import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-blue-300 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
          <div></div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Terms of Service</h2>
          <p className="text-gray-300 mb-6">Last updated: December 2024</p>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h3>
              <p>By accessing and using Global IP Intelligence platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Use License</h3>
              <p>Permission is granted to temporarily use our platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not use the service for any unlawful purposes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
              <p>In no event shall Global IP Intelligence be liable for any damages arising out of the use or inability to use our platform.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
              <p>For questions regarding these terms, please contact us at legal@globalipintelligence.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;