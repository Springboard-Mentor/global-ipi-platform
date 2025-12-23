import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Load config exclusively from environment variables to avoid committing secrets
const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig).filter(([_, v]) => !v).map(([k]) => k);

let appInstance = null;
let db = null;

if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    'Firebase initialization skipped — missing env vars. Please create a `frontend/.env.local` with the following keys: REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_APP_ID'
  );
} else {
  try {
    appInstance = initializeApp(firebaseConfig);
    // eslint-disable-next-line no-console
    console.log('Firebase initialized');
    db = getFirestore(appInstance);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error initializing Firebase:', err);
    appInstance = null;
    db = null;
  }
}

// Export the runtime `db` (may be null) and the app instance (may be null)
export { db };
export default appInstance;