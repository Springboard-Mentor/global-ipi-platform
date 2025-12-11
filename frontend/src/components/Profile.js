import React from "react";
import { countryCodes } from "../utils/countryCodes";

const Profile = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#1a0533] via-[#3b0a68] to-[#5c0faf] p-6 text-white">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mt-10 mb-6">Profile</h1>

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
              type="text"
              placeholder="Full Name"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            <span className="absolute right-3 top-3 text-gray-300 cursor-pointer">
              ✏️
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Email</label>
          <input
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
              type="password"
              placeholder="Old Password"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            <span className="absolute right-3 top-3 text-gray-300 cursor-pointer">
              ✏️
            </span>
          </div>

          <div className="relative mt-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            <span className="absolute right-3 top-3 text-gray-300 cursor-pointer">
              ✏️
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          className="
          w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-purple-500 to-pink-500 
          hover:opacity-90 transition
        "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
