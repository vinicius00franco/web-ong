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
    <div>
      <Header
        title="ONG Dashboard"
        isAuthenticated={true}
        userName={user?.name}
        onLogout={handleLogout}
        showAuth={true}
      />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default OngLayout;