import axios from 'axios';
import './axios-logger';
import type { LoginCredentials, LoginResponse, User } from '../types/entities';
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

  async getCurrentUser(token: string): Promise<User> {
    if (this.useMock) {
      return mockAuthService.getCurrentUser(token);
    }

    const { data } = await axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
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
