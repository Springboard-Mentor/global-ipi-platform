/**
 * Firebase Cloud Function to automatically delete deactivated accounts after 30 days
 * 
 * This function should be scheduled to run daily using Firebase Cloud Scheduler
 * 
 * Setup Instructions:
 * 1. Install Firebase Functions: npm install -g firebase-tools
 * 2. Initialize Firebase Functions: firebase init functions
 * 3. Deploy this function: firebase deploy --only functions
 * 4. Schedule it to run daily using Cloud Scheduler in Firebase Console
 * 
 * Or set up as a scheduled function:
 * exports.scheduledDeleteDeactivatedAccounts = functions.pubsub
 *   .schedule('every 24 hours')
 *   .onRun(async (context) => { ... });
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

/**
 * Delete accounts that have been deactivated for 30+ days
 * This function should be scheduled to run daily
 */
exports.deleteDeactivatedAccounts = functions.https.onRequest(async (req, res) => {
  try {
    console.log('Starting deactivated accounts cleanup...');
    
    const now = new Date();
    const deletedAccounts = [];
    const errors = [];
    
    // Query users with deactivated status
    const usersSnapshot = await db.collection('users')
      .where('accountStatus', '==', 'deactivated')
      .get();
    
    console.log(`Found ${usersSnapshot.size} deactivated accounts`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      
      try {
        // Check if scheduledDeletionDate exists and has passed
        if (userData.scheduledDeletionDate) {
          const deletionDate = new Date(userData.scheduledDeletionDate);
          
          if (now >= deletionDate) {
            console.log(`Deleting account ${userId} - deletion date: ${deletionDate}`);
            
            // Delete from Firestore
            await userDoc.ref.delete();
            
            // Delete from Firebase Auth
            try {
              await auth.deleteUser(userId);
              console.log(`Deleted Auth user ${userId}`);
            } catch (authError) {
              console.error(`Auth deletion error for ${userId}:`, authError.message);
              // Continue even if auth deletion fails (user might have already been deleted)
            }
            
            // TODO: Delete from Firebase Storage
            // const bucket = admin.storage().bucket();
            // await bucket.deleteFiles({ prefix: `users/${userId}/` });
            
            deletedAccounts.push({
              userId,
              email: userData.email,
              deletionDate: deletionDate.toISOString()
            });
          } else {
            console.log(`Account ${userId} not yet due for deletion (scheduled: ${deletionDate})`);
          }
        } else {
          console.log(`Account ${userId} has no scheduledDeletionDate, skipping`);
        }
      } catch (error) {
        console.error(`Error deleting account ${userId}:`, error);
        errors.push({
          userId,
          error: error.message
        });
      }
    }
    
    const result = {
      success: true,
      timestamp: now.toISOString(),
      accountsChecked: usersSnapshot.size,
      accountsDeleted: deletedAccounts.length,
      deletedAccounts,
      errors
    };
    
    console.log('Cleanup completed:', result);
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in deleteDeactivatedAccounts:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Alternative: Scheduled function that runs automatically every day
 * Uncomment this to use scheduled execution instead of HTTP trigger
 */
/*
exports.scheduledDeleteDeactivatedAccounts = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('America/New_York') // Change to your timezone
  .onRun(async (context) => {
    console.log('Running scheduled cleanup of deactivated accounts...');
    
    const now = new Date();
    let deletedCount = 0;
    
    try {
      const usersSnapshot = await db.collection('users')
        .where('accountStatus', '==', 'deactivated')
        .get();
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        if (userData.scheduledDeletionDate) {
          const deletionDate = new Date(userData.scheduledDeletionDate);
          
          if (now >= deletionDate) {
            await userDoc.ref.delete();
            
            try {
              await auth.deleteUser(userId);
            } catch (authError) {
              console.error(`Auth deletion error for ${userId}:`, authError.message);
            }
            
            deletedCount++;
            console.log(`Deleted account ${userId}`);
          }
        }
      }
      
      console.log(`Cleanup completed. Deleted ${deletedCount} accounts.`);
      return null;
      
    } catch (error) {
      console.error('Error in scheduled cleanup:', error);
      return null;
    }
  });
*/

module.exports = exports;
