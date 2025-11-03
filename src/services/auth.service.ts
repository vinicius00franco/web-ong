import axios from './axios';
import './axios-logger';
import type { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse, User } from '../types/entities';
import { configManager } from '../config/app.config';
import { mockAuthService } from '../mocks';

/**
 * Service de autenticação com suporte a dados mockados ou API real
 */
class AuthService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (this.useMock) {
      return mockAuthService.login(credentials);
    }

    const { data } = await axios.post('/api/auth/login', credentials);
    return data;
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    if (this.useMock) {
      // Mock register - simula erro se email já existir
      if (credentials.email === 'existing@example.com') {
        throw new Error('Email já cadastrado');
      }
      return {
        success: true,
        data: {
          id: Date.now(),
          name: credentials.name,
          email: credentials.email
        }
      };
    }

    const { data } = await axios.post('/api/auth/register', credentials);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    if (this.useMock) {
      // Para mock, retorna dados básicos do usuário atual
      // Em um cenário real, isso viria do contexto de autenticação
      return {
        id: 'user-mock',
        name: 'Usuário Mock',
        email: 'mock@example.com',
        organization_id: 'org-mock',
        role: 'admin',
        created_at: new Date().toISOString()
      };
    }

    const { data } = await axios.get('/api/auth/me');
    return data;
  }

  async logout(): Promise<void> {
    if (this.useMock) {
      return mockAuthService.logout();
    }

    await axios.post('/api/auth/logout');
  }
}

export const authService = new AuthService();
