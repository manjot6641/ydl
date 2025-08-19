import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import {
  FaTachometerAlt,
  FaTruck,
  FaGasPump,
  FaSignOutAlt,
  FaBars,
  FaUserTie,
  FaWrench,
  FaTools,
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/vehicles', label: 'Vehicles', icon: <FaTruck /> },
    { path: '/fuel', label: 'Fuel & Mileage', icon: <FaGasPump /> },
    { path: '/drivers', label: 'Drivers', icon: <FaUserTie /> },
  { path: '/emi', label: 'EMI', icon: <RiMoneyDollarCircleLine /> },
    { path: "/services", label: "Services", icon: <FaTools /> },
  ];

  const activeClass = 'bg-gray-100 text-blue-600 font-semibold';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Topbar with Hamburger */}
      <div className="sm:hidden bg-white px-4 py-3 shadow flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-700 tracking-tight">YDL Portal</h1>
        <button onClick={() => setMobileOpen(true)}>
          <FaBars className="text-2xl text-gray-700" />
        </button>
      </div>

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 left-0 w-72 h-full bg-white shadow-lg transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-50 sm:hidden`}
      >
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">YDL</h2>
          <button
            className="text-3xl text-gray-600"
            onClick={() => setMobileOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col px-5 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base hover:bg-gray-100 ${
                location.pathname === link.path ? activeClass : ''
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg mt-4 text-base"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex flex-col w-72 h-screen bg-white border-r shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">YDL</h2>
        <nav className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-[15px] hover:bg-gray-100 ${
                location.pathname === link.path ? activeClass : ''
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg text-[15px] mt-6"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
