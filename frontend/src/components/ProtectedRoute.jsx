import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#218838] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#252B25] font-medium">Loading FoodSave...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const rolePaths = {
      super_admin: '/dashboard/admin',
      restaurant: '/dashboard/restaurant',
      ngo: '/dashboard/ngo',
      donor: '/dashboard/donor',
      customer: '/dashboard/customer',
    };
    return <Navigate to={rolePaths[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
