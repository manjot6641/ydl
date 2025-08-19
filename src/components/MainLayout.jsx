import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => (
  <div className="flex flex-col sm:flex-row bg-gray-100 min-h-screen">
    <Sidebar />
    <div className="flex-1">
      <Topbar />
      <Outlet />
    </div>
  </div>
);

export default MainLayout;
