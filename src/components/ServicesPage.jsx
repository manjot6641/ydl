import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function ServiceTable({ services }) {
  const deleteService = async (id) => {
    const confirm = window.confirm("Delete this service record?");
    if (confirm) {
      await deleteDoc(doc(db, "services", id));
    }
  };

  if (!services || services.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No service records found.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Vehicle No</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Parts Changed</th>
            <th className="p-3 border">Tyre Details</th>
            <th className="p-3 border">Notes</th>
            <th className="p-3 border text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {services.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 text-center">
              <td className="border px-4 py-2">{record.vehicle}</td>
              <td className="border px-4 py-2">{record.date}</td>
              <td className="p-3 border">
                {record.partsChanged?.length > 0
                  ? record.partsChanged.join(", ")
                  : "—"}
              </td>
              <td className="p-3 border">
                Front: {record.tyreDetails?.front || "—"} <br />
                Rear: {record.tyreDetails?.rear || "—"}
              </td>
              <td className="p-3 border">{record.notes || "—"}</td>
              <td className="p-3 border">
                <button
                  onClick={() => deleteService(record.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
