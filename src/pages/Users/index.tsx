import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import UsersList from '../../components/UsersList';
import UserFormModal from '../../components/UserFormModal';
import Breadcrumbs from '../../components/Breadcrumbs';
import type { User } from '../../types/entities';
import type { CreateUserData, UpdateUserData } from '../../types/user';

const UsersListPage = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/ong' },
    { label: 'Usuários', href: '/ong/users' },
  ];

  const handleUserEdit = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleUserDelete = async (userId: string) => {
    return await deleteUser(userId);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (userData: Omit<User, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Editar usuário existente
        const updateData: UpdateUserData = {
          id: editingUser.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          organization_id: userData.organization_id
        };
        await updateUser(updateData);
      } else {
        // Criar novo usuário - usa uma senha padrão que o usuário pode alterar
        const createData: CreateUserData = {
          name: userData.name,
          email: userData.email,
          password: 'Senha123!', // TODO: Gerar senha aleatória ou pedir ao usuário
          role: userData.role,
          organization_id: userData.organization_id
        };
        await createUser(createData);
      }
      // Recarregar lista após sucesso
      await fetchUsers();
      setShowFormModal(false);
      setEditingUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Usuários da Organização</h2>
          <p className="text-muted mb-0">
            Gerencie os usuários da sua organização
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCreateUser}
          disabled={loading || isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Novo Usuário
        </button>
      </div>

      {/* Filtros e busca podem ser adicionados aqui no futuro */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nome ou email..."
                disabled={loading}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" disabled={loading}>
                <option value="">Todos os papéis</option>
                <option value="admin">Administrador</option>
                <option value="manager">Gerente</option>
                <option value="volunteer">Voluntário</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleRefresh}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-primary">{users.length}</h3>
              <p className="card-text text-muted">Total de Usuários</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-danger">
                {users.filter(u => u.role === 'admin').length}
              </h3>
              <p className="card-text text-muted">Administradores</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-warning">
                {users.filter(u => u.role === 'manager').length}
              </h3>
              <p className="card-text text-muted">Gerentes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title text-success">
                {users.filter(u => u.role === 'volunteer').length}
              </h3>
              <p className="card-text text-muted">Voluntários</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuários */}
      <UsersList
        users={users}
        loading={loading}
        error={error || undefined}
        onUserEdit={handleUserEdit}
        onUserDelete={handleUserDelete}
        onRefresh={handleRefresh}
      />

      {/* Modal de criação/edição */}
      <UserFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default UsersListPage;