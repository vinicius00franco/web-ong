import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {title}
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
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
                  {/* Desktop: mostra nome e botão */}
                  <span className="navbar-text me-3 d-none d-lg-inline">
                    Bem-vindo(a), {userName}
                  </span>
                  <Button variant="danger" className="d-none d-lg-block" onClick={onLogout}>
                    Logout
                  </Button>
                  
                  {/* Mobile: ícone de usuário com dropdown */}
                  <div className="dropdown d-lg-none">
                    <button
                      className="btn btn-link nav-link dropdown-toggle"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li className="dropdown-item-text">
                        <small>Bem-vindo(a), {userName}</small>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={onLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop: botão de login */}
                  <Button variant="primary" className="d-none d-lg-block" onClick={onLogin}>
                    Login
                  </Button>
                  
                  {/* Mobile: ícone de login */}
                  <button
                    className="btn btn-link nav-link d-lg-none"
                    onClick={onLogin}
                    aria-label="Login"
                  >
                    <i className="bi bi-box-arrow-in-right" style={{ fontSize: '1.5rem' }}></i>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;