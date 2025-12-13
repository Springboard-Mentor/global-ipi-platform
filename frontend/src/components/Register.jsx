import { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateName = (name) => {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && /^[a-zA-Z\s'-]+$/.test(trimmedName);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phone) => {
    // Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, 1234567890
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phone.trim().length >= 10 && re.test(phone.trim());
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
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPhone || !trimmedPassword || !trimmedConfirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!validateName(trimmedFirstName)) {
      setError("Please enter a valid first name (at least 2 characters, letters only)");
      return;
    }

    if (!validateName(trimmedLastName)) {
      setError("Please enter a valid last name (at least 2 characters, letters only)");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePhoneNumber(trimmedPhone)) {
      setError("Please enter a valid phone number (at least 10 digits)");
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
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        uid: userCredential.user.uid,
        authProvider: "email",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("User data saved to Firestore");
      
      // Get ID token and save to localStorage for dashboard
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      console.log("Auth token saved to localStorage");
      
      // Redirect to dashboard
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
      
      // Extract name from displayName
      const displayName = result.user.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Save or update user data to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: result.user.email,
        phoneNumber: result.user.phoneNumber || "",
        photoURL: result.user.photoURL || "",
        uid: result.user.uid,
        authProvider: "google",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true }); // merge: true will update existing data or create new
      
      console.log("Google user data saved to Firestore");
      
      // Get ID token and save to localStorage for dashboard
      const idToken = await result.user.getIdToken();
      localStorage.setItem('firebaseAuthToken', idToken);
      console.log("Auth token saved to localStorage");
      
      // Redirect to dashboard
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        window.location.href = "http://localhost:5173";
      }, 1000);
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
          <span className="input-icon">👤</span>
          <input
            type="text"
            className="form-input with-icon"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="given-name"
          />
        </div>
        {firstName.length > 0 && !validateName(firstName) && (
          <div style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
            Name must be at least 2 characters and contain only letters
          </div>
        )}
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">👥</span>
          <input
            type="text"
            className="form-input with-icon"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="family-name"
          />
        </div>
        {lastName.length > 0 && !validateName(lastName) && (
          <div style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
            Name must be at least 2 characters and contain only letters
          </div>
        )}
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            type="email"
            className="form-input with-icon"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="email"
          />
        </div>
        {email.length > 0 && !validateEmail(email) && (
          <div style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
            Please enter a valid email address
          </div>
        )}
      </div>
      
      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">📱</span>
          <input
            type="tel"
            className="form-input with-icon"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="tel"
          />
        </div>
        {phoneNumber.length > 0 && !validatePhoneNumber(phoneNumber) && (
          <div style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
            Please enter a valid phone number (at least 10 digits)
          </div>
        )}
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
