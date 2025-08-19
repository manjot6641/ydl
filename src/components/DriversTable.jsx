import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import UploadDocsModal from "./UploadDocsModal";
import ViewDocsModal from "./ViewDocsModal";
import { FiUpload, FiEye, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";

export default function DriversTable() {
  const [drivers, setDrivers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "drivers"), (snapshot) => {
      setDrivers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleEditClick = (driver) => {
    setEditRowId(driver.id);
    setEditData({ ...driver });
  };

  const handleSaveClick = async (driverId) => {
    await updateDoc(doc(db, "drivers", driverId), editData);
    setEditRowId(null);
  };

  const handleDelete = async (driverId) => {
    const confirm = window.confirm("Are you sure you want to delete this driver?");
    if (confirm) {
      await deleteDoc(doc(db, "drivers", driverId));
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <table className="min-w-full table-auto bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-700">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Route</th>
            <th className="px-4 py-2">Remarks</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => {
            const isEditing = driver.id === editRowId;
            return (
              <tr key={driver.id} className="text-sm border-b">
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.phone
                  )}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.route || ""}
                      onChange={(e) => handleChange("route", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.route
                  )}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.remarks}
                      onChange={(e) => handleChange("remarks", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    driver.remarks
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveClick(driver.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiSave size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(driver)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDriver(driver);
                        setShowUploadModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiUpload size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDriver(driver);
                        setShowViewModal(true);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modals */}
      {showUploadModal && (
        <UploadDocsModal
          driver={selectedDriver}
          onClose={() => setShowUploadModal(false)}
        />
      )}
      {showViewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg p-4 max-w-md w-full relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Driver Documents</h2>
            {selectedDriver?.documents?.files?.length > 0 ? (
              <ul className="space-y-2">
                {selectedDriver.documents.files.map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file.name || `Document ${idx + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}