import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Verification() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContinueToDashboard = async () => {
    try {
      // Update Firestore with current email verification status
      if (user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          emailVerified: user.emailVerified,
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Updated emailVerified status in Firestore:', user.emailVerified);
      }

      const userProfile = {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        emailVerified: user.emailVerified,
        creationTime: user.metadata?.creationTime,
        lastSignInTime: user.metadata?.lastSignInTime,
        authProvider: 'email'
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      const idToken = await user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      
      // Navigate to the dashboard route
      console.log('✅ Navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error opening dashboard. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="verification-page-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Verifying your identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-page-wrapper">
      <div className="verification-container">
        {/* Header Section */}
        <div className="verification-header">
          <div className="verification-icon">
            <span className="icon-shield">🛡️</span>
          </div>
          <h1 className="verification-title">Identity Verification</h1>
          <p className="verification-subtitle">
            Please confirm your account details before proceeding to the dashboard
          </p>
        </div>
        
        {user && (
          <>
            {/* Account Information Card */}
            <div className="verification-card">
              <div className="card-header">
                <h2>
                  <span className="header-icon">✓</span>
                  Account Verification Details
                </h2>
              </div>
              
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <span className="label-icon">📧</span>
                    Registered Email
                  </div>
                  <div className="info-value">{user.email}</div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">
                    <span className="label-icon">🆔</span>
                    User Identification Code
                  </div>
                  <div className="info-value info-code">{user.uid.substring(0, 16)}...</div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">
                    <span className="label-icon">📅</span>
                    Account Created On
                  </div>
                  <div className="info-value">{formatDate(user.metadata?.creationTime)}</div>
                </div>
                
                <div className="info-item">
                  <div className="info-label">
                    <span className="label-icon">⏰</span>
                    Last Login Activity
                  </div>
                  <div className="info-value">{formatDate(user.metadata?.lastSignInTime)}</div>
                </div>
                
                <div className="info-item full-width">
                  <div className="info-label">
                    <span className="label-icon">✉️</span>
                    Email Verification Status
                  </div>
                  <div className={`info-value verification-status ${user.emailVerified ? 'verified' : 'unverified'}`}>
                    {user.emailVerified ? (
                      <><span className="status-icon">✓</span> Verified</>
                    ) : (
                      <><span className="status-icon">⚠</span> Not Verified</>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="security-notice">
              <div className="notice-icon">🔒</div>
              <div className="notice-content">
                <h3>Security Checkpoint</h3>
                <p>
                  We're verifying this login attempt for your protection. If you don't recognize 
                  this activity, please click "No, This Is Not Me" to sign out immediately.
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="verification-actions">
              <button
                onClick={handleContinueToDashboard}
                className="btn-verify-primary"
              >
                <span className="btn-icon">✓</span>
                <div className="btn-content">
                  <div className="btn-main-text">Yes, This Is My Account</div>
                  <div className="btn-sub-text">Continue to Dashboard</div>
                </div>
              </button>
              
              <button
                onClick={handleLogout}
                className="btn-verify-secondary"
              >
                <span className="btn-icon">✗</span>
                <div className="btn-content">
                  <div className="btn-main-text">No, This Is Not Me</div>
                  <div className="btn-sub-text">Sign Out Immediately</div>
                </div>
              </button>
            </div>
            
            {/* Additional Information */}
            <div className="verification-footer">
              <p className="footer-text">
                <strong>Why am I seeing this?</strong><br />
                This verification step helps protect your account from unauthorized access. 
                We authenticate every login to ensure the security of your IP research data.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Verification;