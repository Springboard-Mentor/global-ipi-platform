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
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="dashboard-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          🔐 Identity Verification in Progress
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1rem' }}>
          Please confirm your account details
        </p>
        
      </div>
      
      {user && (
        <>
          <div className="user-info" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem' }}>
              ✅ Account Verification Details
            </h3>
            <div style={{ textAlign: 'left' }}>
              <p style={{ marginBottom: '0.8rem' }}>
                <strong>Registered Email:</strong><br />
                <span style={{ color: '#007bff' }}>{user.email}</span>
              </p>
              <p style={{ marginBottom: '0.8rem' }}>
                <strong>User Identification Code:</strong><br />
                <span style={{ color: '#007bff', fontFamily: 'monospace' }}>{user.uid.substring(0, 8)}...</span>
              </p>
              <p style={{ marginBottom: '0.8rem' }}>
                <strong>Account Created On:</strong><br />
                <span style={{ color: '#007bff' }}>{formatDate(user.metadata?.creationTime)}</span>
              </p>
              <p style={{ marginBottom: '0.8rem' }}>
                <strong>Last Login Activity:</strong><br />
                <span style={{ color: '#007bff' }}>{formatDate(user.metadata?.lastSignInTime)}</span>
              </p>
              <p style={{ marginBottom: '0.8rem' }}>
                <strong>Email Verification Status:</strong><br />
                <span style={{ color: user.emailVerified ? '#28a745' : '#dc3545' }}>
                  {user.emailVerified ? "✔ Verified" : "❌ Not Verified"}
                </span>
              </p>
            </div>
          </div>
        
          
          <div style={{ textAlign: 'center' }}>
            
            
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={handleContinueToDashboard}
                style={{
                  background: 'linear-gradient(45deg, #28a745 0%, #20c997 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                🚀 Yes, This Is My Account<br />
                <small style={{ fontSize: '0.85rem', opacity: '0.9' }}>➡️ Continue to Dashboard</small>
              </button>
            </div>
            
            <div>
              <button
                className="btn-logout"
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(45deg, #dc3545 0%, #fd7e7e 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                🚪 No, This Is Not Me<br />
                <small style={{ fontSize: '0.85rem', opacity: '0.9' }}>➡️ Sign Out</small>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Verification;