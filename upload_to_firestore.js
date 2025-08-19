const admin = require("firebase-admin");
const fs = require("fs");

// ✅ Load your Firebase service account credentials
const serviceAccount = require("./serviceAccountKey.json");

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ✅ Read JSON file
const vehiclesData = JSON.parse(fs.readFileSync("vehicles_firebase_ready.json", "utf8"));

// ✅ Upload to Firestore
async function uploadVehicles() {
  const batch = db.batch();

  Object.entries(vehiclesData).forEach(([regNo, vehicle]) => {
    const docRef = db.collection("vehicles").doc(regNo);
    batch.set(docRef, vehicle);
  });

  await batch.commit();
  console.log("✅ All vehicle data uploaded successfully to Firestore!");
}

uploadVehicles().catch(console.error);
