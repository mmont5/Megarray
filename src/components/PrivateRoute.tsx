import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireSubscription = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If subscription is required and user doesn't have an active plan
  if (requireSubscription && user.plan === 'none') {
    return <Navigate to="/signup/plan" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;