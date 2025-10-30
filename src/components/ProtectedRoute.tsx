import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

  console.log('🛡️ ProtectedRoute verificando autenticação:', {
    hasToken: !!token,
    tokenPreview: token?.substring(0, 30) + '...',
    willRedirect: !token
  });

  if (!token) {
    console.warn('⚠️ ProtectedRoute: Token não encontrado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: Acesso autorizado');
  return <>{children}</>;
};

export default ProtectedRoute;