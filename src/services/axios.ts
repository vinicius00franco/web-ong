import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Configura a base URL do axios baseada na configuração,
// mas em desenvolvimento (Vite dev server em :5173) usamos proxy de '/api'
// para evitar CORS. Assim, mantemos as rotas começando com '/api' e deixamos
// o Vite encaminhar para o backend.
(() => {
  const cfg = import.meta.env;
  let baseURL = cfg.VITE_API_BASE_URL || 'http://localhost:3000';

  // Em dev no Vite, prefira baseURL relativa para usar o proxy do Vite
  if (cfg.VITE_NODE_ENV === 'development' && typeof window !== 'undefined') {
    const isViteDev = window.location && window.location.port === '5173';
    if (isViteDev) {
      baseURL = '';
    }
  }

  axios.defaults.baseURL = baseURL;
})();

// Configura timeout padrão
axios.defaults.timeout = 10000;

// Configura headers padrão
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para adicionar token de autenticação automaticamente
axios.interceptors.request.use((config) => {
  // Get token from Zustand store instead of localStorage
  const { token } = useAuthStore.getState();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros globais
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 Axios Error Interceptor:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      hasToken: !!useAuthStore.getState().token
    });

    if (error.response?.status === 401) {
      const { checkTokenExpiration } = useAuthStore.getState();

      // Only logout if token is actually expired, not just any 401 error
      if (checkTokenExpiration()) {
        console.warn('⏰ Token expirado - redirecionando para login');
        // Clear auth state
        useAuthStore.getState().logout();
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else {
        console.warn('⚠️ Recebido 401 mas token não está expirado - pode ser erro de permissão');
        // Don't logout, just reject the promise
      }
    }
    return Promise.reject(error);
  }
);

export default axios;