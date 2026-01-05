import React, { useState } from 'react';
import { BrainCircuit, Globe, ShieldCheck, TrendingUp, Search, Zap, ArrowRight, X, Mail, MapPin } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(null);

  const ModalContent = () => {
    if (showModal === 'privacy') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
          <div className="space-y-3 text-sm text-slate-600 max-h-96 overflow-y-auto">
            <p><strong>Last Updated:</strong> December 26, 2025</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">1. Information We Collect</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email address, and contact information</li>
              <li>Company/organization details</li>
              <li>Patent and trademark information you submit</li>
              <li>Usage data and analytics</li>
            </ul>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">2. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your IP filings and monitoring requests</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">4. Data Sharing</h3>
            <p>We do not sell your personal information. We may share data with service providers, government IP offices, and legal authorities when required.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">5. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. Contact us at bhargavabhay182@gmail.com for any privacy requests.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">6. Contact</h3>
            <p>Email: <a href="mailto:bhargavabhay182@gmail.com" className="text-indigo-600 hover:underline">bhargavabhay182@gmail.com</a></p>
          </div>
        </div>
      );
    }

    if (showModal === 'terms') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Terms of Service</h2>
          <div className="space-y-3 text-sm text-slate-600 max-h-96 overflow-y-auto">
            <p><strong>Last Updated:</strong> December 26, 2025</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">1. Acceptance of Terms</h3>
            <p>By accessing Global IP Intelligence Platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">2. Use License</h3>
            <p>Permission is granted to use the platform for managing your intellectual property portfolio, searching databases, monitoring IP assets, and filing new applications.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">3. User Responsibilities</h3>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not use the platform for illegal purposes</li>
              <li>Not attempt to breach security measures</li>
              <li>Respect intellectual property rights of others</li>
            </ul>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">4. Service Availability</h3>
            <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. Maintenance and updates may cause temporary unavailability.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">5. Intellectual Property</h3>
            <p>All platform content, features, and functionality are owned by Global IP Intelligence Inc. and protected by international copyright laws.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">6. Limitation of Liability</h3>
            <p>We are not liable for any indirect, incidental, or consequential damages arising from use of our platform. This is an academic project.</p>
            <h3 className="text-lg font-semibold text-slate-900 mt-4">7. Contact</h3>
            <p>Email: <a href="mailto:bhargavabhay182@gmail.com" className="text-indigo-600 hover:underline">bhargavabhay182@gmail.com</a></p>
          </div>
        </div>
      );
    }

    if (showModal === 'contact') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                <a href="mailto:bhargavabhay182@gmail.com" className="text-indigo-600 hover:underline">
                  bhargavabhay182@gmail.com
                </a>
                <p className="text-sm text-slate-600 mt-1">We typically respond within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Global Operations</h3>
                <p className="text-slate-600">Serving 150+ countries worldwide</p>
                <p className="text-sm text-slate-500 mt-1">Academic Project - Infosys Springboard</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
              <p className="text-sm text-slate-600">Support: Monday - Friday, 9:00 AM - 6:00 PM (IST)</p>
              <p className="text-sm text-slate-600">Emergency Support: 24/7 for critical issues</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-900">Global IP Intelligence</span>
              </div>
              <button onClick={() => setShowModal(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <ModalContent />
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
              <button onClick={() => setShowModal(null)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="w-full max-w-6xl space-y-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl mb-8 animate-pulse">
              <Globe size={56} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
              Global Intellectual Property <br className="hidden sm:block" /> Intelligence Platform
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Secure, monitor, and analyze your worldwide innovation portfolio. From patent filing to infringement detection, manage your IP assets with AI-driven precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button 
              onClick={() => onNavigate('login')}
              className="group w-full sm:w-auto min-w-[180px] rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Access Platform
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto min-w-[180px] rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-md ring-2 ring-inset ring-indigo-200 hover:bg-indigo-50 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:scale-105"
            >
              Register Firm
            </button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 text-slate-600">
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="p-4 bg-indigo-100 rounded-xl mb-4">
                <ShieldCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <span className="text-base font-semibold text-slate-900">Asset Protection</span>
              <p className="mt-2 text-sm text-slate-600 text-center">Secure your innovations globally</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="p-4 bg-purple-100 rounded-xl mb-4">
                <BrainCircuit className="h-8 w-8 text-purple-600" />
              </div>
              <span className="text-base font-semibold text-slate-900">AI Analysis</span>
              <p className="mt-2 text-sm text-slate-600 text-center">Intelligent patent insights</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="p-4 bg-blue-100 rounded-xl mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-base font-semibold text-slate-900">Global Watch</span>
              <p className="mt-2 text-sm text-slate-600 text-center">Monitor 150+ countries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Everything You Need to Manage IP Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Patent Search</h3>
                <p className="text-sm text-slate-600">Find prior art and similar patents instantly with semantic search technology.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Portfolio Analytics</h3>
                <p className="text-sm text-slate-600">Track performance with comprehensive analytics and competitive intelligence.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Real-Time Alerts</h3>
                <p className="text-sm text-slate-600">Get instant notifications for infringements, deadlines, and filings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-indigo-100">Patents Monitored</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12K+</div>
              <div className="text-indigo-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-indigo-100">Countries Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-indigo-100">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Secure Your Innovations?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of innovators, law firms, and enterprises protecting their IP worldwide.
          </p>
          <button 
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-indigo-400" />
                <span className="text-white font-semibold text-lg">Global IP Intelligence</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Empowering innovators worldwide with intelligent intellectual property management and protection solutions.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowModal('privacy')}
                  className="block text-sm hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => setShowModal('terms')}
                  className="block text-sm hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:bhargavabhay182@gmail.com"
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>bhuvananagarajan0728@gmail.com</span>
                </a>
                <button
                  onClick={() => setShowModal('contact')}
                  className="flex items-center gap-2 text-sm hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>View Contact Details</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-center md:text-left">
                &copy; 2025 Global IP Intelligence Inc. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500">Academic Project</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">Infosys Springboard</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;