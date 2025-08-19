import React, { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Topbar() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="w-full bg-white border-b px-4 py-3 flex justify-between items-center sm:px-6 shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="sm:hidden focus:outline-none"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight">
          Business Dashboard
        </h1>
      </div>

      {/* Right side */}
      <div className="text-gray-600 text-sm sm:text-base font-medium flex items-center gap-2">
        <span className="hidden sm:inline-block">Welcome, Admin</span>
        <span className="text-xl">👤</span>
      </div>
    </div>
  );
}
