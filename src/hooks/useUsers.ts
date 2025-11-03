import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/users.service';
import type { User } from '../types/entities';
import type { CreateUserData, UpdateUserData, UserFilters, UsersResponse } from '../types/user';

/**
 * Hook customizado para gerenciar usuários da organização
 */
export const useUsers = (initialFilters: UserFilters = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [pagination, setPagination] = useState<Omit<UsersResponse, 'data'>>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  /**
   * Busca usuários com filtros aplicados
   */
  const fetchUsers = useCallback(async (searchFilters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = searchFilters || filters;
      const response = await usersService.getUsers(currentFilters);

      setUsers(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMessage);
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Atualiza filtros e busca usuários
   */
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchUsers(updatedFilters);
  }, [filters, fetchUsers]);

  /**
   * Cria um novo usuário
   */
  const createUser = useCallback(async (userData: CreateUserData): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const newUser = await usersService.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));

      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(errorMessage);
      console.error('Erro ao criar usuário:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza um usuário existente
   */
  const updateUser = useCallback(async (userData: UpdateUserData): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await usersService.updateUser(userData);
      setUsers(prev => prev.map(user =>
        user.id === userData.id ? updatedUser : user
      ));

      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      console.error('Erro ao atualizar usuário:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove um usuário
   */
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await usersService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir usuário';
      setError(errorMessage);
      console.error('Erro ao excluir usuário:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca um usuário específico por ID
   */
  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      setError(null);
      const user = await usersService.getUser(userId);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar usuário';
      setError(errorMessage);
      console.error('Erro ao buscar usuário:', err);
      return null;
    }
  }, []);

  /**
   * Limpa erro atual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Busca inicial
  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Estado
    users,
    loading,
    error,
    filters,
    pagination,

    // Ações
    fetchUsers,
    updateFilters,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    clearError,

    // Utilitários
    hasUsers: users.length > 0,
    isEmpty: users.length === 0 && !loading,
    hasError: error !== null
  };
};