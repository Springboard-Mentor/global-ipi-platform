import React, { useEffect, useState } from "react";
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

  const [profilePic, setProfilePic] = useState("https://i.pravatar.cc/300");

  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        setPopup({
          message: "Unauthorized! Please login again.",
          type: "error",
        });
        navigate("/login");
        return;
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        countryCode: data.countryCode,
      }));

    } catch (error) {
      setPopup({ message: "Unable to load profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { fullName, email, phone, countryCode, oldPassword, newPassword } =
      formData;

    if (!validateName(fullName)) {
      return setPopup({
        message: getValidationMessage("name", fullName),
        type: "error",
      });
    }
    if (!validateEmail(email)) {
      return setPopup({
        message: getValidationMessage("email", email),
        type: "error",
      });
    }
    if (!validatePhone(phone)) {
      return setPopup({
        message: getValidationMessage("phone"),
        type: "error",
      });
    }

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

      if (!res.ok) {
        throw new Error("Profile update failed");
      }
    } catch (err) {
      return setPopup({
        message: "Profile update failed",
        type: "error",
      });
    }

    if (oldPassword.trim() || newPassword.trim()) {
      if (!validatePassword(oldPassword)) {
        return setPopup({
          message: getValidationMessage("password", oldPassword),
          type: "error",
        });
      }
      if (!validatePassword(newPassword)) {
        return setPopup({
          message: getValidationMessage("password", newPassword),
          type: "error",
        });
      }

      try {
        const pwdRes = await fetch(
          "http://localhost:8081/api/users/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              oldPassword,
              newPassword,
            }),
          }
        );

        if (!pwdRes.ok) {
          const msg = await pwdRes.text();
          throw new Error(msg);
        }
      } catch (err) {
        return setPopup({
          message: "Password update failed",
          type: "error",
        });
      }
    }

    setPopup({
      message: "Profile updated successfully!",
      type: "success",
    });
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#1a0533] via-[#3b0a68] to-[#5c0faf] p-6 text-white">

      <h1 className="text-3xl font-semibold mt-10 mb-6">Profile</h1>

      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
      >
        Back
      </button>

      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8">

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
            <img
              src={profilePic}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <label
            htmlFor="profilePicUpload"
            className="mt-3 cursor-pointer px-4 py-2 text-sm bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition"
          >
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
        <label className="text-sm text-gray-200">Full Name</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full mt-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
        />

        {/* Email */}
        <label className="text-sm text-gray-200 mt-4 block">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mt-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
        />

        {/* Phone */}
        <label className="text-sm text-gray-200 mt-4 block">Mobile Number</label>
        <div className="flex gap-2 mt-1">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="w-28 bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2"
          >
            {countryCodes.map((c) => (
              <option
                key={`${c.code}-${c.name}`}
                value={c.code}
                className="text-black"
              >
                {c.code} {c.name}
              </option>
            ))}
          </select>

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="flex-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
          />
        </div>

        {/* Password */}
        <label className="text-sm text-gray-200 mt-4 block">Old Password</label>
        <input
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          type="password"
          className="w-full mt-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
        />

        <label className="text-sm text-gray-200 mt-4 block">New Password</label>
        <input
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          type="password"
          className="w-full mt-1 bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
        />

        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:opacity-90"
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
