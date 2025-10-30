import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

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
          <div className="col-md-3 col-lg-2 d-none d-md-block bg-light p-0">
            <Sidebar />
          </div>
          <main className="col-md-9 col-lg-10 px-4 py-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OngLayout;