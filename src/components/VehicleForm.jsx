import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function VehicleForm() {
  const [formData, setFormData] = useState({
    serialNumber: "",
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
    permitNbExpiry: "",
    gpsLink: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "vehicles"), formData);
      alert("Vehicle added successfully!");
      setFormData({
        serialNumber: "",
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
        permitNbExpiry: "",
        gpsLink: "",
      });
    } catch (error) {
      console.error("Error adding vehicle: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      {Object.keys(formData).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type={field.toLowerCase().includes("date") || field.toLowerCase().includes("expiry") ? "date" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Vehicle
      </button>
    </form>
  );
}
