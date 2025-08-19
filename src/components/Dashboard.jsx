import React from 'react';
import PushSetup from "../components/PushSetup";
import {
  Truck,
  Users,
  FileText,
  Fuel,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const cards = [
    {
      title: 'Total Vehicles',
      value: 12,
      icon: <Truck className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Drivers',
      value: 8,
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      title: 'Documents Expiring Soon',
      value: 3,
      icon: <FileText className="w-6 h-6 text-red-600" />,
    },
    {
      title: 'Fuel & Mileage',
      value: '1200 km',
      icon: <Fuel className="w-6 h-6 text-yellow-500" />,
    },
    {
      title: 'Services Due',
      value: 2,
      icon: <Settings className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 flex items-center space-x-4 hover:shadow-lg transition"
          >
            <div>{card.icon}</div>
            <div>
              <h4 className="text-sm text-gray-500">{card.title}</h4>
              <p className="text-xl font-semibold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Push Notification Setup Component */}
      <PushSetup />
    </div>
  );
};

export default Dashboard;
