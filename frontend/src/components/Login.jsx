import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, deleteUser } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill all fields");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      console.log("Login successful:", userCredential.user);
      
      // Check account status in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if account is deactivated
        if (userData.accountStatus === 'deactivated' && userData.deactivatedAt) {
          const deactivatedDate = userData.deactivatedAt.toDate();
          const daysSinceDeactivation = (new Date() - deactivatedDate) / (1000 * 60 * 60 * 24);
          
          if (daysSinceDeactivation > 30) {
            // Account deactivated for more than 30 days - DELETE IT
            console.log('Account deactivated for >30 days. Deleting...');
            
            try {
              // Delete Firestore document
              await deleteDoc(userRef);
              
              // Delete auth account
              await deleteUser(userCredential.user);
              
              setError('Your account was deactivated for more than 30 days and has been permanently deleted.');
              setLoading(false);
              return;
            } catch (deleteError) {
              console.error('Error deleting account:', deleteError);
              setError('Account deletion failed. Please contact support.');
              setLoading(false);
              return;
            }
          } else {
            // Account deactivated for less than 30 days - REACTIVATE IT
            console.log(`Account deactivated for ${Math.floor(daysSinceDeactivation)} days. Reactivating...`);
            
            await setDoc(userRef, {
              accountStatus: 'active',
              deactivatedAt: null,
              reactivatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });
            
            console.log('Account reactivated successfully!');
          }
        } else {
          // Account is active - just update last login
          await setDoc(userRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      }
      
      // Get ID token and save to localStorage for verification
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      console.log("Auth token saved to localStorage");
      
      // Redirect to verification
      setTimeout(() => {
        console.log("Redirecting to verification...");
        navigate("/verification");
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      
      // Extract name from displayName
      const displayName = result.user.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Check if user exists in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if account is deactivated
        if (userData.accountStatus === 'deactivated' && userData.deactivatedAt) {
          const deactivatedDate = userData.deactivatedAt.toDate();
          const daysSinceDeactivation = (new Date() - deactivatedDate) / (1000 * 60 * 60 * 24);
          
          if (daysSinceDeactivation > 30) {
            // Account deactivated for more than 30 days - DELETE IT
            console.log('Account deactivated for >30 days. Deleting...');
            
            try {
              // Delete Firestore document
              await deleteDoc(userRef);
              
              // Delete auth account
              await deleteUser(result.user);
              
              setError('Your account was deactivated for more than 30 days and has been permanently deleted.');
              setLoading(false);
              return;
            } catch (deleteError) {
              console.error('Error deleting account:', deleteError);
              setError('Account deletion failed. Please contact support.');
              setLoading(false);
              return;
            }
          } else {
            // Account deactivated for less than 30 days - REACTIVATE IT
            console.log(`Account deactivated for ${Math.floor(daysSinceDeactivation)} days. Reactivating...`);
            
            await setDoc(userRef, {
              accountStatus: 'active',
              deactivatedAt: null,
              reactivatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });
            
            console.log('Account reactivated successfully!');
          }
        } else {
          // Update existing active user
          await setDoc(userRef, {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      } else {
        // Create new user document
        await setDoc(userRef, {
          firstName: firstName,
          lastName: lastName,
          email: result.user.email,
          phoneNumber: result.user.phoneNumber || "",
          photoURL: result.user.photoURL || "",
          uid: result.user.uid,
          authProvider: "google",
          accountStatus: "active",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      console.log("Google user data saved to Firestore");
      
      // Get ID token and save to localStorage for verification
      const idToken = await result.user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      console.log("Auth token saved to localStorage");
      
      // Redirect to verification
      setTimeout(() => {
        console.log("Redirecting to verification...");
        navigate("/verification");
      }, 1000);
    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            type="email"
            className="form-input with-icon"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="email"
          />
        </div>
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            className="form-input with-icon"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="current-password"
          />
          {password.length > 0 && (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
      </div>
      
      <button 
        className="btn-primary" 
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
      
      <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666' }}>
        <span>or</span>
      </div>
      
      <button 
        className="btn-google" 
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        🌐 Sign in with Google
      </button>
      
      <div className="auth-links">
        <p>
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
