import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAIKBdO95wujKHFEz7YaLbfNZmqCTPAZE0",
  authDomain: "eventra-4dd67.firebaseapp.com",
  projectId: "eventra-4dd67",
  storageBucket: "eventra-4dd67.firebasestorage.app",
  messagingSenderId: "234718523278",
  appId: "1:234718523278:web:4cf2bfdfadb3e55decbedf",
  measurementId: "G-9Z9TKGR29F"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

// Initialize Analytics only in the browser and if supported
export const analytics = typeof window !== 'undefined' ? isSupported().then(supported => supported ? getAnalytics(app) : null) : null;

export default app;

