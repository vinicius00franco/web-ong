import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import './index.scss';

interface HeaderProps {
  title?: string;
  showAuth?: boolean;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'ONG Web App',
  showAuth = true,
  isAuthenticated = false,
  onLogin,
  onLogout,
  userName
}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {title}
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
          </ul>
          
          {showAuth && (
            <div className="navbar-nav">
              {isAuthenticated ? (
                <>
                  <span className="navbar-text me-3">
                    Welcome, {userName}
                  </span>
                  <Button variant="danger" onClick={onLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={onLogin}>
                  Login
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;