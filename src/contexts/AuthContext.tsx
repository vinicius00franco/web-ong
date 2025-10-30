import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  // Using custom hook for better localStorage management
  const [token, setToken, removeToken] = useLocalStorage<string | null>('token', null);
  const [user, setUser, removeUser] = useLocalStorage<User | null>('user', null);

  const login = (newToken: string, newUser: User) => {
    console.log('🔐 AuthContext.login chamado:', { 
      token: newToken?.substring(0, 20) + '...', 
      user: newUser 
    });
    setToken(newToken);
    setUser(newUser);
    
    // Verificar se foi salvo no localStorage
    setTimeout(() => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('✅ Verificação pós-login:', {
        tokenSalvo: savedToken ? 'SIM' : 'NÃO',
        userSalvo: savedUser ? 'SIM' : 'NÃO',
        tokenValue: savedToken?.substring(0, 30) + '...'
      });
    }, 100);
  };

  const logout = () => {
    console.log('🚪 AuthContext.logout chamado');
    removeToken();
    removeUser();
  };

  // Log do estado atual
  React.useEffect(() => {
    console.log('🔄 Estado AuthContext atualizado:', {
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