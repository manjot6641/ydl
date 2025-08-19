import React from 'react';

export default function DashboardCard({ icon, title, value, color }) {
  return (
    <div className={`bg-white p-4 rounded-2xl shadow-md flex items-center gap-4 border-l-4 ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
