import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickRoleSwitcher from './components/QuickRoleSwitcher';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import AvailableFood from './pages/AvailableFood';
import DonateFood from './pages/DonateFood';
import PartnerRestaurants from './pages/PartnerRestaurants';
import ImpactStats from './pages/ImpactStats';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Role Dashboards
import RestaurantDashboard from './pages/dashboards/RestaurantDashboard';
import NgoDashboard from './pages/dashboards/NgoDashboard';
import DonorDashboard from './pages/dashboards/DonorDashboard';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#F8FAF5] text-[#252B25] antialiased">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/available-food" element={<AvailableFood />} />
              <Route path="/donate-food" element={<DonateFood />} />
              <Route path="/partner-restaurants" element={<PartnerRestaurants />} />
              <Route path="/impact" element={<ImpactStats />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Role-Protected Dashboards */}
              <Route
                path="/dashboard/restaurant/*"
                element={
                  <ProtectedRoute allowedRoles={['restaurant', 'super_admin']}>
                    <RestaurantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ngo/*"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'super_admin']}>
                    <NgoDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/donor/*"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'super_admin']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/customer/*"
                element={
                  <ProtectedRoute allowedRoles={['customer', 'super_admin']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <QuickRoleSwitcher />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
