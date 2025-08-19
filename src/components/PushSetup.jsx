import React, { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { messaging, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function PushSetup() {
  useEffect(() => {
    const setupPush = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const fcmToken = await getToken(messaging, {
            vapidKey: "BGfevIASMu-L9GgUMEk62mMSC8QZYvk3H9noEk6vW5hc9mGoT40kFIn1VK3OJuq4-RL34_5-utrR0szgWn_GAxE"
          });

          if (fcmToken) {
            console.log("✅ FCM Token:", fcmToken);

            // Save the token to Firestore
            await setDoc(doc(db, "pushTokens", fcmToken), {
              token: fcmToken,
              createdAt: new Date()
            });
          }
        } else {
          console.warn("🚫 Notification permission not granted.");
        }
      } catch (err) {
        console.error("Push notification error:", err);
      }
    };

    setupPush();
  }, []);

  return null; // No UI needed
}
