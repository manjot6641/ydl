import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddServiceForm({ onClose, onSave }) {
  const [vehicle, setVehicle] = useState("");
  const [date, setDate] = useState("");
  const [partsChanged, setPartsChanged] = useState([]);
  const [customPart, setCustomPart] = useState("");
  const [notes, setNotes] = useState("");

  const togglePart = (part) => {
    setPartsChanged((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalParts = [...partsChanged];
    if (customPart.trim()) {
      finalParts.push(`Other: ${customPart}`);
    }

    await addDoc(collection(db, "services"), {
      vehicle,
      date,
      partsChanged: finalParts,
      notes,
      createdAt: Timestamp.now(),
    });

    if (onSave) onSave(); // ✅ Call callback to refresh list
    onClose(); // ✅ Close modal
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Vehicle No."
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <div className="flex gap-2 flex-wrap">
        {["Oil Filter", "Chain", "Tyres", "Engine", "Battery", "Clutch Wire"].map((part) => (
          <button
            type="button"
            key={part}
            onClick={() => togglePart(part)}
            className={`px-3 py-1 rounded border ${
              partsChanged.includes(part)
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Other part (optional)"
        value={customPart}
        onChange={(e) => setCustomPart(e.target.value)}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 w-full"
      />

      <div className="flex justify-between">
        <button type="button" onClick={onClose} className="text-gray-500">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
}
