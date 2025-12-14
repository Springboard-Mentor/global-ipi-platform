import React, { useState } from 'react';
import { 
  Globe, Shield, Sparkles, Lock, Mail, User, Building2, 
  Eye, EyeOff, CheckCircle2, XCircle, ArrowRight, FileText, Scale
} from 'lucide-react';

// --- Modal Component ---
const Modal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col scale-100 animate-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
                {title.includes("Privacy") ? <Shield className="w-5 h-5 text-indigo-600"/> : <Scale className="w-5 h-5 text-indigo-600"/>}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto custom-scrollbar">
        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed">
          {content}
        </div>
      </div>
      <div className="p-4 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-2xl">
        <button 
          onClick={onClose} 
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm hover:shadow-md"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  </div>
);

// --- Expanded Terms of Service Content ---
const TermsContent = (
  <div className="space-y-6">
    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-6">
        <p className="text-indigo-800 font-medium text-xs uppercase tracking-wider mb-1">Last Updated</p>
        <p className="text-indigo-900 font-bold">January 1, 2025</p>
    </div>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">1. Acceptance of Terms</h4>
        <p>By registering for, accessing, or using the Global IP Intelligence Platform ("Service"), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these terms.</p>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">2. Description of Service</h4>
        <p>The Service provides intellectual property analytics, patent monitoring, and infringement detection using artificial intelligence. We grant you a limited, non-exclusive, non-transferable license to use the Service for your internal business purposes.</p>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">3. User Obligations & Security</h4>
        <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately of any unauthorized use of your account.</li>
            <li><strong>Compliance:</strong> You agree not to use the Service to violate any applicable laws or regulations, or to infringe upon the intellectual property rights of others.</li>
            <li><strong>Prohibited Actions:</strong> You may not reverse engineer, decompile, or attempt to extract the source code or AI models of the Service.</li>
        </ul>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">4. Intellectual Property Rights</h4>
        <p><strong>Our IP:</strong> All rights, title, and interest in and to the Service (including our AI algorithms, databases, and software) remain exclusively with Global IP Intelligence.</p>
        <p className="mt-2"><strong>Your Data:</strong> You retain all rights to the data you upload to the Service ("User Data"). You grant us a worldwide license to host, copy, and process your data solely for the purpose of providing the Service to you.</p>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">5. Warranties & Disclaimers</h4>
        <p className="uppercase text-xs font-bold text-slate-500 mb-2">Read Carefully</p>
        <p>The Service is provided "AS IS" and "AS AVAILABLE". We do not warrant that the results obtained from the use of the AI analysis will be accurate or reliable for legal proceedings. The Service is an informational tool and does not constitute legal advice.</p>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">6. Limitation of Liability</h4>
        <p>In no event shall Global IP Intelligence be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill.</p>
    </section>
  </div>
);

// --- Expanded Privacy Policy Content ---
const PrivacyContent = (
  <div className="space-y-6">
    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
        <p className="text-emerald-800 font-medium text-xs uppercase tracking-wider mb-1">Effective Date</p>
        <p className="text-emerald-900 font-bold">January 1, 2025</p>
    </div>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">1. Information We Collect</h4>
        <p className="mb-2">We collect information to provide better services to all our users:</p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and billing information provided during registration.</li>
            <li><strong>IP Data:</strong> Patent numbers, search queries, and technical documents you upload for analysis.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our dashboard, features used, and time spent.</li>
        </ul>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">2. How We Use Your Data</h4>
        <p>Your data is used strictly for:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Providing and maintaining the Service.</li>
            <li>Improving our AI models (anonymized data only).</li>
            <li>Customer support and communication regarding service updates.</li>
            <li>Detecting and preventing fraud or security breaches.</li>
        </ul>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">3. Data Security</h4>
        <p>We implement enterprise-grade security measures including:</p>
        <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="p-3 bg-slate-100 rounded-lg">
                <span className="font-semibold block text-slate-800">Encryption</span>
                <span className="text-xs">AES-256 for data at rest & TLS 1.3 for transit.</span>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
                <span className="font-semibold block text-slate-800">Access Control</span>
                <span className="text-xs">Strict role-based access (RBAC) and MFA.</span>
            </div>
        </div>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">4. Data Sharing & Third Parties</h4>
        <p>We <strong>do not sell</strong> your personal data. We may share data with trusted third-party service providers (e.g., cloud hosting via AWS, payment processing via Stripe) solely to operate the Service. All providers are bound by strict confidentiality agreements.</p>
    </section>

    <section>
        <h4 className="text-slate-900 font-bold text-lg mb-2">5. Your Rights (GDPR & CCPA)</h4>
        <p>Depending on your location, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data ("Right to be Forgotten").</li>
            <li>Object to processing of your data.</li>
        </ul>
    </section>
  </div>
);

// --- Auth Layout Component ---
const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen flex relative overflow-hidden bg-slate-900">
    
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
       {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-indigo-950"></div>
      
      {/* Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1000ms'}}></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
    </div>

    {/* Left Side - Information Panel */}
    <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-24 text-white h-screen sticky top-0">
      <div className="space-y-8 max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
            <Globe className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Global IP Intelligence</h1>
            <p className="text-indigo-200/70 text-sm font-medium">Secure Your Innovation</p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-bold mb-6 leading-[1.1] bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-indigo-100/80 text-lg leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4 pt-4">
          {[
            { icon: Shield, title: "Enterprise-Grade Security", desc: "Bank-level AES-256 encryption and SOC 2 Type II compliance.", color: "indigo" },
            { icon: Sparkles, title: "AI-Powered Intelligence", desc: "Automated prior art discovery and infringement detection.", color: "purple" },
            { icon: Globe, title: "Global Coverage", desc: "Real-time monitoring across 150+ patent offices worldwide.", color: "blue" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-default">
              <div className={`p-2.5 bg-${item.color}-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-5 h-5 text-${item.color}-300`} />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1 text-white">{item.title}</h3>
                <p className="text-indigo-200/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-between items-center text-center px-4">
          {[
            { val: "500K+", label: "Patents" },
            { val: "12K+", label: "Users" },
            { val: "150+", label: "Countries" }
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-3xl font-bold text-white mb-0.5">{stat.val}</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right Side - Form Container */}
    <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-12 relative z-10 overflow-y-auto">
      <div className="w-full max-w-[480px]">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border border-white/50 relative overflow-hidden">
          
          {/* Decorative top sheen */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-80"></div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Global IP Intelligence</span>
          </div>

          {children}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-xs font-medium text-indigo-100/80">
            <Shield className="w-3.5 h-3.5" />
            <span>256-bit SSL Encrypted & Secure Connection</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Register Component ---
const RegisterPage = ({ onLogin, onNavigate, authAPI }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'Individual',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touchedFields, setTouchedFields] = useState({});
  const [activeModal, setActiveModal] = useState(null);

  // --- Password Strength Calculator ---
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12;
    if (/[^a-zA-Z\d]/.test(password)) strength += 13;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthLabel = (s) => s === 0 ? '' : s < 40 ? 'Weak' : s < 70 ? 'Medium' : 'Strong';
  const getPasswordStrengthColor = (s) => s < 40 ? 'bg-red-500' : s < 70 ? 'bg-amber-400' : 'bg-emerald-500';

  // --- Event Handlers ---
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') setPasswordStrength(calculatePasswordStrength(value));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleBlur = (field) => setTouchedFields(prev => ({ ...prev, [field]: true }));

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full Name is required';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    return newErrors;
  };

 // --- STRICT SUBMISSION HANDLER ---
const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Validate form
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // 2️⃣ Reset errors and show loading
  setIsLoading(true);
  setErrors({});

  try {
    // 3️⃣ Backend API URL from .env
    const apiUrl = import.meta.env.VITE_API_URL; // http://localhost:5001

    // 4️⃣ Make POST request to backend
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      })
    });

    // 5️⃣ Parse JSON response
    const data = await response.json();

    // 6️⃣ Check if registration was successful
    if (response.ok && data.token) {
      console.log("Registration Successful: Token received");
      
      // Optional: Call onLogin callback if provided
      if (onLogin) onLogin(data.user);

      // Optional: Redirect or show success message
      // navigate("/dashboard");
    } else {
      // Handle unsuccessful registration
      throw new Error(data.message || "Registration failed. No token returned.");
    }

  } catch (error) {
    console.error("Registration Error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
    setErrors({ submit: errorMessage });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      {/* Modals */}
      {activeModal === 'terms' && (
        <Modal title="Terms of Service" content={TermsContent} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'privacy' && (
        <Modal title="Privacy Policy" content={PrivacyContent} onClose={() => setActiveModal(null)} />
      )}

      <AuthLayout 
        title="Join the Future of IP Management" 
        subtitle="Protect, monitor, and analyze your patents across 150+ countries with AI-powered intelligence."
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500">Join 12,000+ innovators protecting their IP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                id="fullname"
                type="text" 
                value={formData.fullname} 
                onChange={(e) => handleChange('fullname', e.target.value)} 
                onBlur={() => handleBlur('fullname')} 
                className={`block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 ${
                  touchedFields.fullname && errors.fullname ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white'
                } transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400`} 
                placeholder="Alex Johnson" 
              />
            </div>
            {touchedFields.fullname && errors.fullname && (
              <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                <XCircle className="w-3.5 h-3.5" />{errors.fullname}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                id="email"
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
                onBlur={() => handleBlur('email')} 
                className={`block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 ${
                  touchedFields.email && errors.email ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white'
                } transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400`} 
                placeholder="alex@company.com" 
              />
            </div>
            {touchedFields.email && errors.email && (
              <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                <XCircle className="w-3.5 h-3.5" />{errors.email}
              </p>
            )}
          </div>

          {/* User Type */}
          <div>
            <label htmlFor="userType" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Organization Type</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
              <select 
                id="userType"
                value={formData.userType} 
                onChange={(e) => handleChange('userType', e.target.value)} 
                className="block w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white transition-all appearance-none outline-none cursor-pointer font-medium text-slate-700"
              >
                <option value="Individual">Individual Inventor</option>
                <option value="Law Firm">Law Firm</option>
                <option value="Corporation">Corporation</option>
                <option value="Research Institution">Research Institution</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-1 gap-5">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={(e) => handleChange('password', e.target.value)} 
                  onBlur={() => handleBlur('password')} 
                  className={`block w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border-2 ${
                    touchedFields.password && errors.password ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white'
                  } transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400`} 
                  placeholder="Create password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-3 px-1">
                  <div className="flex gap-1 h-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div 
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all duration-500 ${
                          passwordStrength >= step * 25 ? getPasswordStrengthColor(passwordStrength) : 'bg-slate-200'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 flex justify-between items-center font-medium">
                    <span>Must contain number & symbol</span>
                    <span className={`${
                      passwordStrength < 40 ? 'text-red-500' : passwordStrength < 70 ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </p>
                </div>
              )}
              
              {touchedFields.password && errors.password && (
                <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <XCircle className="w-3.5 h-3.5" />{errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={formData.confirmPassword} 
                  onChange={(e) => handleChange('confirmPassword', e.target.value)} 
                  onBlur={() => handleBlur('confirmPassword')} 
                  className={`block w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border-2 ${
                    touchedFields.confirmPassword && errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white'
                  } transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400`} 
                  placeholder="Repeat password" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <XCircle className="w-3.5 h-3.5" />{errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start pt-2 px-1">
            <div className="flex items-center h-5">
              <input 
                id="agreeToTerms" 
                type="checkbox" 
                checked={formData.agreeToTerms} 
                onChange={(e) => handleChange('agreeToTerms', e.target.checked)} 
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer" 
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-slate-600">
                I agree to the{' '}
                <button 
                  type="button" 
                  onClick={() => setActiveModal('terms')} 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button 
                  type="button" 
                  onClick={() => setActiveModal('privacy')} 
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1.5 px-1">
              <XCircle className="w-3.5 h-3.5" />{errors.agreeToTerms}
            </p>
          )}

          {/* Global Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-red-700 font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full relative mt-4 group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 text-base font-bold text-white shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_30px_-10px_rgba(79,70,229,0.6)] focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-6">
            <span className="text-slate-500 font-medium">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => onNavigate ? onNavigate('login') : null} 
                className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors"
              >
                Sign in
              </button>
            </span>
          </div>

        </form>
      </AuthLayout>
    </>
  );
};

export default RegisterPage;
