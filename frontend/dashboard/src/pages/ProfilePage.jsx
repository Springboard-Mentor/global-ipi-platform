import React, { useState, useRef } from 'react';
import { User, Mail, Building, Briefcase, Phone, Calendar, Shield, CheckCircle, XCircle, Camera, Trash2 } from 'lucide-react';

const ProfilePage = ({ userProfile, setUserProfile, onBack }) => {
  const [formData, setFormData] = useState(userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photoURL: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photoURL: ''
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
            <div className="relative">
              {formData.photoURL ? (
                <img 
                  src={formData.photoURL} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full shadow-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <User size={48} className="text-blue-500" />
                </div>
              )}
              {formData.emailVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
              )}
              {isEditing && (
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2">
                  <button
                    onClick={handleUploadClick}
                    className="p-2 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                    title="Upload photo"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                  {formData.photoURL && (
                    <button
                      onClick={handleRemovePhoto}
                      className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {formData.firstName || formData.lastName ? 
                  `${formData.firstName} ${formData.lastName}`.trim() : 
                  'User Profile'
                }
              </h1>
              <p className="text-blue-100 text-lg mt-1">
                {formData.position && formData.company ? 
                  `${formData.position} at ${formData.company}` : 
                  'IP Intelligence Platform User'
                }
              </p>
              {formData.emailVerified && (
                <p className="text-green-200 text-sm mt-2 flex items-center gap-1">
                  <Shield size={14} /> Verified Account
                </p>
              )}
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

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User className="text-blue-500" size={20} />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    {!isEditing ? (
                      <p className="text-gray-800">
                        {formData.firstName || formData.lastName ? 
                          `${formData.firstName} ${formData.lastName}`.trim() : 
                          'Not specified'
                        }
                      </p>
                    ) : (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className="px-3 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="text-blue-500" size={20} />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800">{formData.email || 'Not specified'}</p>
                      {formData.emailVerified ? (
                        <CheckCircle className="text-green-500" size={16} title="Verified" />
                      ) : (
                        <XCircle className="text-red-500" size={16} title="Not verified" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Building className="text-blue-500" size={20} />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500">Company</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{formData.company || 'Not specified'}</p>
                    ) : (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-gray-300 rounded mt-1"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Briefcase className="text-blue-500" size={20} />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500">Position</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{formData.position || 'Not specified'}</p>
                    ) : (
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-gray-300 rounded mt-1"
                      />
                    )}
                  </div>
                </div>

                {formData.phoneNumber && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-blue-500" size={20} />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-800">{formData.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Account ID</label>
                  <p className="text-gray-800 font-mono text-xs">{formData.uid || 'Not available'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Account Status</label>
                  <div className="flex items-center gap-2">
                    {formData.emailVerified ? (
                      <>
                        <CheckCircle className="text-green-500" size={20} />
                        <span className="text-green-600 font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500" size={20} />
                        <span className="text-red-600 font-medium">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>

                {formData.creationTime && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="text-blue-500" size={20} />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Account Created</label>
                      <p className="text-gray-800">
                        {new Date(formData.creationTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {formData.lastSignInTime && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="text-green-500" size={20} />
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Sign In</label>
                      <p className="text-gray-800">
                        {new Date(formData.lastSignInTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
