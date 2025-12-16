import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    oldPassword: "",
    newPassword: "",
    role: "USER",
    createdAt: "",
  });

  const [profilePic, setProfilePic] = useState("https://i.pravatar.cc/300");
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [editMode, setEditMode] = useState(isEditMode);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Activity data - will be populated from API and calculated from user data
  const [activityData, setActivityData] = useState({
    totalLogins: 47,
    lastLogin: new Date().toISOString(),
    ipSearches: 156,
    alertsReceived: 23,
    reportsGenerated: 8
  });

  // Calculate account age from creation date
  const getAccountAge = (createdAt) => {
    if (!createdAt) return "Unknown";
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years === 1 ? '' : 's'}`;
    }
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  // ---------------- LOAD PROFILE ----------------
  const loadProfile = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401 || response.status === 403) {
        setPopup({ message: "Unauthorized! Please login again.", type: "error" });
        navigate("/login");
        return;
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        fullName: data.name,
        email: data.email,
        phone: data.phone || "",
        countryCode: data.countryCode || "+91",
        role: data.role || "USER",
        createdAt: data.createdAt || new Date().toISOString(),
      }));

      // Update last login to current time since user just accessed profile
      setActivityData(prev => ({
        ...prev,
        lastLogin: new Date().toISOString()
      }));
    } catch (error) {
      setPopup({ message: "Unable to load profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    const { fullName, email, phone, countryCode, oldPassword, newPassword } =
      formData;

    // VALIDATIONS
    if (!validateName(fullName))
      return setPopup({ message: getValidationMessage("name", fullName), type: "error" });

    if (!validateEmail(email))
      return setPopup({ message: getValidationMessage("email", email), type: "error" });

    if (!validatePhone(phone))
      return setPopup({ message: getValidationMessage("phone"), type: "error" });

    // ------------ UPDATE PROFILE API -----------
    try {
      const res = await fetch(
        "http://localhost:8081/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: fullName,
            email,
            phone,
            countryCode,
          }),
        }
      );

      if (!res.ok) throw new Error("Profile update failed");

    } catch (err) {
      return setPopup({ message: "Profile update failed", type: "error" });
    }

    // ------------ CHANGE PASSWORD -----------
    if (oldPassword.trim() || newPassword.trim()) {

      // New rule → old and new password must be different
      if (oldPassword === newPassword) {
        return setPopup({
          message: "New password must be different from old password",
          type: "error",
        });
      }

      if (!validatePassword(oldPassword))
        return setPopup({
          message: getValidationMessage("password", oldPassword),
          type: "error",
        });

      if (!validatePassword(newPassword))
        return setPopup({
          message: getValidationMessage("password", newPassword),
          type: "error",
        });

      try {
        const pwdRes = await fetch(
          "http://localhost:8081/api/users/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ oldPassword, newPassword }),
          }
        );

        if (!pwdRes.ok) throw new Error("Password update failed");

      } catch (err) {
        return setPopup({
          message: "Password update failed",
          type: "error",
        });
      }
    }

    setPopup({ message: "Profile updated successfully!", type: "success" });
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-xl">
        Loading profile...
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white hover:text-blue-300 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">{editMode ? 'Edit Profile' : 'My Profile'}</h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            {editMode ? 'View Profile' : 'Edit Profile'}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {!editMode ? (
          // VIEW MODE - Profile Display
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mx-auto mb-4">
                    <img src={profilePic} alt="profile" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{formData.fullName}</h2>
                  <p className="text-gray-300 mb-1">{formData.email}</p>
                  <p className="text-gray-400 text-sm mb-4">{formData.role}</p>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">Member since</p>
                    <p className="text-white font-medium">{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Unknown'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-300">{formData.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-300">{formData.countryCode} {formData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity & Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Overview */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6">Account Activity</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{activityData.totalLogins}</div>
                    <div className="text-gray-300 text-sm">Total Logins</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{activityData.ipSearches}</div>
                    <div className="text-gray-300 text-sm">IP Searches</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{activityData.alertsReceived}</div>
                    <div className="text-gray-300 text-sm">Alerts Received</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">{activityData.reportsGenerated}</div>
                    <div className="text-gray-300 text-sm">Reports Generated</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-pink-400 mb-1">{getAccountAge(formData.createdAt)}</div>
                    <div className="text-gray-300 text-sm">Account Age</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-xs font-bold text-gray-400 mb-1">Last Login</div>
                    <div className="text-gray-300 text-xs">{new Date(activityData.lastLogin).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Logged in to dashboard', time: '2 hours ago', icon: '🔐' },
                    { action: 'Generated IP analysis report', time: '1 day ago', icon: '📊' },
                    { action: 'Set up new patent alert', time: '3 days ago', icon: '🔔' },
                    { action: 'Updated profile information', time: '1 week ago', icon: '👤' },
                    { action: 'Downloaded search results', time: '2 weeks ago', icon: '⬇️' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{activity.icon}</span>
                        <span className="text-white">{activity.action}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Settings Quick Actions */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/20 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <svg className="h-6 w-6 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <div>
                        <div className="text-white font-medium">Edit Profile</div>
                        <div className="text-gray-400 text-sm">Update your information</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/20 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <svg className="h-6 w-6 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="text-white font-medium">Account Settings</div>
                        <div className="text-gray-400 text-sm">Manage preferences</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // EDIT MODE - Original Form
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20">
            <img src={profilePic} alt="profile" className="w-full h-full object-cover" />
          </div>

          <label htmlFor="profilePicUpload"
            className="mt-3 cursor-pointer px-4 py-2 bg-white/20 rounded-lg">
            Upload Photo
          </label>

          <input
            id="profilePicUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Full Name */}
        <label>Full Name</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2"
        />

        {/* Email */}
        <label className="mt-4 block">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2"
        />

        {/* Phone */}
        <label className="mt-4 block">Mobile Number</label>
        <div className="flex gap-2">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="w-28 bg-white/10 border border-white/20 rounded-lg px-3 py-2"
          >
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code} className="text-black">
                {c.code} {c.name}
              </option>
            ))}
          </select>

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2"
          />
        </div>

        {/* Old Password */}
        <label className="mt-4 block">Old Password</label>
        <div className="relative">
          <input
            name="oldPassword"
            type={showOldPassword ? "text" : "password"}
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2"
          />
          <span
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-300"
          >
            👁
          </span>
        </div>

        {/* New Password */}
        <label className="mt-4 block">New Password</label>
        <div className="relative">
          <input
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2"
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-300"
          >
            👁
          </span>
        </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
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
