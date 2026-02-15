import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkIfEmailExists = async (email) => {
    try {
      // Try to sign in with a dummy password to check if email exists
      await signInWithEmailAndPassword(auth, email, "dummy-password-to-check-email");
      return true;
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/too-many-requests") {
        // Email exists but password is wrong - this means the email is registered
        return true;
      } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        // Email doesn't exist
        return false;
      }
      // For other errors, assume email might exist
      return true;
    }
  };

  const showToast = (message, type = 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 350px;
      word-wrap: break-word;
    `;
    
    if (type === 'error') {
      toast.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a6f)';
    } else if (type === 'success') {
      toast.style.background = 'linear-gradient(135deg, #51cf66, #40c057)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2000);
  };

  const handleReset = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // First check if email exists
      const emailExists = await checkIfEmailExists(trimmedEmail);
      
      if (!emailExists) {
        const errorMsg = "This email is not registered. Please check your email or create a new account.";
        setError(errorMsg);
        showToast("Email not registered!", "error");
        setLoading(false);
        return;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, trimmedEmail);
      setMessage("Password reset email sent successfully! Please check your inbox and spam folder.");
      showToast("Reset link sent to your email!", "success");
      setEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      
      if (err.code === "auth/user-not-found") {
        const errorMsg = "This email is not registered. Please check your email or create a new account.";
        setError(errorMsg);
        showToast("Email not registered!", "error");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
        showToast("Invalid email format!", "error");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a moment before trying again.");
        showToast("Too many attempts. Wait before trying again!", "error");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection and try again.");
        showToast("Network error. Check your connection!", "error");
      } else {
        setError("Failed to send reset email. Please try again later.");
        showToast("Failed to send reset email!", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-container">
        {/* Left Side - Security Information */}
        <div className="auth-info-section forgot-password-info">
          <div className="auth-info-content">
            <h2 className="info-headline">Secure Password Reset Process</h2>
            
            <p className="info-description">
              Your account security is our top priority. We've implemented a robust password 
              recovery system to help you regain access quickly and securely.
            </p>
            
            <div className="security-features">
              <div className="security-item">
                <span className="security-icon">🛡️</span>
                <div>
                  <h3>Bank-Level Encryption</h3>
                  <p>All password reset links are encrypted with industry-standard protocols</p>
                </div>
              </div>
              
              <div className="security-item">
                <span className="security-icon">⏱️</span>
                <div>
                  <h3>Time-Limited Links</h3>
                  <p>Reset links expire after 1 hour for maximum security</p>
                </div>
              </div>
              
              <div className="security-item">
                <span className="security-icon">✉️</span>
                <div>
                  <h3>Email Verification</h3>
                  <p>Reset instructions are sent only to your registered email address</p>
                </div>
              </div>
              
              <div className="security-item">
                <span className="security-icon">🔔</span>
                <div>
                  <h3>Activity Notifications</h3>
                  <p>You'll receive alerts about all password change activities</p>
                </div>
              </div>
            </div>
            
            <div className="info-box">
              <h3>📋 How It Works</h3>
              <ol className="steps-list">
                <li>Enter your registered email address</li>
                <li>Check your inbox for the reset link</li>
                <li>Click the link to create a new password</li>
                <li>Sign in with your new credentials</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Right Side - Reset Password Form */}
        <div className="auth-form-section forgot-password-form">
          <div className="auth-form-content">
            <h2 className="form-title">Reset Your Password</h2>
            <p className="form-subtitle">Enter your email to receive a reset link</p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <button className="btn-primary" onClick={handleReset} disabled={loading}>
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>

            <div className="info-alert">
              <div className="alert-header">
                <span className="alert-icon">💡</span>
                <strong>Important Instructions</strong>
              </div>
              <ul className="alert-list">
                <li>Check your spam/junk folder if you don't see the email</li>
                <li>The reset link expires in 1 hour for security</li>
                <li>You can request a new link if the previous one expired</li>
                <li>Contact support if you need further assistance</li>
              </ul>
            </div>

            <div className="auth-footer">
              <p>
                Remember your password? <Link to="/" className="auth-link">Back to Sign In</Link>
              </p>
              <p>
                Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
