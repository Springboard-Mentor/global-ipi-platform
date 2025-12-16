import React, { useState } from 'react';
import AuthLayout from './AuthLayout.jsx';
import { 
  Lock, Mail, ArrowRight, XCircle 
} from 'lucide-react';
// Firebase Imports
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginPage = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Email/Password Login ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({ submit: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔵 Attempting Email Login...");
      
      // A. Verify Credentials with Firebase
      // This will throw an error if password is wrong
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Firebase Verified:", user.email);

      // B. Get Secure Token
      const idToken = await user.getIdToken();

      // C. Sync with Backend
      const response = await fetch('http://localhost:5001/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        throw new Error('Backend login failed');
      }
      
      const data = await response.json();
      
      // D. Success! Save Session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (onLogin) onLogin(data.user);
      if (onNavigate) onNavigate('dashboard');

    } catch (err) {
      console.error("❌ Login Error:", err.code, err.message);
      
      // Handle Specific Firebase Errors
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrors({ submit: 'Incorrect email or password.' });
      } else if (err.code === 'auth/user-not-found') {
        setErrors({ submit: 'No account found with this email.' });
      } else if (err.code === 'auth/too-many-requests') {
        setErrors({ submit: 'Too many failed attempts. Try again later.' });
      } else {
        setErrors({ submit: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Google Login ---
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log("🔵 Starting Google Login...");
      
      // A. Pop-up Google Sign In
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      console.log("✅ Google Verified");

      // B. Send Token to Backend
      const response = await fetch('http://localhost:5001/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        throw new Error('Backend login failed');
      }
      
      const data = await response.json();

      // C. Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (onLogin) onLogin(data.user);
      if (onNavigate) onNavigate('dashboard');

    } catch (err) {
      console.error("❌ Google Login Error:", err);
      setErrors({ submit: 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your IP portfolio"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            Email address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="alex@company.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="ml-2 text-sm text-slate-600 font-medium">Remember me</span>
          </label>
          <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </button>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing In...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/50 backdrop-blur-sm text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        {/* Create Account Link */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;