import React, { useState } from 'react';
import { User } from 'lucide-react';

const ProfilePage = ({ userProfile, setUserProfile, onBack }) => {
  const [formData, setFormData] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setUserProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-10 text-white">
          <button
            onClick={onBack}
            className="mb-6 text-white/80 hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              <User size={48} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{formData.firstName} {formData.lastName}</h1>
              <p className="text-blue-100 text-lg mt-1">{formData.position} at {formData.company}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {['firstName', 'lastName', 'email', 'company', 'position'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
