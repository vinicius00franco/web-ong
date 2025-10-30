import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/ong');
    } catch {
      setError('Login failed');
    }
  };

  return (
    <>
      <Header showAuth={false} />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 ">
            <Card className="p-3 shadow-sm">
              <Card.Header>
                <Card.Title>Login</Card.Title>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary">Login</Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/')}
                    >
                      Back to Home
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;