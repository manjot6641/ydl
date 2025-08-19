import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export default function AdvancePaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ driverName: "", amount: "", date: "", remarks: "" });

  // Realtime fetch payments
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "advancePayments"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayments(list);
    });

    return () => unsub(); // cleanup on unmount
  }, []);

  // Add new payment
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPayment.driverName || !newPayment.amount || !newPayment.date) {
      return alert("Fill required fields");
    }
    try {
      await addDoc(collection(db, "advancePayments"), {
        driverName: newPayment.driverName,
        amount: Number(newPayment.amount),
        date: Timestamp.fromDate(new Date(newPayment.date)),
        remarks: newPayment.remarks,
      });
      setNewPayment({ driverName: "", amount: "", date: "", remarks: "" });
      alert("✅ Payment added!");
    } catch (err) {
      console.error("Error adding payment:", err);
      alert("❌ Failed to add payment");
    }
  };

  // Delete driver/payment
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "advancePayments", id));
      alert("🗑️ Driver deleted!");
    } catch (err) {
      console.error("Error deleting driver:", err);
      alert("❌ Failed to delete driver");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Advance Payments
      </h2>

      {/* Add form (inline) */}
      <form onSubmit={handleAdd} className="grid grid-cols-4 gap-2 mb-4">
        <input
          type="text"
          placeholder="Driver Name"
          value={newPayment.driverName}
          onChange={(e) => setNewPayment({ ...newPayment, driverName: e.target.value })}
          className="border rounded p-2 text-sm"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newPayment.amount}
          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          className="border rounded p-2 text-sm"
          required
        />
        <input
          type="date"
          value={newPayment.date}
          onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
          className="border rounded p-2 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Remarks"
          value={newPayment.remarks}
          onChange={(e) => setNewPayment({ ...newPayment, remarks: e.target.value })}
          className="border rounded p-2 text-sm"
        />
        <button
          type="submit"
          className="col-span-4 bg-blue-600 text-white py-1 rounded mt-2"
        >
          Add Payment
        </button>
      </form>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Driver</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2 border">{p.driverName}</td>
                  <td className="p-2 border">₹{p.amount}</td>
                  <td className="p-2 border">
                    {p.date?.toDate
                      ? p.date.toDate().toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2 border">{p.remarks || "—"}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
