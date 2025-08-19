import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";

const UpcomingEmis = () => {
  const [upcomingEmis, setUpcomingEmis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const emisPerPage = 10;

  useEffect(() => {
    const fetchEmis = async () => {
      const snapshot = await getDocs(collection(db, "emiRecords"));
      const today = dayjs();
      const nextWeek = today.add(7, "day");

      const emis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = emis.filter((emi) => {
        const paidDate = emi["Paid Date"];
        if (typeof paidDate !== "number") return false;

        const dueDate = dayjs().date(paidDate);
        const adjustedDueDate = dueDate.isBefore(today) ? dueDate.add(1, "month") : dueDate;

        return adjustedDueDate.isAfter(today) && adjustedDueDate.isBefore(nextWeek);
      });

      setUpcomingEmis(filtered);
    };

    fetchEmis();
  }, []);

  // Pagination Logic
  const indexOfLastEmi = currentPage * emisPerPage;
  const indexOfFirstEmi = indexOfLastEmi - emisPerPage;
  const currentEmis = upcomingEmis.slice(indexOfFirstEmi, indexOfLastEmi);
  const totalPages = Math.ceil(upcomingEmis.length / emisPerPage);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Upcoming EMIs (Next 7 Days)</h2>

      {currentEmis.length > 0 ? (
        <>
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Vehicle</th>
                <th className="p-2 border">EMI Amount</th>
                <th className="p-2 border">Paid Day</th>
                <th className="p-2 border">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {currentEmis.map((emi, index) => {
                const dueDate = dayjs().date(emi["Paid Date"]);
                const adjustedDueDate = dueDate.isBefore(dayjs())
                  ? dueDate.add(1, "month")
                  : dueDate;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{emi["Vehicle No"] || emi["Vehile No"]}</td>
                    <td className="p-2 border">₹{emi["Amount"]}</td>
                    <td className="p-2 border">{emi["Paid Date"]}</td>
                    <td className="p-2 border">{adjustedDueDate.format("DD MMM YYYY")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>No upcoming EMIs</p>
      )}
    </div>
  );
};

export default UpcomingEmis;
