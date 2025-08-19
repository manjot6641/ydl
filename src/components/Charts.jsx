import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', fuel: 5000, emi: 2000, other: 1200 },
  { name: 'Feb', fuel: 4800, emi: 2200, other: 1500 },
  { name: 'Mar', fuel: 5300, emi: 2100, other: 1100 },
  { name: 'Apr', fuel: 4700, emi: 2300, other: 1300 },
  { name: 'May', fuel: 5200, emi: 2400, other: 1400 },
];

export default function Charts() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="fuel" fill="#60a5fa" name="Fuel Cost" />
          <Bar dataKey="emi" fill="#f87171" name="EMI Paid" />
          <Bar dataKey="other" fill="#34d399" name="Other Costs" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
