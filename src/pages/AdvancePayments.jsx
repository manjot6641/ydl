import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import AddAdvancePaymentForm from "../components/AddAdvancePaymentForm";

export default function AdvancePayments() {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchPayments = async () => {
    const snap = await getDocs(collection(db, "advancePayments"));
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPayments(list);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advance Payments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Payment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-4">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 border">Driver</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2 border">{p.driverName}</td>
                <td className="p-2 border">₹{p.amount}</td>
                <td className="p-2 border">
                  {p.date?.toDate
                    ? p.date.toDate().toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-2 border">{p.remarks || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <AddAdvancePaymentForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchPayments}
        />
      )}
    </div>
  );
}


