const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { DateTime } = require("luxon");

admin.initializeApp();
const db = admin.firestore();

// Nodemailer Gmail transport (App Password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abcdone519@gmail.com",
    pass: "eusw dsdg vaek ymgk", // App Password
  },
});

// EMI alert function - Runs daily at 09:00 AM
exports.sendEmiAlerts = functions.pubsub
  .schedule("0 9 * * *") // every day at 9 AM
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    console.log("🚀 EMI Alert Check Started...");

    const today = DateTime.now().setZone("Asia/Kolkata").startOf("day");
    const snapshot = await db.collection("emiRecords").get();
    let sentCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // ✅ Read Paid Date from both formats
      let paidDateValue = data.paidDate || data["Paid Date"];
      if (
        !paidDateValue ||
        typeof Number(paidDateValue) !== "number" ||
        isNaN(Number(paidDateValue))
      ) {
        console.log(
          `⚠ Skipping ${data.vehicleNo || data["Vehicle No"] || "N/A"}: Invalid Paid Date`
        );
        continue;
      }
      paidDateValue = Number(paidDateValue);

      if (!data.notifyEmails || data.notifyEmails.length === 0) {
        console.log(
          `⚠ No emails for vehicle: ${data.vehicleNo || data["Vehicle No"] || "N/A"}`
        );
        continue;
      }

      // ✅ Calculate next EMI due date
      let dueDate = today.set({ day: paidDateValue });
      if (dueDate < today) {
        dueDate = dueDate.plus({ months: 1 });
      }

      // ✅ FIX: normalize both dates before diff to avoid +1 errors
      const diffDays = dueDate.startOf("day").diff(today.startOf("day"), "days").days;

      console.log(
        `Checking ${data.vehicleNo || data["Vehicle No"] || "N/A"} - Due Date: ${dueDate.toISODate()} - DiffDays: ${diffDays}`
      );

      // ✅ Only send if due in exactly 2 days
      if (diffDays === 2) {
        const html = `
          <p><strong>🚨 EMI Reminder</strong></p>
          <p>Vehicle No: <strong>${data.vehicleNo || data["Vehicle No"] || "N/A"}</strong></p>
          <p>Due Date: <strong>${dueDate.toFormat("dd LLL yyyy")}</strong></p>
          <p>Amount: ₹<strong>${data.amount || data["Amount"] || "N/A"}</strong></p>
          <p>Bank/Financer: <strong>${data.bankName || data["Bank Name"] || "N/A"}</strong></p>
        `;

        const receivers = [
          ...data.notifyEmails,
          "garrykharoud26@gmail.com",
          "sukhwindersukh689@gmail.com",
          "ydlcourier@gmail.com",
          "bglogistic.service@gmail.com",
        ];

        for (const email of receivers) {
          try {
            await transporter.sendMail({
              from: '"YDL Courier EMI Alerts" <abcdone519@gmail.com>',
              to: email,
              subject: `⏰ EMI Due Soon for ${
                data.vehicleNo || data["Vehicle No"] || "Vehicle"
              } on ${dueDate.toFormat("dd LLL yyyy")}`,
              html,
            });
            console.log(`✅ Email sent to ${email}`);
            sentCount++;
          } catch (err) {
            console.error(`❌ Failed to send to ${email}:`, err.message);
          }
        }
      }
    }

    console.log(
      `✔️ EMI alert check completed. Total emails sent: ${sentCount}`
    );
  });


// 2️⃣ Manual Test Email Trigger
exports.testNodemailer = functions.https.onRequest(async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"YDL Test Mailer" <abcdone519@gmail.com>',
      to: [
        "garrykharoud26@gmail.com",
        "sukhwindersukh689@gmail.com",
        "ydlcourier@gmail.com",
        "bglogistic.service@gmail.com",
      ],
      subject: "✅ Test Email from Firebase Nodemailer",
      html: `<p>This is a <strong>test</strong> email from Firebase Functions.</p>`,
    });

    console.log("✅ Test email sent:", info.messageId);
    res.status(200).send("Test email sent successfully.");
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    res.status(500).send("Error: " + error.message);
  }
});

// 3️⃣ Test EMI Email (from local JSON instead of Firestore)
exports.testRunEmiAlerts = functions.https.onRequest(async (req, res) => {
  try {
    const today = DateTime.now().setZone("Asia/Kolkata").startOf("day");
    const day1 = today.plus({ days: 1 }).day;
    const day2 = today.plus({ days: 2 }).day;

    const upcoming = emiRecords.filter(
      (emi) => emi["Paid Date"] === day1 || emi["Paid Date"] === day2
    );

    // Add test record
    upcoming.push({
      "Vehicle No": "PB 13 XX 9999",
      Amount: 12345,
      "Paid Date": day1,
      notifyEmails: [
        "garrykharoud26@gmail.com",
        "sukhwindersukh689@gmail.com",
        "ydlcourier@gmail.com",
        "bglogistic.service@gmail.com",
      ],
    });

    for (const emi of upcoming) {
      const subject = `⏰ EMI Reminder - ${emi["Vehicle No"]}`;
      const html = `
        <p>EMI of ₹${emi.Amount} is due for <strong>${emi["Vehicle No"]}</strong>.</p>
      `;
      await sendEmail(emi.notifyEmails, subject, html);
    }

    res.status(200).send("✅ Forced EMI check complete.");
  } catch (err) {
    console.error("❌ Error running EMI alerts:", err);
    res.status(500).send("❌ Error: " + err.message);
  }
});

// Helper function to send email
async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: '"YDL Courier EMI Alerts" <abcdone519@gmail.com>',
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}
