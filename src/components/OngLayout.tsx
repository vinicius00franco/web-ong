import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';

const OngLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header
        title="ONG Dashboard"
        isAuthenticated={true}
        userName={user?.name}
        onLogout={handleLogout}
        showAuth={true}
      />
      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          <main className="col-12 px-4 py-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OngLayout;