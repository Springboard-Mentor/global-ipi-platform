import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleResendEmail = () => {
    setIsSuccess(false);
    setEmail('');
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-left">
          <div className="forgot-password-card">
            <div className="logo-container">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-message">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-submessage">
              Click the link in the email to reset your password. If you don't see the email, 
              check your spam folder.
            </p>
            
            <button onClick={handleBackToLogin} className="back-login-button">
              Back to Login
            </button>
            
            <p className="resend-text">
              Didn't receive the email?{' '}
              <button type="button" onClick={handleResendEmail} className="resend-button">
                Try again
              </button>
            </p>
          </div>
        </div>
        
        <div className="forgot-password-right">
          <div className="brand-section">
            <div className="brand-icon">◇</div>
            <h1>Security First</h1>
            <p>
              Your account security is our top priority. We use industry-standard 
              encryption and security measures to protect your intellectual property data.
            </p>
            <ul className="security-features">
              <li>• End-to-end encryption</li>
              <li>• Two-factor authentication</li>
              <li>• Regular security audits</li>
              <li>• GDPR compliant</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <div className="forgot-password-card">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          
          <h2 className="forgot-password-title">Reset Your Password</h2>
          <p className="forgot-password-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit}>
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
                  autoFocus
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <button 
              type="submit" 
              className={`reset-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
          
          <button type="button" onClick={handleBackToLogin} className="back-button">
            ← Back to Login
          </button>
          
          <div className="help-section">
            <p className="help-text">Need help?</p>
            <p className="contact-text">
              Contact our support team at{' '}
              <a href="mailto:support@ipintelligence.com" className="support-email">
                support@ipintelligence.com
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="forgot-password-right">
        <div className="brand-section">
          <div className="brand-icon">◇</div>
          <h1>Forgot Your Password?</h1>
          <p>
            Don't worry, it happens to everyone. We'll help you get back to 
            managing your intellectual property portfolio in no time.
          </p>
          <ul className="feature-list">
            <li>• Secure password reset process</li>
            <li>• Email verification required</li>
            <li>• Strong password recommendations</li>
            <li>• Account activity monitoring</li>
          </ul>
          <div className="security-badge">
            <div className="badge-icon">🔒</div>
            <div className="badge-text">
              <div className="badge-title">Bank-level Security</div>
              <div className="badge-subtitle">Your data is protected with AES-256 encryption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;