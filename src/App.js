import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import FuelCalculator from './pages/FuelCalculator';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import ServicesPage from './pages/ServicesPage';
import UploadEMIData from './components/UploadEMIData'; // ✅ Already imported
import EMIPage from './pages/EMIPage'; // ✅ Already imported
import UpdateNotifyPhones from './components/UpdateNotifyPhones';
import DriversPage from './pages/DriversPage'; // ✅ NEW: Added for Drivers tab

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with layout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/fuel" element={<FuelCalculator />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/emi" element={<EMIPage />} /> {/* ✅ EMI Page */}
          <Route path="/drivers" element={<DriversPage />} /> {/* ✅ NEW: Drivers Page */}
        </Route>

        {/* ✅ TEMP ROUTE to upload data */}
        <Route path="/emi-upload" element={<UploadEMIData />} />
        <Route path="/update-notify" element={<UpdateNotifyPhones />} />
      </Routes>
    </Router>
  );
}

export default App;
