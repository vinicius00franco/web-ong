import { memo, useState } from 'react';
import UserCard from '../../components/UserCard';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import ConfirmationModal from '../../components/ConfirmationModal';
import type { UsersListProps } from '../../types/user';

const UsersList = memo<UsersListProps>(({
  users,
  loading,
  error,
  onUserEdit,
  onUserDelete,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDeleteConfirmation = (userId: string) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await onUserDelete(userToDelete);
      onRefresh();
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  if (error) {
    return (
      <ErrorMessage
        message={`Erro ao carregar usuários: ${error}`}
      />
    );
  }

  if (loading) {
    return (
      <div className="row" role="status" aria-live="polite" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="col-12 col-sm-6 col-md-4 mb-4" key={index}>
            <UserCard
              user={{
                id: `loading-${index}`,
                name: '',
                email: '',
                organization_id: '',
                role: 'volunteer',
                created_at: ''
              }}
              onEdit={() => {}}
              onDelete={() => {}}
              isLoading={true}
            />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        message="Nenhum usuário encontrado."
      />
    );
  }

  return (
    <>
      <div className="row">
        {users.map((user) => (
          <div className="col-12 col-sm-6 col-md-4 mb-4" key={user.id}>
            <UserCard
              user={user}
              onEdit={onUserEdit}
              onDelete={handleDeleteConfirmation}
              isLoading={loading}
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ConfirmationModal
          title="Confirmar exclusão"
          message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
});

UsersList.displayName = 'UsersList';

export default UsersList;