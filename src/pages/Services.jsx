// src/pages/Services.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaTrash } from "react-icons/fa";

const Services = () => {
  const [records, setRecords] = useState([]);
  const [vehicleNo, setVehicleNo] = useState("");
  const [date, setDate] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [otherPart, setOtherPart] = useState("");
  const [tyreFront, setTyreFront] = useState("");
  const [tyreRear, setTyreRear] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const commonParts = [
    "Engine Oil",
    "Oil Filter",
    "Diesel Filter",
    "Air Filter",
    "Gear Oil",
    "Coolant",
    "Battery",
    "Wiper",
    "Brake Shoe",
    "Chain",
    "Tyres",
    "Engine",
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const snapshot = await getDocs(collection(db, "services"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRecords(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const partList = [...selectedParts];
    if (otherPart.trim() !== "") {
      partList.push(`Other: ${otherPart}`);
    }

    await addDoc(collection(db, "services"), {
      vehicleNo,
      date,
      parts: partList,
      tyreFront,
      tyreRear,
      notes,
    });

    setVehicleNo("");
    setDate("");
    setSelectedParts([]);
    setOtherPart("");
    setTyreFront("");
    setTyreRear("");
    setNotes("");
    fetchRecords();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "services", id));
    fetchRecords();
  };

  const filteredRecords = records.filter((record) => {
    const matchesFilter =
      !filter || record.parts.some((p) => p.includes(filter));
    const matchesSearch = record.vehicleNo
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Generate unique part names dynamically
  const allParts = records.flatMap((r) =>
    r.parts.map((p) => (p.includes("Other:") ? "Other" : p))
  );
  const uniqueParts = [...new Set(allParts)];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Service Records</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {uniqueParts.map((part) => (
          <button
            key={part}
            className={`px-3 py-1 rounded ${
              filter === part ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(part === filter ? "" : part)}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Add Record Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-4 mb-6 w-full max-w-xl"
      >
        <h3 className="text-lg font-semibold mb-2">Add New Record</h3>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {commonParts.map((part) => (
            <label key={part} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedParts.includes(part)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedParts([...selectedParts, part]);
                  } else {
                    setSelectedParts(
                      selectedParts.filter((p) => p !== part)
                    );
                  }
                }}
              />
              {part}
            </label>
          ))}
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Other part"
            value={otherPart}
            onChange={(e) => setOtherPart(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Tyre Front"
            value={tyreFront}
            onChange={(e) => setTyreFront(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Tyre Rear"
            value={tyreRear}
            onChange={(e) => setTyreRear(e.target.value)}
            className="input w-full"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input w-full"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Record
        </button>
      </form>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by vehicle number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Vehicle No</th>
              <th className="p-2">Date</th>
              <th className="p-2">Parts Changed</th>
              <th className="p-2">Tyre Details</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.vehicleNo}</td>
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.parts.join(", ")}</td>
                <td className="p-2">
                  Front: {r.tyreFront || "—"} <br />
                  Rear: {r.tyreRear || "—"}
                </td>
                <td className="p-2">{r.notes || "—"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
