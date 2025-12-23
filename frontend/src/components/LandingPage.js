import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LandingPage = () => {
  const navigate = useNavigate();
  const [expandedFeature, setExpandedFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: "Real-time Monitoring",
      shortDesc: "Track patent filings and IP activities across global databases with instant notifications and AI-powered alerts.",
      longDesc: "Our advanced real-time monitoring system continuously scans over 150 global patent databases, trademark offices, and IP repositories. Get instant notifications when new patents are filed in your technology area, when competitors make IP moves, or when potential infringement risks emerge. Our AI-powered alert system learns from your preferences and delivers only the most relevant updates to your dashboard.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Advanced Analytics",
      shortDesc: "Gain deep insights with machine learning analytics, predictive modeling, and comprehensive trend analysis.",
      longDesc: "Leverage cutting-edge machine learning algorithms to analyze patent trends, predict future filing patterns, and identify emerging technologies before they become mainstream. Our analytics engine processes millions of data points to provide actionable insights including competitor analysis, technology landscape mapping, white space identification, and market opportunity assessment.",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Enterprise Security",
      shortDesc: "Bank-level encryption, SOC 2 compliance, and zero-trust architecture to protect your IP data.",
      longDesc: "Your intellectual property data is protected by military-grade encryption, multi-factor authentication, and zero-trust security architecture. We maintain SOC 2 Type II compliance, GDPR compliance, and undergo regular security audits. All data is encrypted in transit and at rest, with role-based access controls and comprehensive audit trails to ensure your sensitive IP information remains secure.",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      gradient: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Global IP Intelligence</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-200 border border-blue-500/30 backdrop-blur-sm">
              🚀 Next-Generation IP Intelligence Platform
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Monitor Global
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Intellectual Property</span>
            <br />Activity
          </h2>
          <p className="mt-8 text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A comprehensive platform designed to help innovators, law firms, and R&D teams 
            track and analyze intellectual property trends worldwide with AI-powered insights.
          </p>
          
          {/* Hero CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 text-lg font-semibold"
            >
              Register
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-lg font-semibold"
            >
              Login
            </button>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className={`group text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
                expandedFeature === feature.id ? 'md:col-span-3 bg-white/20' : ''
              }`}
              onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}
            >
              <div className={`h-16 w-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {expandedFeature === feature.id ? feature.longDesc : feature.shortDesc}
              </p>
              
              {expandedFeature === feature.id && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Key Benefits:</h4>
                      <ul className="space-y-2 text-gray-300">
                        {feature.id === 1 && (
                          <>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>24/7 automated monitoring</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Instant email & SMS alerts</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Custom search criteria</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Global database coverage</li>
                          </>
                        )}
                        {feature.id === 2 && (
                          <>
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Predictive trend analysis</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Competitor intelligence</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Market opportunity mapping</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Technology landscape visualization</li>
                          </>
                        )}
                        {feature.id === 3 && (
                          <>
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>End-to-end encryption</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Multi-factor authentication</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Role-based access control</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>Compliance certifications</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3">Use Cases:</h4>
                      <ul className="space-y-2 text-gray-300">
                        {feature.id === 1 && (
                          <>
                            <li>• Patent landscape monitoring</li>
                            <li>• Competitor activity tracking</li>
                            <li>• Freedom to operate analysis</li>
                            <li>• Prior art discovery</li>
                          </>
                        )}
                        {feature.id === 2 && (
                          <>
                            <li>• R&D investment planning</li>
                            <li>• Market entry strategies</li>
                            <li>• IP portfolio optimization</li>
                            <li>• Technology scouting</li>
                          </>
                        )}
                        {feature.id === 3 && (
                          <>
                            <li>• Enterprise IP management</li>
                            <li>• Confidential research protection</li>
                            <li>• Regulatory compliance</li>
                            <li>• Secure collaboration</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                      Click to collapse
                    </button>
                  </div>
                </div>
              )}
              
              {expandedFeature !== feature.id && (
                <div className="mt-4">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Learn more →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">10M+</div>
            <div className="text-gray-400">Patents Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">150+</div>
            <div className="text-gray-400">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5000+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>


      </main>

      {/* About Section */}
      <section id="about" className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">About Global IP Intelligence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering innovation through intelligent intellectual property monitoring and analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We provide innovators, law firms, and R&D teams with comprehensive tools to monitor global intellectual property activity. Our platform combines cutting-edge AI technology with extensive patent databases to deliver actionable insights.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Founded by a team of IP professionals and technology experts, we understand the challenges of staying ahead in today's fast-paced innovation landscape.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Global Coverage</h4>
                  <p className="text-gray-300 text-sm">150+ countries and regions</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <h4 className="text-white font-semibold mb-2">Real-time Updates</h4>
                  <p className="text-gray-300 text-sm">24/7 monitoring system</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-400 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">AI-powered patent analysis and trend prediction</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-400 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Comprehensive global database coverage</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-400 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Enterprise-grade security and compliance</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-400 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">24/7 expert support and consultation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-blue-400 mr-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-semibold">Address</h4>
                    <p className="text-gray-300">123 Innovation Drive, Tech Valley, CA 94000</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-blue-400 mr-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-semibold">Email</h4>
                    <p className="text-gray-300">contact@globalipintelligence.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-blue-400 mr-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-semibold">Phone</h4>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-blue-400 mr-4 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-semibold">Business Hours</h4>
                    <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Global IP Intelligence</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering innovation through intelligent intellectual property monitoring and analysis. Join thousands of innovators protecting their IP worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="https://x.com/anjali95403" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/anjali-varshney-7703302a2/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition-colors">Login</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/help')} className="text-gray-400 hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white transition-colors">Terms of Service</button></li>
                <li><button onClick={() => navigate('/help')} className="text-gray-400 hover:text-white transition-colors">Documentation</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Global IP Intelligence Platform. All rights reserved. | Developed by Team: Anjali, Ritika, Pushpa & Rakesh
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ContactForm = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactData.name || !contactData.email || !contactData.message) {
      alert('Please fill in all fields.');
      return;
    }
    
    try {
      await addDoc(collection(db, 'contacts'), {
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
        createdAt: serverTimestamp()
      });
      
      alert('Thank you for your message! We will get back to you soon.');
      setContactData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-white text-sm mb-2 block">Name</label>
        <input
          type="text"
          value={contactData.name}
          onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Your name"
          required
        />
      </div>
      <div>
        <label className="text-white text-sm mb-2 block">Email</label>
        <input
          type="email"
          value={contactData.email}
          onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Your email"
          required
        />
      </div>
      <div>
        <label className="text-white text-sm mb-2 block">Message</label>
        <textarea
          rows={4}
          value={contactData.message}
          onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Your message"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
      >
        Send Message
      </button>
    </form>
  );
};

export default LandingPage;