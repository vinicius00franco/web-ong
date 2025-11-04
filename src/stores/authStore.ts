import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

interface User {
  id: string;
  name: string;
  organization_id: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  checkTokenExpiration: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        console.log('🔐 AuthStore.login chamado:', {
          token: token?.substring(0, 20) + '...',
          user
        });
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        console.log('🚪 AuthStore.logout chamado');
        set({ token: null, user: null, isAuthenticated: false });
      },

      checkTokenExpiration: () => {
        const { token } = get();
        if (!token) return true; // Consider expired if no token

        try {
          // Decode JWT payload (base64url decode)
          const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
          );

          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          const isExpired = payload.exp < currentTime;

          if (isExpired) {
            console.warn('⏰ Token expirado, fazendo logout automático');
            get().logout();
          }

          return isExpired;
        } catch (error) {
          console.error('Erro ao verificar expiração do token:', error);
          // If we can't decode, consider it expired for security
          get().logout();
          return true;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist token and user, not computed isAuthenticated
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

// Helper hook to check authentication status
export const useIsAuthenticated = () => {
  const { isAuthenticated, checkTokenExpiration } = useAuthStore();

  // Check token expiration whenever authentication status is accessed
  useEffect(() => {
    checkTokenExpiration();
  }, [checkTokenExpiration]);

  return isAuthenticated;
};