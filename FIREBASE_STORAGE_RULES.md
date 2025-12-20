# Firebase Storage Rules Configuration

## ⚠️ IMPORTANT: Configure These Rules in Firebase Console

To enable profile picture uploads, you need to update your Firebase Storage rules.

### Steps to Update Firebase Storage Rules:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `react-auth-app-710f1`
3. **Click on "Storage" in the left sidebar**
4. **Click on the "Rules" tab**
5. **Replace the existing rules with the rules below**
6. **Click "Publish"**

---

## Recommended Storage Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload/read/delete their own profile pictures
    match /users/{userId}/{fileName} {
      allow read: if true; // Anyone can view profile pictures
      allow write: if request.auth != null && request.auth.uid == userId; // Only owner can upload/delete
      allow delete: if request.auth != null && request.auth.uid == userId; // Only owner can delete
      
      // Validate file size (max 5MB) and image types
      allow create, update: if request.auth != null 
                           && request.auth.uid == userId
                           && request.resource.size < 5 * 1024 * 1024
                           && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## Alternative: Development/Testing Rules (Less Secure)

**⚠️ WARNING: Only use this for development/testing, NOT for production!**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null; // Any authenticated user can read/write
    }
  }
}
```

---

## Verification Steps

After updating the rules:

1. **Test Upload**:
   - Go to your profile page
   - Click the camera icon
   - Select an image (JPG, PNG, etc.)
   - Click "Save Changes"
   - You should see "Uploading photo..." followed by "Profile saved successfully!"

2. **Test Persistence**:
   - Refresh the page
   - Your profile picture should still be visible
   - Log out and log back in
   - Your profile picture should automatically load

3. **Check Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for messages like:
     - ✅ "Photo uploaded successfully!"
     - ✅ "Download URL obtained: https://..."
     - ✅ "Profile updated successfully in Firestore!"

---

## Troubleshooting

### Error: "Permission denied"
**Solution**: Make sure you've published the Storage rules above

### Error: "storage/unauthorized"
**Solution**: 
- Verify you're logged in
- Check that Storage rules are configured correctly
- Make sure your Firebase project has Storage enabled

### Error: "Failed to upload photo"
**Solution**:
- Check file size (must be under 5MB)
- Verify file is an image (JPG, PNG, GIF, WebP)
- Check browser console for detailed error messages

### Photo doesn't persist after refresh
**Solution**:
- Check that the photoURL field is being saved in Firestore
- Go to Firebase Console → Firestore → users collection → your user document
- Verify `photoURL` field contains a full Firebase Storage URL like:
  `https://firebasestorage.googleapis.com/v0/b/react-auth-app-710f1.firebasestorage.app/o/users%2F...`

---

## How It Works

1. **Upload Flow**:
   - User selects image → File stored in React state
   - User clicks "Save Changes"
   - File uploaded to: `users/{userId}/profile_{timestamp}.{extension}`
   - Firebase Storage returns a public download URL
   - URL saved to Firestore in the user's document

2. **Load Flow**:
   - User logs in
   - Profile page fetches user document from Firestore
   - `photoURL` field contains the Storage download URL
   - Image displayed using this URL

3. **Security**:
   - Only authenticated users can upload
   - Users can only upload to their own folder (enforced by UID check)
   - Anyone can view profile pictures (public URLs)
   - File size limited to 5MB
   - Only image files allowed

---

## Additional Configuration (Optional)

### CORS Configuration

If you experience CORS errors, you may need to configure CORS for your Storage bucket:

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Create a `cors.json` file:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

3. Run this command:
```bash
gcloud storage buckets update gs://react-auth-app-710f1.firebasestorage.app --cors-file=cors.json
```

---

## Summary

✅ Updated `uploadPhotoToStorage` function with better error handling
✅ Added file metadata for tracking uploads
✅ Improved error messages for debugging
✅ Added validation to prevent Base64 strings in Firestore
✅ Enhanced logging for troubleshooting

**Next Steps**:
1. Update Firebase Storage rules (see above)
2. Test uploading a profile picture
3. Verify it persists after logout/login
