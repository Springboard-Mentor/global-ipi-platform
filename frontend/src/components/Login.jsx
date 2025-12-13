import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
      
      // Update last login time in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await setDoc(userRef, {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      // Get ID token and save to localStorage for dashboard
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      console.log("Auth token saved to localStorage");
      
      // Redirect to dashboard
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
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
        // Update existing user
        await setDoc(userRef, {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
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
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      console.log("Google user data saved to Firestore");
      
      // Get ID token and save to localStorage for dashboard
      const idToken = await result.user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      console.log("Auth token saved to localStorage");
      
      // Redirect to dashboard
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        navigate("/dashboard");
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
