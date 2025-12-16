import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import {
  validateEmail,
  validatePassword,
  getValidationMessage,
} from "../utils/validation";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic fields
  const formFields = [
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      validator: validateEmail,
      validationField: "email",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validator: validatePassword,
      validationField: "password",
    },
  ];

  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {})
  );

  const [popup, setPopup] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------- BACKEND LOGIN CALL ----------
  const callBackendLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();

      // Save token if returned
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Success popup
      setPopup({ message: "Login successful!", type: "success" });

      // Navigate after 1 sec
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (error) {
      setPopup({ message: error.message || "Login failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ---------- FORM SUBMIT ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    // Dynamic validation
    for (let field of formFields) {
      if (!field.validator(formData[field.id])) {
        setPopup({
          message: getValidationMessage(field.validationField, formData[field.id]),
          type: "error",
        });
        return;
      }
    }

    // Call backend
    callBackendLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
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

        <h2 className="text-3xl text-center text-white font-bold">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20">

          {/* Dynamic Fields */}
          {formFields.map((field) => (
            <div key={field.id}>
              <label className="text-white text-sm mb-2 block">{field.label}</label>
              
              {field.type === "password" ? (
                <div className="relative">
                  <input
                    id={field.id}
                    name={field.id}
                    type={showPassword ? "text" : "password"}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    className="w-full p-3 pr-12 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="text-center text-gray-300">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300"
          >
            Create account
          </button>
        </p>
      </div>

      <Popup
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: "", type: "" })}
      />
    </div>
  );
};

export default Login;