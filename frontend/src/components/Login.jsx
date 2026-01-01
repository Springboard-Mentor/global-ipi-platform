import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    if (!email || !password) return setError("Please fill all fields");

    setLoading(true);
    setError("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // update login time
      const userRef = doc(db, "users", res.user.uid);
      await setDoc(
        userRef,
        {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const token = await res.user.getIdToken();
      localStorage.setItem("firebaseAuthToken", token);

      navigate("/verification");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
          authProvider: "google",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      }

      const token = await user.getIdToken();
      localStorage.setItem("firebaseAuthToken", token);

      navigate("/verification");
    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => e.key === "Enter" && handleEmailLogin();

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back 👋</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">📧</span>
          <input
            type="email"
            placeholder="Enter your email"
            className="form-input with-icon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="form-input with-icon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnter}
            disabled={loading}
          />

          {password && (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((p) => !p)}
              disabled={loading}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleEmailLogin}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <div style={{ textAlign: "center", margin: "1rem 0", color: "#666" }}>
        — or —
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
          Don&apos;t have an account? <Link to="/register">Create Account</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}
