import type { User } from './entities';

/**
 * Filtros para busca de usuários
 */
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: User['role'];
  organization_id?: string;
}

/**
 * Resposta paginada da API de usuários
 */
export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Dados para criação de um novo usuário
 */
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  organization_id: string;
}

/**
 * Dados para atualização de um usuário
 */
export interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  role?: User['role'];
  organization_id?: string;
}

/**
 * Props para componentes de usuário
 */
export interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  isLoading?: boolean;
}

export interface UsersListProps {
  users: User[];
  loading: boolean;
  error?: string;
  onUserEdit: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onRefresh: () => void;
}