// components/ProfilePage.jsx
import React, { useState } from 'react';
import { profileAPI } from '../services/ai.js';

const ProfilePage = ({ user, onUpdateUser }) => {
  // Initialize state from props
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || 'Senior IP Attorney specializing in international patent law and AI regulation.');
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      // ✅ CRITICAL FIX: We must send the 'id' so the backend knows who to update
      const updatePayload = { 
        id: user.id,        // <--- THIS WAS MISSING
        name: name, 
        email: email, 
        bio: bio 
      };

      console.log("Sending Update:", updatePayload); // Debug log

      const response = await profileAPI.updateProfile(updatePayload); 
      
      // Update global state with the response
      onUpdateUser(response.user); 
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Profile Save Error:", err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 1024 * 1024) {
      setError('Image must be less than 1MB');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Ensure your backend supports avatar upload or this mock will fail
      // For now, we assume profileAPI handles this.
      const response = await profileAPI.uploadAvatar(file);
      onUpdateUser({ avatar: response.avatarUrl });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 font-medium">Profile updated successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden">
        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Profile Settings</h3>
          <p className="mt-1 text-sm text-slate-500">Update your firm credentials and preferences.</p>
        </div>
        
        <form onSubmit={handleSave} className="px-6 py-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-x-8">
            <div className="h-24 w-24 flex-none rounded-full bg-indigo-100 text-indigo-600 text-3xl font-bold flex items-center justify-center border-2 border-white shadow-md overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                name ? name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <span className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 inline-block transition-colors">
                  Change avatar
                </span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-slate-900">
                Full name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="full-name"
                  id="full-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="userType" className="block text-sm font-medium leading-6 text-slate-900">
                Account Type (Uneditable)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="userType"
                  value={user.userType || 'N/A'}
                  disabled
                  className="block w-full rounded-md border-0 py-1.5 text-slate-500 bg-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 sm:text-sm sm:leading-6 px-3 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium leading-6 text-slate-900">
                Bio
              </label>
              <div className="mt-2">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">Brief description for your firm profile.</p>
            </div>
          </div>

          <div className="flex items-center gap-x-4 border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;