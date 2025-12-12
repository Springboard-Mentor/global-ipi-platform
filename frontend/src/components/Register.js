import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateName,
  getValidationMessage,
} from "../utils/validation";
import Popup from "./Popup";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [popup, setPopup] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  //--------------------------
  // HANDLE FIELD INPUT
  //--------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //--------------------------
  // CALL BACKEND
  //--------------------------
  const callBackendRegister = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      setPopup({ message: "Account created successfully!", type: "success" });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setPopup({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  //--------------------------
  // FORM SUBMIT
  //--------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      setPopup({
        message: getValidationMessage("name", formData.name),
        type: "error",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setPopup({
        message: getValidationMessage("email", formData.email),
        type: "error",
      });
      return;
    }

    if (!validatePassword(formData.password)) {
      setPopup({
        message: getValidationMessage("password", formData.password),
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPopup({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    // Call backend
    callBackendRegister();
  };

  //--------------------------
  // UI
  //--------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-white/80 hover:text-white flex items-center transition"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
          <svg className="h-10 w-10 text-white" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth={2}
              d="M18 9v6m-3-3h6M9 12a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>

        <h2 className="text-3xl text-center font-bold text-white">Join Our Platform</h2>
        <p className="text-center text-gray-300">Create your account</p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl space-y-6">

            {/* FULL NAME */}
            <div>
              <label className="text-sm text-white block mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-white block mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-white block mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-white block mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition transform hover:-translate-y-1 shadow-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-pink-400 hover:text-pink-300"
            >
              Sign in here
            </button>
          </p>
        </form>

        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ message: "", type: "" })}
        />
      </div>
    </div>
  );
};

export default Register;
