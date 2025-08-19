import React, { useEffect, useState } from 'react';
import { FaTruck, FaUserTie, FaExclamationTriangle, FaWrench } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import emiRecords from '../data/emiRecords.json';
import UpcomingEmis from '../components/UpcomingEmis';
import AdvancePaymentsTable from "../components/AdvancePaymentsTable";


export default function Dashboard() {
  const [vehicleCount, setVehicleCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [emiCount, setEmiCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Vehicles
      const vehicleSnap = await getDocs(collection(db, 'vehicles'));
      setVehicleCount(vehicleSnap.size);

      // Fetch Drivers
      const driverSnap = await getDocs(collection(db, 'drivers'));
      setDriverCount(driverSnap.size);

      // Check Services
      const serviceSnap = await getDocs(collection(db, 'services'));
      setServiceCount(serviceSnap.size);

      // EMI Count (next 7 days)
      const now = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(now.getDate() + 7);
      let upcomingCount = 0;

      emiRecords.forEach((record) => {
        const paidDay = parseInt(record['Paid Date']);
        if (!isNaN(paidDay)) {
          const due = new Date(now);
          due.setDate(paidDay);
          if (due < now) {
            due.setMonth(due.getMonth() + 1);
            due.setDate(paidDay);
          }

          if (due >= now && due <= sevenDaysLater) {
            upcomingCount++;
          }
        }
      });

      setEmiCount(upcomingCount);
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total Vehicles',
      count: vehicleCount,
      icon: <FaTruck className="text-blue-500 text-4xl" />,
      onClick: () => navigate('/vehicles'),
    },
    {
      title: 'Total Drivers',
      count: driverCount,
      icon: <FaUserTie className="text-green-500 text-4xl" />,
      onClick: () => navigate('/drivers'),
    },
    {
      title: 'Services',
      count: serviceCount,
      icon: <FaWrench className="text-purple-500 text-4xl" />,
      onClick: () => navigate('/services'),
    },
    {
      title: 'Upcoming EMIs',
      count: emiCount > 0 ? emiCount : 'Check below',
      icon: <FaExclamationTriangle className="text-red-500 text-4xl" />,
      onClick: () => navigate('/emi'),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition duration-200 cursor-pointer border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">{card.icon}</div>
              <div>
                <h4 className="text-gray-500 text-sm">{card.title}</h4>
                <p className="text-2xl font-semibold text-gray-800">
                  {card.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advance Payments + EMIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvancePaymentsTable />
        <UpcomingEmis />
      </div>
    </div>
  );
}
