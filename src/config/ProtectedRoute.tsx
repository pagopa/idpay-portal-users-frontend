import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import ROUTES from '../routes';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;