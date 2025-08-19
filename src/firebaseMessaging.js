import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBrPzk3V-946cVX4SXNmwkCqsHSyAYQGbQ",
  authDomain: "courier-portal-ydl-ab4e0.firebaseapp.com",
  projectId: "courier-portal-ydl-ab4e0",
  storageBucket: "courier-portal-ydl-ab4e0.firebasestorage.app",
  messagingSenderId: "957733549369",
  appId: "1:957733549369:web:1f4bc8b2c7de1db5c724e8",
  measurementId: "G-K8X0NT28QH"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
