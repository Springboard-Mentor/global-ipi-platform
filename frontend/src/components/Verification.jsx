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
      <div className="verification-container-wide">
        {/* Header Section - Compact with inline icon */}
        <div className="verification-header-compact">
          <h1 className="verification-title-compact">
            <span className="icon-shield-inline">🛡️</span>
            Identity Verification
          </h1>
          <p className="verification-subtitle-compact">
            Please confirm your account details before proceeding to the dashboard
          </p>
        </div>
        
        {user && (
          <>
            {/* Split Content Section */}
            <div className="verification-split-content">
              {/* Left Side - Account Verification Details */}
              <div className="verification-left-section">
                <div className="verification-card-compact">
                  <div className="card-header-compact">
                    <h2>
                      <span className="header-icon">✓</span>
                      Account Verification Details
                    </h2>
                  </div>
                  
                  <div className="info-grid-compact">
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
              </div>
              
              {/* Right Side - Security Checkpoint, Actions & Footer */}
              <div className="verification-right-section">
                {/* Security Notice */}
                <div className="security-notice-compact">
                  <div className="notice-icon-compact">🔒</div>
                  <div className="notice-content-compact">
                    <h3>Security Checkpoint</h3>
                    <p>
                      We're verifying this login attempt for your protection. If you don't recognize 
                      this activity, please click "No, This Is Not Me" to sign out immediately.
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="verification-actions-compact">
                  <button
                    onClick={handleContinueToDashboard}
                    className="btn-verify-compact btn-verify-success"
                  >
                    <span className="btn-icon-compact">✔</span>
                    <div className="btn-content-compact">
                      <div className="btn-main-text-compact">Yes, This Is My Account</div>
                      <div className="btn-sub-text-compact">Continue to Dashboard</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="btn-verify-compact btn-verify-danger"
                  >
                    <span className="btn-icon-compact">✖</span>
                    <div className="btn-content-compact">
                      <div className="btn-main-text-compact">No, This Is Not Me</div>
                      <div className="btn-sub-text-compact">Sign Out Immediately</div>
                    </div>
                  </button>
                </div>
                
                {/* Why am I seeing this - moved here below buttons */}
                <div className="verification-footer-right">
                  <p className="footer-text-right">
                    <strong>Why am I seeing this?</strong>
                  </p>
                  <p className="footer-description-right">
                    This verification step helps protect your account from unauthorized access. 
                    We authenticate every login to ensure the security of your IP research data.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Verification;