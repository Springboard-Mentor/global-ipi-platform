import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-card">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          
          <h2 className="login-title">Your essential platform for comprehensive global intellectual property intelligence.</h2>
          
          <form onSubmit={handleLogin}>
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}
            
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className={errors.email ? 'error' : ''}
                  required
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="input-group password-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={errors.password ? 'error' : ''}
                  required
                />
                {password && (
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Login Securely'}
            </button>
          </form>
          
          <button type="button" className="forgot-password" onClick={handleForgotPassword}>
            Forgot password?
          </button>
          
          <div className="divider">Or continue with</div>
          
          <button className="oauth-button" disabled={isLoading}>
            <span className="oauth-icon">G</span>
            Sign in with Google
          </button>
          
          <button className="oauth-button" disabled={isLoading}>
            <span className="oauth-icon">⚡</span>
            Sign in with GitHub
          </button>
          
          <p className="account-types">
            Account types: User, Analyst, Admin. Your role determines access levels.
          </p>
          
          <p className="signup-link">
            Don't have an account? 
            <button type="button" className="signup-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="brand-section">
          <div className="brand-icon">◇</div>
          <h1>Unlock the Power of Global IP Data</h1>
          <p>
            Gain unparalleled insights into patents, trademarks, and legal statuses
            worldwide. Our platform empowers you to make informed decisions and
            stay ahead in the competitive IP landscape.
          </p>
          <ul className="feature-list">
            <li>• Comprehensive IP Search & Analytics</li>
            <li>• Real-time Filing Tracking & Alerts</li>
            <li>• Advanced Legal Status Visualizations</li>
            <li>• Secure & Scalable Data Management</li>
          </ul>
          <button className="learn-more-button">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
