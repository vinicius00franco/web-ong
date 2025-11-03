import axios from 'axios';
import './axios-logger';
import type { User } from '../types/entities';
import type { CreateUserData, UpdateUserData, UserFilters, UsersResponse } from '../types/user';
import { configManager } from '../config/app.config';
import { mockUsersService } from '../mocks';

/**
 * Service de usuários com suporte a dados mockados ou API real
 */
class UsersService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    if (this.useMock) {
      return mockUsersService.getUsers(filters);
    }

    const { data } = await axios.get('/api/users', {
      params: { page: 1, limit: 10, ...filters }
    });
    return data;
  }

  async getUser(id: string): Promise<User> {
    if (this.useMock) {
      return mockUsersService.getUser(id);
    }

    const { data } = await axios.get(`/api/users/${id}`);
    return data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    if (this.useMock) {
      return mockUsersService.createUser(userData);
    }

    const { data } = await axios.post('/api/users', userData);
    return data;
  }

  async updateUser(userData: UpdateUserData): Promise<User> {
    if (this.useMock) {
      return mockUsersService.updateUser(userData);
    }

    const { id, ...updateData } = userData;
    const { data } = await axios.put(`/api/users/${id}`, updateData);
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    if (this.useMock) {
      return mockUsersService.deleteUser(id);
    }

    await axios.delete(`/api/users/${id}`);
  }
}

export const usersService = new UsersService();