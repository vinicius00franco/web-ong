import type { LoginCredentials, LoginResponse, User } from '../../types/entities';
import usersData from '../data/users.mock.json';
import { configManager } from '../../config/app.config';

/**
 * Simula latência de rede
 */
const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Gera token fake JWT
 */
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
  const signature = btoa(`mock-signature-${userId}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Service de autenticação mockado
 */
class MockAuthService {
  private users: User[] = usersData.map(({ password, ...user }) => user as User);
  private usersWithPassword = usersData;

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await simulateDelay();

    const user = this.usersWithPassword.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Remove senha antes de retornar
    const { password, ...userWithoutPassword } = user;

    return {
      token: generateToken(user.id),
      user: userWithoutPassword as User,
    };
  }

  async getCurrentUser(token: string): Promise<User> {
    await simulateDelay();

    // Extrai userId do token fake
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = this.users.find(u => u.id === payload.userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch {
      throw new Error('Token inválido');
    }
  }

  async logout(): Promise<void> {
    await simulateDelay();
    // Mock não precisa fazer nada no logout
  }
}

export const mockAuthService = new MockAuthService();
