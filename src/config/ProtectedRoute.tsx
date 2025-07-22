import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Caricamento sessione...</div>;
  }

  if (!isAuthenticated) {
    return <div>Reindirizzamento al login...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;