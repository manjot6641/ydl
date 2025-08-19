import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const EMITable = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});
  const [newRecord, setNewRecord] = useState({
    "Vehicle No": "",
    Amount: "",
    "From Acc": "",
    "Bank Name": "",
    "Paid Date": "",
    "Emi Total": "",
    "Last Emi": "",
    Remarks: "",
  });

  useEffect(() => {
    const fetchEMIs = async () => {
      const snapshot = await getDocs(collection(db, 'emiRecords'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    };
    fetchEMIs();
  }, []);

  const filteredRecords = records.filter(record =>
    record["Vehicle No"]
?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (record) => {
    setEditId(record.id);
    setEditedRecord(record);
  };

  const handleChange = (e, key) => {
    setEditedRecord({ ...editedRecord, [key]: e.target.value });
  };

  const handleSave = async () => {
    const recordRef = doc(db, "emiRecords", editId);
    await updateDoc(recordRef, editedRecord);
    setEditId(null);
    window.location.reload();
  };

  const handleAdd = async () => {
    await addDoc(collection(db, "emiRecords"), newRecord);
    setNewRecord({
      "Vehicle No": "",
      Amount: "",
      "From Acc": "",
      "Bank Name": "",
      "Paid Date": "",
      "Emi Total": "",
      "Last Emi": "",
      Remarks: "",
    });
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "emiRecords", id));
    window.location.reload();
  };

  return (
    <div className="p-4">
     

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by Vehicle Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
      </div>

      <table className="w-full border rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            {Object.keys(newRecord).map((key) => (
              <th key={key} className="p-2 border">{key}</th>
            ))}
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <tr key={record.id}>
                {editId === record.id ? (
                  <>
                    {Object.keys(newRecord).map((key) => (
                      <td key={key} className="p-2 border">
                        <input
                          value={editedRecord[key] || ""}
                          onChange={(e) => handleChange(e, key)}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                    ))}
                    <td className="p-2 border">
                      <button onClick={handleSave} className="text-green-600 font-bold">💾</button>
                    </td>
                  </>
                ) : (
                  <>
                    {Object.keys(newRecord).map((key) => (
                      <td key={key} className="p-2 border">{record[key]}</td>
                    ))}
                    <td className="p-2 border">
                      <button onClick={() => handleEdit(record)} className="text-blue-600">✏️</button>
                      <button onClick={() => handleDelete(record.id)} className="text-red-600 ml-2">🗑️</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(newRecord).length + 1} className="p-4 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          )}

          {/* ➕ New Record Row */}
          <tr>
            {Object.keys(newRecord).map((key) => (
              <td key={key} className="p-2 border">
                <input
                  value={newRecord[key]}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, [key]: e.target.value })
                  }
                  className="w-full border px-2 py-1"
                />
              </td>
            ))}
            <td className="p-2 border">
              <button onClick={handleAdd} className="text-green-600 font-bold">➕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EMITable;
