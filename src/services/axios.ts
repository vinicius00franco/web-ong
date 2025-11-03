import axios from 'axios';
import { configManager } from '../config/app.config';

// Configura a base URL do axios baseada na configuração
axios.defaults.baseURL = configManager.getConfig().apiBaseUrl;

// Configura timeout padrão
axios.defaults.timeout = 10000;

// Configura headers padrão
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para adicionar token de autenticação automaticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros globais
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - limpar dados de autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Recarregar a página para redirecionar para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;