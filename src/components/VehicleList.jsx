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

export default function VehiclesTable() {
  const [vehicles, setVehicles] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "vehicles"), (snapshot) => {
      setVehicles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleEditClick = (vehicle) => {
    setEditRowId(vehicle.id);
    setEditData({ ...vehicle });
  };

  const handleSaveClick = async (vehicleId) => {
    await updateDoc(doc(db, "vehicles", vehicleId), editData);
    setEditRowId(null);
  };

  const handleDelete = async (vehicleId) => {
    const confirm = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirm) {
      await deleteDoc(doc(db, "vehicles", vehicleId));
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
            <th className="px-4 py-2">Vehicle No</th>
            <th className="px-4 py-2">Chassis No</th>
            <th className="px-4 py-2">Engine No</th>
            <th className="px-4 py-2">Remarks</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => {
            const isEditing = vehicle.id === editRowId;
            return (
              <tr key={vehicle.id} className="text-sm border-b">
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.number || ""}
                      onChange={(e) => handleChange("number", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    vehicle.number
                  )}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.chassis || ""}
                      onChange={(e) => handleChange("chassis", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    vehicle.chassis
                  )}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.engine || ""}
                      onChange={(e) => handleChange("engine", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    vehicle.engine
                  )}
                </td>
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      value={editData.remarks || ""}
                      onChange={(e) => handleChange("remarks", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    vehicle.remarks
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveClick(vehicle.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiSave size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(vehicle)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowUploadModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiUpload size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowViewModal(true);
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
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
          itemId={selectedVehicle.id}
          collectionName="vehicles"
          folderName="vehicles"
          onClose={() => setShowUploadModal(false)}
        />
      )}
      {showViewModal && (
        <ViewDocsModal
          itemId={selectedVehicle.id}
          collectionName="vehicles"
          folderName="vehicles"
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}