import { memo } from 'react';
import type { UserCardProps } from '../../types/user';

const UserCard = memo<UserCardProps>(({ user, onEdit, onDelete, isLoading = false }) => {
  const formatRole = (role: string) => {
    const roleMap = {
      admin: 'Administrador',
      manager: 'Gerente',
      volunteer: 'Voluntário'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-light rounded-circle me-3" style={{ width: '48px', height: '48px' }}>
              <div className="placeholder-glow">
                <div className="placeholder bg-secondary rounded-circle w-100 h-100"></div>
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="placeholder-glow">
                <div className="placeholder bg-secondary col-8 mb-2"></div>
                <div className="placeholder bg-secondary col-6"></div>
              </div>
            </div>
          </div>
          <div className="placeholder-glow">
            <div className="placeholder bg-secondary col-4 mb-2"></div>
            <div className="placeholder bg-secondary col-6 mb-3"></div>
          </div>
          <div className="d-flex gap-2">
            <div className="placeholder-glow flex-grow-1">
              <div className="placeholder bg-secondary w-100" style={{ height: '38px' }}></div>
            </div>
            <div className="placeholder-glow flex-grow-1">
              <div className="placeholder bg-danger w-100" style={{ height: '38px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold"
            style={{ width: '48px', height: '48px', fontSize: '18px' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1">
            <h6 className="card-title mb-1">{user.name}</h6>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>

        <div className="mb-3">
          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'manager' ? 'bg-warning' : 'bg-success'} mb-2`}>
            {formatRole(user.role)}
          </span>
          <br />
          <small className="text-muted">
            Criado em: {formatDate(user.created_at)}
          </small>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm flex-grow-1"
            onClick={() => onEdit?.(user)}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
            Editar
          </button>
          <button
            className="btn btn-outline-danger btn-sm flex-grow-1"
            onClick={() => onDelete?.(user.id)}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5.5.5 0 0 0-.5-.5V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;