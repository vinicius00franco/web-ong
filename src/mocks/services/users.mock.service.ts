import type { User } from '../../types/entities';
import type { UserFilters, UsersResponse, CreateUserData, UpdateUserData } from '../../types/user';

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
 * Gera ID único para novos usuários
 */
const generateId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Service de usuários mockados
 */
class MockUsersService {
  private users: User[] = [...usersData as User[]];

  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    await simulateDelay();

    let filtered = [...this.users];

    // Filtro por busca (nome ou email)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por role
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Filtro por organization_id
    if (filters.organization_id) {
      filtered = filtered.filter(user => user.organization_id === filters.organization_id);
    }

    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      data: paginatedUsers,
      total: filtered.length,
      page,
      limit,
      totalPages
    };
  }

  async getUser(id: string): Promise<User> {
    await simulateDelay();

    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    await simulateDelay();

    // Verifica se email já existe
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      organization_id: userData.organization_id,
      role: userData.role,
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userData: UpdateUserData): Promise<User> {
    await simulateDelay();

    const userIndex = this.users.findIndex(u => u.id === userData.id);
    if (userIndex === -1) {
      throw new Error(`User with id ${userData.id} not found`);
    }

    // Verifica se email já existe (exceto para o próprio usuário)
    if (userData.email) {
      const existingUser = this.users.find(u => u.email === userData.email && u.id !== userData.id);
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...userData,
      id: userData.id // Garante que o ID não seja sobrescrito
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await simulateDelay();

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }

  /**
   * Reseta os dados mockados ao estado inicial
   */
  reset(): void {
    this.users = [...usersData as User[]];
  }
}

export const mockUsersService = new MockUsersService();