import React from 'react';
import { BrainCircuit, Globe, ShieldCheck, TrendingUp, Search, Zap, ArrowRight } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50">
      {/* Hero Section */}
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
          
          {/* Key Features Icons */}
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

      {/* Additional Features Section */}
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

      {/* Stats Section */}
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2025 Global IP Intelligence Inc. All rights reserved.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <span>•</span>
            <button className="hover:text-white transition-colors">Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;