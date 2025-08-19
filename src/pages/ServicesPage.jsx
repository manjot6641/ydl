import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import AddServiceForm from "../components/AddServiceForm";
import ServiceTable from "../components/ServiceTable";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selectedPart, setSelectedPart] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const partsList = ["Oil Filter", "Chain", "Tyres", "Engine", "Battery", "Clutch Wire", "Other"];

  useEffect(() => {
    const q = query(collection(db, "services"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredServices = services.filter((s) => {
    const vehicleMatch = s.vehicle?.toLowerCase().includes(searchTerm.toLowerCase());
    const parts = s.partsChanged || [];

    const partMatch =
      !selectedPart ||
      (selectedPart === "Other"
        ? parts.some((p) => p.toLowerCase().startsWith("other"))
        : parts.includes(selectedPart));

    return vehicleMatch && partMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Service Records</h1>

      {/* Parts Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {partsList.map((part) => (
          <button
            key={part}
            onClick={() => setSelectedPart(selectedPart === part ? "" : part)}
            className={`px-4 py-2 rounded ${
              selectedPart === part ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {part}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search by vehicle number"
          className="border px-3 py-2 rounded ml-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Record
        </button>
      </div>

      {/* Services Table */}
      <ServiceTable services={filteredServices} />

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[500px]">
            <AddServiceForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
