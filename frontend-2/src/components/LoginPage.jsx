import React, { useState, useEffect } from 'react';
import AuthLayout from './AuthLayout.jsx';
import { Lock, Mail, ArrowRight, XCircle, CheckCircle, KeyRound, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginPage = ({ onLogin, onNavigate }) => {
  
  // 🔴 CHANGE THIS TO YOUR LAPTOP'S IP ADDRESS
  // Ensure this matches your backend's actual address and port
  const API_BASE = "http://192.168.56.1:5001/api/auth";

  // Views: 'login', 'forgot', 'reset'
  const [view, setView] = useState('login'); 
  
  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // CAPTCHA State
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState({ num1: 0, num2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // 'login' or 'google'
  const [pendingGoogleToken, setPendingGoogleToken] = useState(null);

  // UI State
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Check for Token in URL (For Password Reset)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      console.log("🔑 Found Reset Token:", token);
      setResetToken(token);
      setView('reset');
    }
  }, []);

  // --- CAPTCHA FUNCTIONS ---

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    setCaptchaChallenge({ num1, num2 });
    setCaptchaInput('');
    // Do not clear global errors here, as we might want to keep previous login errors visible until retry
  };

  const initiateLogin = (e) => {
    e.preventDefault();
    setErrors({});
    
    // Basic Validation before showing Captcha
    if (!email || !password) {
      setErrors({ submit: "Please fill in all fields." });
      return;
    }

    // Set Pending Action and Show Captcha
    setPendingAction('login');
    generateCaptcha();
    setShowCaptcha(true);
  };

  const initiateGoogleLogin = async () => {
    setErrors({});
    setIsLoading(true); // Start loading while popup is open

    try {
      // 1. Authenticate with Google First
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 2. If successful, pause and show Captcha
      setPendingGoogleToken(idToken);
      setPendingAction('google');
      generateCaptcha();
      setShowCaptcha(true);
      setIsLoading(false); // Stop loading while user solves captcha
      
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Google sign-in popup closed or failed.' });
      setIsLoading(false);
    }
  };

  const verifyAndProceed = async () => {
    const sum = captchaChallenge.num1 + captchaChallenge.num2;
    
    if (parseInt(captchaInput) !== sum) {
      setErrors({ captcha: "Incorrect answer. Please try again." });
      generateCaptcha(); // Regenerate on failure for security
      return;
    }

    // CAPTCHA Passed - Proceed with actual logic
    setShowCaptcha(false);
    // Clear captcha specific errors
    setErrors((prev) => ({...prev, captcha: null}));
    
    if (pendingAction === 'login') {
      await performEmailLogin();
    } else if (pendingAction === 'google') {
      await performGoogleBackendLogin();
    }
  };

  const cancelCaptcha = () => {
    setShowCaptcha(false);
    setPendingAction(null);
    setPendingGoogleToken(null);
    setCaptchaInput('');
    setErrors({});
    setIsLoading(false); // Ensure loading state is reset
  };

  // --- CORE LOGIN LOGIC (Called after CAPTCHA) ---

  const performEmailLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 specifically if needed, or generic error
        throw new Error(data.message || 'Invalid Email or Password');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (onLogin) onLogin(data.user);
      if (onNavigate) onNavigate('dashboard');

    } catch (err) {
      console.error("Login Error:", err);
      setErrors({ submit: err.message || 'Invalid email or password.' });
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  const performGoogleBackendLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: pendingGoogleToken })
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || 'Backend sync failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (onLogin) onLogin(data.user);
      if (onNavigate) onNavigate('dashboard');
    } catch (err) {
      console.error("Google Backend Error:", err);
      setErrors({ submit: err.message || 'Google backend authentication failed.' });
    } finally {
      setIsLoading(false);
      setPendingAction(null);
      setPendingGoogleToken(null);
    }
  };

  // B. FORGOT PASSWORD (Send Email)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Failed to send request');
      
      setSuccessMsg('Reset link sent! Please check your email inbox.');
      
    } catch (err) {
      setErrors({ submit: 'Could not send email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // C. RESET PASSWORD (Submit New Password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (password !== confirmPassword) {
        setErrors({ submit: "Passwords do not match!" });
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            token: resetToken, 
            password: password 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccessMsg('Password changed successfully! Redirecting to login...');
      
      // Clear inputs
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccessMsg('');
        setView('login');
        // Remove token from URL so refreshing doesn't trigger reset mode again
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3000);

    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI RENDERING ---
  return (
    <AuthLayout 
      title={view === 'reset' ? "Reset Password" : (view === 'forgot' ? "Forgot Password" : "Welcome Back")}
      subtitle={view === 'reset' ? "Create a new secure password" : (view === 'forgot' ? "Enter email to receive link" : "Sign in to your account")}
    >
      <div className="mt-8 relative">
        
        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{successMsg}</p>
          </div>
        )}

        {/* ERROR MESSAGE (General) */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{errors.submit}</p>
          </div>
        )}

        {/* --- CAPTCHA MODAL OVERLAY --- */}
        {showCaptcha && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-slate-100">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Security Check</h3>
                <p className="text-sm text-slate-500 mt-1">Please solve this to continue.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center mb-6">
                <p className="text-2xl font-black text-slate-700 tracking-wider">
                  {captchaChallenge.num1} + {captchaChallenge.num2} = ?
                </p>
              </div>

              {errors.captcha && (
                <p className="text-xs font-bold text-red-500 text-center mb-3 bg-red-50 py-1 rounded">{errors.captcha}</p>
              )}

              <input 
                type="number" 
                autoFocus
                value={captchaInput} 
                onChange={(e) => setCaptchaInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && verifyAndProceed()}
                placeholder="Enter result"
                className="block w-full text-center px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-indigo-500 outline-none font-bold text-lg mb-6" 
              />

              <div className="flex gap-3">
                <button onClick={cancelCaptcha} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={verifyAndProceed} className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all">
                  Verify
                </button>
              </div>
              
              <button onClick={generateCaptcha} className="w-full mt-4 text-xs font-semibold text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors">
                <RefreshCw size={12} /> Get new challenge
              </button>
            </div>
          </div>
        )}

        {/* --- 1. LOGIN VIEW --- */}
        {view === 'login' && (
          <form onSubmit={initiateLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="alex@company.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="Password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <span className="text-xs font-bold">HIDE</span> : <span className="text-xs font-bold">SHOW</span>}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
                <span className="ml-2 text-sm text-slate-600 font-medium">Remember me</span>
              </label>
              <button type="button" onClick={() => { setView('forgot'); setErrors({}); setSuccessMsg(''); }} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </button>
            </div>
            
            {/* Standard Login Button (Triggers Captcha First) */}
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              {isLoading ? "Processing..." : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>

            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white/50 backdrop-blur-sm text-slate-500 font-medium">Or continue with</span></div></div>

            {/* Google Login Button (Triggers Captcha after Google Popup) */}
            <button type="button" onClick={initiateGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
            </button>

            <div className="text-center pt-2">
                <p className="text-sm text-slate-600">Don't have an account? <button type="button" onClick={() => onNavigate('register')} className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">Create account</button></p>
            </div>
          </form>
        )}

        {/* --- 2. FORGOT PASSWORD VIEW --- */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Registered Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="alex@company.com" required />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <button type="button" onClick={() => { setView('login'); setErrors({}); }} className="w-full py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </form>
        )}

        {/* --- 3. RESET PASSWORD VIEW --- */}
        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">New Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="New password" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Confirm Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="Confirm password" required />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all">
              {isLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}

      </div>
    </AuthLayout>
  );
};

export default LoginPage;