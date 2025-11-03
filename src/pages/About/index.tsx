import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';

const About: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <Header
        isAuthenticated={!!token}
        userName={user?.name}
        onLogin={handleLogin}
      />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <Card.Title>About Our Platform</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Our ONG Web App is designed to empower non-governmental organizations 
                  with the tools they need to manage their operations effectively and 
                  make a greater impact in their communities.
                </Card.Text>
                <Card.Text>
                  We provide a comprehensive platform that includes project management, 
                  volunteer coordination, donation tracking, and reporting capabilities.
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>Home</Button>
                  {!token && (
                    <Button variant="success" onClick={handleLogin}>Get Started</Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;