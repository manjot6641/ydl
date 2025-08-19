// AddDriverForm.jsx
import { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddDriverForm() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", remarks: "" });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "drivers"), {
      ...form,
      createdAt: Timestamp.now(),
      documents: { files: [] },
    });
    setForm({ name: "", phone: "", address: "", remarks: "" });
    setShowForm(false);
  };

  return (
    <div className="my-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        {showForm ? "Close" : "Add Driver"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-4 rounded shadow mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Address / Route"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-200"
            >
              Add Driver
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
