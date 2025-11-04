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
  // Don't attach auth for public endpoints
  const url = config.url || '';
  const isPublic = url.startsWith('/api/public/') || url.startsWith('/public/');

  if (!isPublic) {
    const { token } = useAuthStore.getState();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratamento de erros globais
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silent axios error interceptor (logs removidos)

    if (error.response?.status === 401) {
      const { token, checkTokenExpiration, logout } = useAuthStore.getState();

      // If there's no token, this was an unauthenticated request (public endpoint)
      // — don't force a logout/redirect. Let the caller handle the error.
      if (!token) {
        return Promise.reject(error);
      }

      // If there's a token, only logout when it's actually expired
      if (checkTokenExpiration()) {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;