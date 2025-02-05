// Import necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Facebook provider
const Facebookprovider = new FacebookAuthProvider();

export { auth, Facebookprovider, signInWithPopup };
