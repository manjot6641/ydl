const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Replace with your downloaded key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addNotifyEmailsToAll() {
  try {
    const snapshot = await db.collection("emiRecords").get();

    if (snapshot.empty) {
      console.log("❌ No EMI records found.");
      return;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      const docRef = db.collection("emiRecords").doc(doc.id);
      batch.update(docRef, {
        notifyEmails: [
          "garrykharoud26@gmail.com",
          "sukhwindersukh689@gmail.com",
          "ydlcourier@gmail.com",
          "bglogistic.service@gmail.com"
        ]
      });
    });

    await batch.commit();
    console.log("✅ notifyEmails added to all EMI records.");
  } catch (error) {
    console.error("❌ Error updating records:", error);
  }
}

addNotifyEmailsToAll();
