import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, checkTokenExpiration } = useAuthStore();

  // Check token expiration before allowing access
  const isTokenExpired = checkTokenExpiration();

  console.log('🛡️ ProtectedRoute verificando autenticação:', {
    hasToken: !!token,
    tokenPreview: token?.substring(0, 30) + '...',
    isTokenExpired,
    willRedirect: !token || isTokenExpired
  });

  if (!token || isTokenExpired) {
    console.warn('⚠️ ProtectedRoute: Token não encontrado ou expirado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: Acesso autorizado');
  return <>{children}</>;
};

export default ProtectedRoute;