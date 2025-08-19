importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBrPzk3V-946cVX4SXNmwkCqsHSyAYQGbQ",
  authDomain: "courier-portal-ydl-ab4e0.firebaseapp.com",
  projectId: "courier-portal-ydl-ab4e0",
  storageBucket: "courier-portal-ydl-ab4e0.firebasestorage.app",
  messagingSenderId: "957733549369",
  appId: "1:957733549369:web:1f4bc8b2c7de1db5c724e8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
