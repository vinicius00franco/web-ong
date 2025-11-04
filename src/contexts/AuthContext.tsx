import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: string;
  name: string;
  organization_id: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use Zustand store for state management
  const { token, user, login, logout } = useAuthStore();

  // Log do estado atual
  React.useEffect(() => {
    console.log('🔄 AuthContext estado atualizado:', {
      isAuthenticated: !!token,
      hasUser: !!user,
      token: token?.substring(0, 20) + '...'
    });
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};