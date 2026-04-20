import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Safe initialization: only initialise when apiKey is present (prevents build-time crash)
const app = firebaseConfig.apiKey
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

// Safe auth export: returns null when called server-side without credentials
export const auth = app ? getAuth(app) : null;

// Analytics only in browser
export const analytics =
  typeof window !== 'undefined' && app
    ? isSupported().then(ok => (ok ? getAnalytics(app) : null))
    : null;

export default app;
