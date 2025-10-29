import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // Logout logic handled by Header component
  };

  return (
    <>
      <Header
        isAuthenticated={!!token}
        userName={user?.name}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-8">
            <Card>
              <Card.Header>
                <Card.Title>Welcome to ONG Web App</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  This is a platform designed to help NGOs manage their operations efficiently.
                  Join us in making a difference in the world.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate('/about')}>Learn More</Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card>
              <Card.Body>
                <Card.Title>Get Started</Card.Title>
                <Card.Text>
                  Ready to make an impact? Join our platform today.
                </Card.Text>
                {!token ? (
                  <Button variant="success" onClick={handleLogin}>Sign Up</Button>
                ) : (
                  <Button variant="info" onClick={() => navigate('/ong')}>Dashboard</Button>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;