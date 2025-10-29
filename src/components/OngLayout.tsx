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
    <div>
      <Header
        title="ONG Dashboard"
        isAuthenticated={true}
        userName={user?.name}
        onLogout={handleLogout}
        showAuth={true}
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <Sidebar />
          </div>
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="container mt-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OngLayout;