import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

export default function AddAdvancePaymentForm({ onClose, onSuccess }) {
  const [driverName, setDriverName] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    // ✅ Fetch driver names from drivers collection for dropdown
    const fetchDrivers = async () => {
      const snap = await getDocs(collection(db, "drivers"));
      const driverList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driverList);
    };
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverName || !amount || !date) return alert("Fill all required fields");

    try {
      await addDoc(collection(db, "advancePayments"), {
        driverName,
        amount: Number(amount),
        date: Timestamp.fromDate(new Date(date)),
        remarks,
      });
      alert("✅ Payment added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding payment:", err);
      alert("❌ Failed to add payment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Advance Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Driver Dropdown */}
          <div>
            <label className="block text-sm font-medium">Driver</label>
            <select
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Fuel advance, Food, etc."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
