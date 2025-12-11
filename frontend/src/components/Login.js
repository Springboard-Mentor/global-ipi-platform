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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative">

      <div className="relative z-10 w-full max-w-md space-y-8">

        <h2 className="text-3xl text-center text-white font-bold">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20">

          {/* Dynamic Fields */}
          {formFields.map((field) => (
            <div key={field.id}>
              <label className="text-white text-sm mb-2 block">{field.label}</label>

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
