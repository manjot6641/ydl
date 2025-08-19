import React, { useEffect, useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { db } from "../firebase";
import VehicleForm from "../components/VehicleForm"; 
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

// helper to format Firestore dates into YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date; // already string
  if (date.toDate) {
    return date.toDate().toISOString().split("T")[0];
  }
  return "";
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showForm, setShowForm] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    regNo: "",
    owner: "",
    vehicleType: "",
    modelYear: "",
    chassisNo: "",
    engineNo: "",
    bodyType: "",
    taxPaid: "",
    taxExpiry: "",
    fitnessExpiry: "",
    registrationDate: "",
    insuranceDate: "",
    insuranceExpiry: "",
    pollutionExpiry: "",
    permitPunjabExpiry: "",
    permitNBExpiry: "",
    gpsLink: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const querySnapshot = await getDocs(collection(db, "vehicles"));
      const data = querySnapshot.docs.map((doc) => {
        const v = doc.data();
        return {
          id: doc.id,
          ...v,
          taxPaid: formatDate(v.taxPaid),
          taxExpiry: formatDate(v.taxExpiry),
          fitnessExpiry: formatDate(v.fitnessExpiry),
          registrationDate: formatDate(v.registrationDate),
          insuranceDate: formatDate(v.insuranceDate),
          insuranceExpiry: formatDate(v.insuranceExpiry),
          pollutionExpiry: formatDate(v.pollutionExpiry),
          permitPunjabExpiry: formatDate(v.permitPunjabExpiry),
          permitNBExpiry: formatDate(v.permitNBExpiry),
        };
      });
      setVehicles(data);
    };
    fetchVehicles();
  }, [refresh]);

  const handleGPS = (link) => {
    if (!link) return alert("❌ GPS link not set for this vehicle.");
    window.open(link, "_blank");
  };

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "vehicles"), {
        ...vehicleData,
        documents: {
          insuranceExpiry: vehicleData.insuranceExpiry,
          pollutionExpiry: vehicleData.pollutionExpiry,
          permitPunjabExpiry: vehicleData.permitPunjabExpiry,
        },
      });
      alert("✅ Vehicle added successfully!");
      setShowForm(false);
      setVehicleData({
        regNo: "",
        owner: "",
        vehicleType: "",
        modelYear: "",
        chassisNo: "",
        engineNo: "",
        bodyType: "",
        taxPaid: "",
        taxExpiry: "",
        fitnessExpiry: "",
        registrationDate: "",
        insuranceDate: "",
        insuranceExpiry: "",
        pollutionExpiry: "",
        permitPunjabExpiry: "",
        permitNBExpiry: "",
        gpsLink: "",
      });
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  return (
    <div className="p-6">
      {/* 🔍 Search Bar + Add Vehicle Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by Reg. No"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Vehicle
        </button>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Reg. No</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Insurance</th>
              <th className="p-2 border">Pollution</th>
              <th className="p-2 border">Permit</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((v) => (
              <tr
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-2 border">{v.regNo}</td>
                <td className="p-2 border">{v.vehicleType}</td>
                <td className="p-2 border">{v.modelYear}</td>
                <td className="p-2 border">{v.owner}</td>
                <td className="p-2 border">{v.documents?.insuranceExpiry}</td>
                <td className="p-2 border">{v.documents?.pollutionExpiry}</td>
                <td className="p-2 border">{v.documents?.permitPunjabExpiry}</td>
                <td className="p-2 border">
                  <div className="flex gap-3 justify-center items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGPS(v.gpsLink);
                      }}
                      title="Track GPS"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FiMapPin size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 🚛 Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-2xl rounded shadow-lg relative">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-2 right-2 text-red-600 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Vehicle Details - {selectedVehicle.regNo}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Owner:</strong> {selectedVehicle.owner}</p>
              <p><strong>Vehicle Type:</strong> {selectedVehicle.vehicleType}</p>
              <p><strong>Model Year:</strong> {selectedVehicle.modelYear}</p>
              <p><strong>Chassis No:</strong> {selectedVehicle.chassisNo}</p>
              <p><strong>Engine No:</strong> {selectedVehicle.engineNo}</p>
              <p><strong>Body Type:</strong> {selectedVehicle.bodyType}</p>
              <p><strong>Tax Paid:</strong> {selectedVehicle.taxPaid}</p>
              <p><strong>Tax Expiry:</strong> {selectedVehicle.taxExpiry}</p>
              <p><strong>Fitness Expiry:</strong> {selectedVehicle.fitnessExpiry}</p>
              <p><strong>Registration Date:</strong> {selectedVehicle.registrationDate}</p>
              <p><strong>Insurance Date:</strong> {selectedVehicle.insuranceDate}</p>
              <p><strong>Insurance Expiry:</strong> {selectedVehicle.documents?.insuranceExpiry}</p>
              <p><strong>Pollution Expiry:</strong> {selectedVehicle.documents?.pollutionExpiry}</p>
              <p><strong>Permit Punjab Expiry:</strong> {selectedVehicle.documents?.permitPunjabExpiry}</p>
              <p><strong>Permit NB Expiry:</strong> {selectedVehicle.permitNBExpiry}</p>
              <p><strong>GPS Link:</strong> {selectedVehicle.gpsLink ? "Available" : "Not Available"}</p>
            </div>
          </div>
        </div>
      )}

      {/* ➕ Add Vehicle Form Modal */}
{showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded shadow-lg relative">
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-2 right-2 text-red-600 text-xl"
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold mb-4">Add New Vehicle</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
      >
              <input type="text" name="regNo" placeholder="Reg. No" value={vehicleData.regNo} onChange={handleChange} className="border p-2 rounded" required />
              <input type="text" name="owner" placeholder="Owner" value={vehicleData.owner} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="vehicleType" placeholder="Vehicle Type" value={vehicleData.vehicleType} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="modelYear" placeholder="Model Year" value={vehicleData.modelYear} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="chassisNo" placeholder="Chassis No" value={vehicleData.chassisNo} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="engineNo" placeholder="Engine No" value={vehicleData.engineNo} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="bodyType" placeholder="Body Type" value={vehicleData.bodyType} onChange={handleChange} className="border p-2 rounded" />

              {/* DATE FIELDS WITH LABELS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Paid</label>
                <input type="date" name="taxPaid" value={vehicleData.taxPaid} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Expiry</label>
                <input type="date" name="taxExpiry" value={vehicleData.taxExpiry} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Expiry</label>
                <input type="date" name="fitnessExpiry" value={vehicleData.fitnessExpiry} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                <input type="date" name="registrationDate" value={vehicleData.registrationDate} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Date</label>
                <input type="date" name="insuranceDate" value={vehicleData.insuranceDate} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
                <input type="date" name="insuranceExpiry" value={vehicleData.insuranceExpiry} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pollution Expiry</label>
                <input type="date" name="pollutionExpiry" value={vehicleData.pollutionExpiry} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permit Punjab Expiry</label>
                <input type="date" name="permitPunjabExpiry" value={vehicleData.permitPunjabExpiry} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permit NB Expiry</label>
                <input type="date" name="permitNBExpiry" value={vehicleData.permitNBExpiry} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>

              <input type="text" name="gpsLink" placeholder="GPS Link" value={vehicleData.gpsLink} onChange={handleChange} className="border p-2 rounded col-span-2" />

 <div className="col-span-2 flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Vehicle
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Vehicles;
