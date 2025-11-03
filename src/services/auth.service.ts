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

  /**
   * Converte a resposta de login da API para o formato esperado pelo frontend
   * API retorna: { success: true, data: { accessToken: "...", organizationId: 1 } }
   * Axios interceptor envolve em .data novamente
   */
  private mapLoginResponse(apiResponseBody: any): LoginResponse {
    // apiResponseBody é o .data da resposta do axios
    // Estrutura: { success: true, data: { accessToken, organizationId } }
    
    const token = apiResponseBody.data?.accessToken || apiResponseBody.accessToken;
    
    if (!token) {
      console.error('Token não encontrado. Response:', apiResponseBody);
      throw new Error('Token não encontrado na resposta');
    }

    const decoded = this.decodeJWT(token);

    return {
      token,
      user: {
        id: String(decoded.sub),
        name: decoded.email,
        email: decoded.email,
        organization_id: String(decoded.organizationId),
        role: 'admin',
        created_at: new Date().toISOString()
      }
    };
  }

  /**
   * Decodifica um JWT (sem validar assinatura, apenas extrai payload)
   */
  private decodeJWT(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token inválido');
      }

      const decoded = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );

      return decoded;
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      throw new Error('Falha ao processar token');
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (this.useMock) {
      return mockAuthService.login(credentials);
    }

    try {
      const response = await axios.post('/api/auth/login', credentials);
      // axios interceptor já desembrulha .data, então response aqui é { success, data: { accessToken, ... } }
      return this.mapLoginResponse(response.data);
    } catch (error: any) {
      console.error('Erro na requisição de login:', error);
      throw new Error('Email ou senha inválidos');
    }
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

    try {
      const response = await axios.post('/api/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Erro na requisição de registro:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Falha no registro. Tente novamente.');
    }
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
