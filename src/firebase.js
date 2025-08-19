// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase Auth
import { getStorage } from "firebase/storage"; // ✅ ADD THIS LINE

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBrPzk3V-946cVX4SXNmwkCqsHSyAYQGbQ",
  authDomain: "courier-portal-ydl-ab4e0.firebaseapp.com",
  projectId: "courier-portal-ydl-ab4e0",
  storageBucket: "courier-portal-ydl-ab4e0.firebasestorage.app",  // ✅ FIXED
  messagingSenderId: "957733549369",
  appId: "1:957733549369:web:1f4bc8b2c7de1db5c724e8",
  measurementId: "G-K8X0NT28QH"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // ✅ ADD THIS LINE

// ✅ Export all
export { app, db, auth, storage }; // ✅ ADD storage here too
