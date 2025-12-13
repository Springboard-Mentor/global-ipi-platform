import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Building, Briefcase, Phone, Calendar, Shield, CheckCircle, XCircle, Camera, Trash2 } from 'lucide-react';
import { db, storage, auth } from '../firebase';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // <--- IMPORT FIREBASE STORAGE FUNCTIONS

// Helper function to upload file to Firebase Storage
const uploadPhotoToStorage = async (file, uid) => {
  if (!file) {
    console.log('❌ No file provided to uploadPhotoToStorage');
    return null;
  }
  
  console.log('📤 Starting photo upload...');
  console.log('File name:', file.name);
  console.log('File size:', file.size, 'bytes');
  console.log('File type:', file.type);
  console.log('User ID:', uid);
  
  try {
    const storageRef = ref(storage, `users/${uid}/profile.jpg`);
    console.log('Storage path:', `users/${uid}/profile.jpg`);
    
    const snapshot = await uploadBytes(storageRef, file);
    console.log('✅ File uploaded successfully:', snapshot);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('❌ Error in uploadPhotoToStorage:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error; // Re-throw to handle in calling function
  }
};

// Helper function to delete old photo from Firebase Storage
// This is an optional but good cleanup for managing storage space
const deleteOldPhotoFromStorage = async (uid) => {
    // Only attempt to delete if a UID exists
    if (!uid) return;
    try {
        const storageRef = ref(storage, `users/${uid}/profile.jpg`);
        // Note: You might need a check to see if the file exists before trying to delete it
        await deleteObject(storageRef);
        console.log("Old profile photo deleted from storage.");
    } catch (error) {
        // Log the error but don't stop the save process, 
        // as the file might not exist in storage (e.g., initial save)
        if (error.code !== 'storage/object-not-found') {
             console.error('Error deleting old profile photo:', error);
        }
    }
};

const ProfilePage = ({ userProfile, setUserProfile, onBack }) => {
  // Debug: Log props on component mount and updates
  console.log('📄 ProfilePage rendered!');
  console.log('userProfile prop:', userProfile);
  console.log('auth.currentUser:', auth.currentUser);
  
  // DEVELOPMENT MODE: Use test UID if no real UID found
  const TEST_UID = "JBKwcX248aeStcb15EnK8M8jwSW2"; // Your actual UID from Firestore
  
  // Use a temporary state for the file object/blob for storage upload, not the Base64 string
  const [formData, setFormData] = useState({
    ...userProfile,
    uid: userProfile?.uid || TEST_UID // Always ensure UID exists
  });
  const [newFile, setNewFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  
  // Check if we have a valid UID
  const hasValidUID = !!(auth.currentUser?.uid || userProfile?.uid || formData?.uid || TEST_UID);

  // Fetch and sync data when component mounts or userProfile changes
  useEffect(() => {
    const loadProfileData = async () => {
      console.log('ProfilePage - Loading profile data...');
      const uid = auth.currentUser?.uid || userProfile?.uid || TEST_UID;
      
      if (!uid) {
        console.log('⚠️ No UID available');
        return;
      }

      try {
        // Fetch fresh data from Firestore
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          console.log('✅ Profile data loaded from Firestore:', firestoreData);
          
          // Merge Firestore data with auth metadata
          const completeData = {
            ...firestoreData,
            uid: uid,
            email: firestoreData.email || auth.currentUser?.email || userProfile?.email || '',
            emailVerified: firestoreData.emailVerified !== undefined ? firestoreData.emailVerified : (auth.currentUser?.emailVerified || userProfile?.emailVerified || false),
            phoneNumber: firestoreData.phoneNumber || '',
            creationTime: auth.currentUser?.metadata?.creationTime || userProfile?.creationTime || '',
            lastSignInTime: auth.currentUser?.metadata?.lastSignInTime || userProfile?.lastSignInTime || '',
            authProvider: firestoreData.authProvider || userProfile?.authProvider || '',
          };
          
          console.log('📊 Complete profile data:', completeData);
          console.log('📞 Phone Number:', completeData.phoneNumber);
          console.log('✉️ Email Verified:', completeData.emailVerified);
          
          setFormData(completeData);
          
          // Update parent state immediately for Dashboard sync
          if (setUserProfile) {
            console.log('📤 Syncing loaded profile data to Dashboard');
            setUserProfile(completeData);
          }
        } else {
          // Use userProfile prop as fallback
          console.log('⚠️ No Firestore data, using userProfile prop');
          const fallbackData = {
            ...userProfile,
            uid: uid
          };
          setFormData(fallbackData);
          
          // Update parent state for Dashboard sync
          if (setUserProfile) {
            console.log('📤 Syncing fallback profile data to Dashboard');
            setUserProfile(fallbackData);
          }
        }
      } catch (error) {
        console.error('❌ Error loading profile:', error);
        // Fallback to userProfile prop
        const errorFallbackData = {
          ...userProfile,
          uid: uid
        };
        setFormData(errorFallbackData);
        
        // Update parent state even for error fallback
        if (setUserProfile) {
          console.log('📤 Syncing error fallback data to Dashboard');
          setUserProfile(errorFallbackData);
        }
      }
    };

    loadProfileData();
    setNewFile(null);
  }, [userProfile?.uid, auth.currentUser?.uid]);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
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

      // 1. Store the actual File object for Firebase Storage upload later
      setNewFile(file); 

      // 2. Use FileReader only for local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          photoURL: reader.result // Base64 for instant UI preview only
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setNewFile(null); // Clear the new file pending upload
    setFormData({
      ...formData,
      photoURL: '' // Clear the URL for UI/DB
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent double click
    
    // Validate required fields
    if (!formData.firstName || !formData.firstName.trim()) {
      alert('Please enter your first name');
      return;
    }
    
    if (!formData.lastName || !formData.lastName.trim()) {
      alert('Please enter your last name');
      return;
    }
    
    setIsSaving(true);
    let photoUrlToSave = formData.photoURL;

    try {
      // Get UID - priority: currentUser > userProfile > formData > TEST_UID
      let userId = auth.currentUser?.uid || userProfile?.uid || formData?.uid || TEST_UID;
      
      console.log('🔑 Using UID:', userId);
      console.log('Source: ', auth.currentUser?.uid ? 'auth.currentUser' : 
                             userProfile?.uid ? 'userProfile' : 
                             formData?.uid ? 'formData' : 'TEST_UID');

      // 1. Handle Photo Upload to Firebase Storage
      if (newFile) {
        console.log('📸 New file detected, starting upload...');
        console.log('newFile object:', newFile);
        try {
          photoUrlToSave = await uploadPhotoToStorage(newFile, userId);
          console.log('✅ Photo uploaded successfully! URL:', photoUrlToSave);
        } catch (uploadError) {
          console.error('❌ Photo upload failed:', uploadError);
          alert('Failed to upload photo: ' + uploadError.message);
          setIsSaving(false);
          return; // Stop the save process if photo upload fails
        }
      } else if (photoUrlToSave === '' && userProfile.photoURL) {
          console.log('🗑️ Removing old photo from storage...');
          await deleteOldPhotoFromStorage(userId);
      } else {
        console.log('ℹ️ No new photo to upload');
      }
      
      // 2. Save updated data (including the new public photoURL) to Firestore
      const userRef = doc(db, 'users', userId);
      console.log('Updating Firestore document...');
      
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email || auth.currentUser?.email || '',
        company: formData.company || '',
        position: formData.position || '',
        phoneNumber: formData.phoneNumber || '',
        emailVerified: auth.currentUser?.emailVerified || formData.emailVerified || false,
        authProvider: formData.authProvider || 'google',
        photoURL: photoUrlToSave || '',
        updatedAt: serverTimestamp()
      };

      console.log('Updating Firestore with data:', updateData);
      
      await updateDoc(userRef, updateData);
      
      console.log('✅ Profile updated successfully in Firestore!');
      
      // 3. Fetch fresh data from Firestore after save
      const updatedDocSnap = await getDoc(userRef);
      
      if (updatedDocSnap.exists()) {
        const freshData = updatedDocSnap.data();
        console.log('✅ Fresh data fetched after save:', freshData);
        
        // 4. Prepare complete profile data with auth metadata
        const finalProfileData = {
          ...freshData,
          uid: userId,
          email: freshData.email || auth.currentUser?.email || formData.email || '',
          emailVerified: freshData.emailVerified !== undefined ? freshData.emailVerified : (auth.currentUser?.emailVerified || formData.emailVerified || false),
          phoneNumber: freshData.phoneNumber || '',
          creationTime: auth.currentUser?.metadata?.creationTime || formData.creationTime || '',
          lastSignInTime: auth.currentUser?.metadata?.lastSignInTime || formData.lastSignInTime || '',
          authProvider: freshData.authProvider || formData.authProvider || '',
        };
        
        console.log('📊 Final profile data after save:', finalProfileData);
        console.log('📞 Phone Number after save:', finalProfileData.phoneNumber);
        console.log('✉️ Email Verified after save:', finalProfileData.emailVerified);

        console.log('Final profile data to update:', finalProfileData);
        
        // 5. Update both local and parent state
        setFormData(finalProfileData);
        setUserProfile(finalProfileData); // This updates Dashboard too
        
        alert('✅ Profile saved successfully!');
        setIsEditing(false);
        setNewFile(null);
      } else {
        // Fallback if fetch fails
        const finalProfileData = {
          ...formData,
          ...updateData,
          uid: userId,
          photoURL: photoUrlToSave || '',
        };
        
        setFormData(finalProfileData);
        setUserProfile(finalProfileData);
        
        alert('✅ Profile saved successfully!');
        setIsEditing(false);
        setNewFile(null);
      }
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to update profile: ';
      
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check Firestore security rules.';
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'Please logout and login again.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert form data to original profile data
    setFormData(userProfile);
    // Clear any pending file upload
    setNewFile(null); 
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* ... (Rest of the JSX remains the same) ... */}
        
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-10 text-white">
          <button
            onClick={onBack}
            className="mb-6 text-white/80 hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center gap-6">
            <div className="relative">
              {/* Image rendering is fine */}
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
                  className={`px-6 py-3 rounded-xl transition-all ${isSaving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* ... (Rest of the fields are fine) ... */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User className="text-blue-500" size={20} />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500">First Name</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{formData.firstName || 'Not specified'}</p>
                    ) : (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="w-full px-3 py-1 border border-gray-300 rounded mt-1"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User className="text-blue-500" size={20} />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500">Last Name</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{formData.lastName || 'Not specified'}</p>
                    ) : (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="w-full px-3 py-1 border border-gray-300 rounded mt-1"
                      />
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
                        value={formData.company || ''}
                        onChange={handleChange}
                        placeholder="Enter company name"
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
                        value={formData.position || ''}
                        onChange={handleChange}
                        placeholder="Enter job position"
                        className="w-full px-3 py-1 border border-gray-300 rounded mt-1"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Phone className="text-blue-500" size={20} />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    {!isEditing ? (
                      <p className="text-gray-800">{formData.phoneNumber || 'Not specified'}</p>
                    ) : (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full px-3 py-1 border border-gray-300 rounded mt-1"
                      />
                    )}
                  </div>
                </div>
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
                  <label className="block text-sm font-medium text-gray-500 mb-2">Sign-in Method</label>
                  <p className="text-gray-800 capitalize">
                    {formData.authProvider === 'email' ? '📧 Email/Password' : 
                      formData.authProvider === 'google' ? '🌐 Google' : 
                      'Not available'}
                  </p>
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

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="text-blue-500" size={20} />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Account Created</label>
                    <p className="text-gray-800">
                      {(() => {
                        try {
                          if (formData.createdAt && formData.createdAt.seconds) {
                            return new Date(formData.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                          } else if (formData.createdAt) {
                            return new Date(formData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                          } else if (formData.creationTime) {
                            return new Date(formData.creationTime).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                          }
                          return 'Not available';
                        } catch (error) {
                          console.error('Error formatting createdAt:', error);
                          return 'Not available';
                        }
                      })()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="text-purple-500" size={20} />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-800">
                      {(() => {
                        try {
                          if (formData.updatedAt && formData.updatedAt.seconds) {
                            return new Date(formData.updatedAt.seconds * 1000).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                          } else if (formData.updatedAt) {
                            return new Date(formData.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                          }
                          return 'Not available';
                        } catch (error) {
                          console.error('Error formatting updatedAt:', error);
                          return 'Not available';
                        }
                      })()}
                    </p>
                  </div>
                </div>


              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;