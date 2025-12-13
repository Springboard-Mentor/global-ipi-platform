# Firestore Dashboard Data Setup

## Step 1: Open Browser Console
1. Open your dashboard app in browser (http://localhost:5173)
2. Press F12 to open Developer Tools
3. Go to Console tab

## Step 2: Run this code in console

```javascript
// Copy and paste this entire code block into browser console

import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

// Get current user ID
const userId = auth.currentUser?.uid || 'qLrmSMxqHeP42Rjxtmrxq77j2Ef2';

// Dashboard data to add
const dashboardData = {
  portfolioValue: '$1.2M',
  portfolioGrowth: 'Up 7.5% this quarter',
  activeSubscriptions: 12,
  recentFilings: 45,
  openAlerts: 3,
  lastUpdated: new Date().toISOString()
};

// Add to Firestore
setDoc(doc(db, 'dashboardData', userId), dashboardData)
  .then(() => console.log('✅ Dashboard data added successfully!'))
  .catch(error => console.error('❌ Error:', error));
```

## Alternative: Direct Firestore Console

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `react-auth-app-710f1`
3. Go to Firestore Database
4. Click "Start Collection"
5. Collection ID: `dashboardData`
6. Document ID: Your user UID (e.g., `qLrmSMxqHeP42Rjxtmrxq77j2Ef2`)
7. Add these fields:

| Field Name | Type | Value |
|------------|------|-------|
| portfolioValue | string | $1.2M |
| portfolioGrowth | string | Up 7.5% this quarter |
| activeSubscriptions | number | 12 |
| recentFilings | number | 45 |
| openAlerts | number | 3 |
| lastUpdated | timestamp | (auto) |

## Done!
Refresh your dashboard and data will load from Firestore!
