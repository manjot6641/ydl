import React from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const UpdateNotifyPhones = () => {
  const handleUpdate = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'emiRecords'));
      const phoneArray = ["+919815989989", "+919478514887", "+919041528583"];

      const updatePromises = snapshot.docs.map((record) => {
        const ref = doc(db, 'emiRecords', record.id);
        return updateDoc(ref, { notifyPhones: phoneArray });
      });

      await Promise.all(updatePromises);
      alert('✅ All documents updated with notifyPhones.');
    } catch (error) {
      console.error('❌ Error updating documents:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">🔄 Add notifyPhones to All EMI Records</h2>
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update All Records
      </button>
    </div>
  );
};

export default UpdateNotifyPhones;
