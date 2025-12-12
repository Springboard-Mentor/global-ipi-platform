import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasNonalphas
      }
    };
  };

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordValidation = validatePassword(trimmedPassword);
    if (!passwordValidation.isValid) {
      let errorMsg = "Password must contain:";
      if (!passwordValidation.errors.minLength) errorMsg += " at least 8 characters,";
      if (!passwordValidation.errors.hasUpperCase) errorMsg += " one uppercase letter,";
      if (!passwordValidation.errors.hasLowerCase) errorMsg += " one lowercase letter,";
      if (!passwordValidation.errors.hasNumbers) errorMsg += " one number,";
      setError(errorMsg.slice(0, -1)); // Remove trailing comma
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      console.log("Registration successful:", userCredential.user);
      // Longer delay to ensure Firebase auth state is properly set
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        window.location.href = "http://localhost:5173";
      }, 1000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please use a different email or login.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      navigate("/dashboard");
    } catch (err) {
      setError("Google registration failed. Please try again.");
      console.error("Google registration error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      
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
            placeholder="Create a password (min 8 chars, upper/lower/number)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="new-password"
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
        {password.length > 0 && (
          <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
            <div style={{ color: password.length >= 8 ? 'green' : 'red' }}>
              ✓ At least 8 characters {password.length >= 8 ? '✅' : '❌'}
            </div>
            <div style={{ color: /[A-Z]/.test(password) ? 'green' : 'red' }}>
              ✓ One uppercase letter {/[A-Z]/.test(password) ? '✅' : '❌'}
            </div>
            <div style={{ color: /[a-z]/.test(password) ? 'green' : 'red' }}>
              ✓ One lowercase letter {/[a-z]/.test(password) ? '✅' : '❌'}
            </div>
            <div style={{ color: /\d/.test(password) ? 'green' : 'red' }}>
              ✓ One number {/\d/.test(password) ? '✅' : '❌'}
            </div>
          </div>
        )}
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">🔐</span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-input with-icon"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="new-password"
          />
          {confirmPassword.length > 0 && (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
      </div>
      
      <button 
        className="btn-primary" 
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
      
      <div style={{ textAlign: 'center', margin: '1rem 0', color: '#666' }}>
        <span>or</span>
      </div>
      
      <button 
        className="btn-google" 
        onClick={handleGoogleRegister}
        disabled={loading}
      >
        🌐 Sign up with Google
      </button>
      
      <div className="auth-links">
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
