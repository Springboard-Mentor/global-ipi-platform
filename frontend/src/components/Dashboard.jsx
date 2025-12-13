import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
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
      <h2 className="dashboard-title">Welcome.....</h2>
      
      {user && (
        <>
          <div className="user-info">
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Account Information</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.uid.substring(0, 8)}...</p>
            <p><strong>Account Created:</strong> {formatDate(user.metadata?.creationTime)}</p>
            <p><strong>Last Sign In:</strong> {formatDate(user.metadata?.lastSignInTime)}</p>
            <p><strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}</p>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
              You have successfully logged in..
            </p>
          </div>
          
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <button
              onClick={async () => {
                try {
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
                  
                  const dashboardURL = new URL('http://localhost:5173/');
                  dashboardURL.searchParams.set('token', idToken);
                  dashboardURL.searchParams.set('uid', user.uid);
                  dashboardURL.searchParams.set('email', user.email);
                  
                  window.open(dashboardURL.toString(), '_blank');
                  console.log('✅ Opened advanced dashboard');
                } catch (error) {
                  console.error('❌ Error:', error);
                  alert('Error opening dashboard. Please try again.');
                }
              }}
              style={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '10px',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            >
              🚀Continue To the Dashboard
            </button>
          </div>
          
          <button
            className="btn-logout"
            onClick={handleLogout}
          >
            🚪 Sign Out
          </button>
        </>
      )}
    </div>
  );
}

export default Dashboard;
