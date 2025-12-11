import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../utils/countryCodes";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  getValidationMessage,
} from "../utils/validation";
import Popup from "./Popup";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Validation on submit
  const handleSave = () => {
    const { fullName, email, phone, oldPassword, newPassword } = formData;

    // FULL NAME
    if (!fullName.trim() || !validateName(fullName)) {
      return setPopup({
        message: getValidationMessage("name", fullName),
        type: "error",
      });
    }

    // EMAIL
    if (!email.trim() || !validateEmail(email)) {
      return setPopup({
        message: getValidationMessage("email", email),
        type: "error",
      });
    }

    // PHONE
    if (!validatePhone(phone)) {
      return setPopup({
        message: getValidationMessage("phone"),
        type: "error",
      });
    }

    // OLD PASSWORD
    if (!oldPassword.trim() || !validatePassword(oldPassword)) {
      return setPopup({
        message: getValidationMessage("password", oldPassword),
        type: "error",
      });
    }

    // NEW PASSWORD
    if (!newPassword.trim() || !validatePassword(newPassword)) {
      return setPopup({
        message: getValidationMessage("password", newPassword),
        type: "error",
      });
    }

    setPopup({ message: "Profile updated successfully!", type: "success" });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#1a0533] via-[#3b0a68] to-[#5c0faf] p-6 text-white">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mt-10 mb-6">Profile</h1>
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 flex items-center gap-2 
             px-4 py-2 rounded-xl 
             bg-white/10 backdrop-blur-md 
             border border-white/20
             text-white font-medium 
             hover:bg-white/20 hover:scale-105 active:scale-95
             transition duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>

      {/* Glassmorphism Card */}
      <div
        className="
        w-full max-w-lg 
        bg-white/10 backdrop-blur-xl 
        rounded-2xl shadow-xl 
        p-8 flex flex-col items-center
      "
      >
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 mb-6">
          <img
            src="https://i.pravatar.cc/300"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Full Name */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Full Name</label>
          <div className="relative">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
          </div>
        </div>

        {/* Email */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your@email.com"
            className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
              border border-white/20 rounded-lg px-4 py-2 outline-none
              focus:border-pink-400"
          />
        </div>

        {/* Mobile Number */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Mobile Number</label>

          <div className="relative mt-1 flex items-center gap-2">
            {/* Country Code Dropdown */}
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="w-28 bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2
                 outline-none focus:border-pink-400 cursor-pointer"
              defaultValue="+91"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code} className="text-black">
                  ({c.code}) {c.name}
                </option>
              ))}
            </select>

            {/* Phone Number Input */}
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Enter mobile number"
              className="flex-1 bg-white/10 text-white placeholder-gray-300 
                 border border-white/20 rounded-lg px-4 py-2 outline-none 
                 focus:border-pink-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Password</label>
          <div className="relative">
            <input
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            {/* Eye Icon */}
            <span
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-300"
            >
              {showOldPassword ? (
                // Eye Open
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322c.944-4.06 4.33-7.322 9.964-7.322 
             5.632 0 9.017 3.262 9.964 7.322 
             -.947 4.06-4.332 7.322-9.964 7.322 
             -5.634 0-9.02-3.262-9.964-7.322z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // Eye Closed
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.477 10.49A3 3 0 0113.5 13.5m3.35 
             -.858A7.5 7.5 0 006.514 6.513m12.338 
             5.858c-.944 4.06-4.33 7.322-9.964 
             7.322A10.5 10.5 0 013 12.322 
             c.317-1.364.964-2.618 1.88-3.68"
                  />
                </svg>
              )}
            </span>
          </div>

          <div className="relative mt-4">
            <input
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            {/* Eye Icon */}
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-300"
            >
              {showNewPassword ? (
                // Eye Open SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322c.944-4.06 4.33-7.322 9.964-7.322 
             5.632 0 9.017 3.262 9.964 7.322 
             -.947 4.06-4.332 7.322-9.964 7.322 
             -5.634 0-9.02-3.262-9.964-7.322z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                // Eye Closed SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.477 10.49A3 3 0 0113.5 13.5m3.35 
             -.858A7.5 7.5 0 006.514 6.513m12.338 
             5.858c-.944 4.06-4.33 7.322-9.964 
             7.322A10.5 10.5 0 013 12.322 
             c.317-1.364.964-2.618 1.88-3.68"
                  />
                </svg>
              )}
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="
          w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-purple-500 to-pink-500 
          hover:opacity-90 transition
        "
        >
          Save Changes
        </button>
      </div>
      <Popup
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: "", type: "" })}
      />
    </div>
  );
};

export default Profile;
