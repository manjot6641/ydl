import React from 'react';
import { db } from '../firebase';
import emiData from '../data/emiRecords.json'; // ✅ make sure the file is in src/data/
import { collection, addDoc } from 'firebase/firestore';

const UploadEMIData = () => {
  const handleUpload = async () => {
    const emiRef = collection(db, "emiRecords"); // this creates the "emiRecords" collection
    const sheetData = emiData.Sheet1; // ✅ using Sheet1 array

    try {
      for (const record of sheetData) {
        await addDoc(emiRef, record);
      }
      alert("✅ EMI data uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Upload failed. See console.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload EMI Records
      </button>
    </div>
  );
};

export default UploadEMIData;
