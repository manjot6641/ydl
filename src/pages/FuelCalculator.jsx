import React, { useState } from "react";

const FuelCalculator = () => {
  const [activeTab, setActiveTab] = useState(1);

  // Calculator 1 states
  const [distance, setDistance] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result1, setResult1] = useState(null);

  // Calculator 2 states
  const [startMeter, setStartMeter] = useState("");
  const [endMeter, setEndMeter] = useState("");
  const [fuelUsed2, setFuelUsed2] = useState("");
  const [fuelPrice2, setFuelPrice2] = useState("");
  const [result2, setResult2] = useState(null);

  const calculateFirst = () => {
    if (distance && fuelUsed && fuelPrice) {
      const mileage = distance / fuelUsed;
      const totalCost = fuelUsed * fuelPrice;
      const costPerKm = totalCost / distance;

      setResult1({
        mileage: mileage.toFixed(2),
        totalCost: totalCost.toFixed(2),
        costPerKm: costPerKm.toFixed(2),
        dailyCost: (totalCost / 1).toFixed(2),
        weeklyCost: (totalCost * 7).toFixed(2),
        monthlyCost: (totalCost * 30).toFixed(2),
      });
    } else {
      setResult1(null);
    }
  };

  const calculateSecond = () => {
    if (startMeter && endMeter && fuelUsed2 && fuelPrice2) {
      const distance2 = endMeter - startMeter;
      const mileage = distance2 / fuelUsed2;
      const totalCost = fuelUsed2 * fuelPrice2;
      const costPerKm = totalCost / distance2;

      setResult2({
        distance: distance2,
        mileage: mileage.toFixed(2),
        totalCost: totalCost.toFixed(2),
        costPerKm: costPerKm.toFixed(2),
        dailyCost: (totalCost / 1).toFixed(2),
        weeklyCost: (totalCost * 7).toFixed(2),
        monthlyCost: (totalCost * 30).toFixed(2),
      });
    } else {
      setResult2(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      {/* Tabs */}
      <div className="flex mb-6 justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab(1)}
        >
          Fuel + Mileage (by Distance)
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 2 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab(2)}
        >
          Fuel + Mileage (by Meter Reading)
        </button>
      </div>

      {/* Calculator 1 */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="Distance Travelled (km)"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={fuelUsed}
            onChange={(e) => setFuelUsed(e.target.value)}
            placeholder="Fuel Used (litres)"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            placeholder="Fuel Price (₹/litre)"
            className="w-full border p-2 rounded"
          />
          <button
            onClick={calculateFirst}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Calculate
          </button>

          {result1 && (
            <div className="mt-4 bg-gray-100 p-4 rounded text-center space-y-1">
              <p><strong>Total Fuel Cost:</strong> ₹ {result1.totalCost}</p>
              <p><strong>Mileage:</strong> {result1.mileage} km/l</p>
              <p><strong>Cost per Km:</strong> ₹ {result1.costPerKm}</p>
              <hr className="my-2" />
              <p><strong>Daily Fuel Cost:</strong> ₹ {result1.dailyCost}</p>
              <p><strong>Weekly Fuel Cost:</strong> ₹ {result1.weeklyCost}</p>
              <p><strong>Monthly Fuel Cost:</strong> ₹ {result1.monthlyCost}</p>
            </div>
          )}
        </div>
      )}

      {/* Calculator 2 */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <input
            type="number"
            value={startMeter}
            onChange={(e) => setStartMeter(e.target.value)}
            placeholder="Start Meter Reading (km)"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={endMeter}
            onChange={(e) => setEndMeter(e.target.value)}
            placeholder="End Meter Reading (km)"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={fuelUsed2}
            onChange={(e) => setFuelUsed2(e.target.value)}
            placeholder="Fuel Used (litres)"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={fuelPrice2}
            onChange={(e) => setFuelPrice2(e.target.value)}
            placeholder="Fuel Price (₹/litre)"
            className="w-full border p-2 rounded"
          />
          <button
            onClick={calculateSecond}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Calculate
          </button>

          {result2 && (
            <div className="mt-4 bg-gray-100 p-4 rounded text-center space-y-1">
              <p><strong>Distance Travelled:</strong> {result2.distance} km</p>
              <p><strong>Total Fuel Cost:</strong> ₹ {result2.totalCost}</p>
              <p><strong>Mileage:</strong> {result2.mileage} km/l</p>
              <p><strong>Cost per Km:</strong> ₹ {result2.costPerKm}</p>
              <hr className="my-2" />
              <p><strong>Daily Fuel Cost:</strong> ₹ {result2.dailyCost}</p>
              <p><strong>Weekly Fuel Cost:</strong> ₹ {result2.weeklyCost}</p>
              <p><strong>Monthly Fuel Cost:</strong> ₹ {result2.monthlyCost}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FuelCalculator;
