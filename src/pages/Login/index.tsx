import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await authService.login({ email, password });
      login(token, user);
      navigate('/ong');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setLoading(false);
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  {/* Dica para usuários de desenvolvimento */}
                  <div className="alert alert-info" role="alert">
                    <small>
                      <strong>💡 Credenciais de teste:</strong><br />
                      Email: admin@ong.com | Senha: admin123<br />
                      Email: maria@ong.com | Senha: maria123
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Entrando...' : 'Login'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/')}
                      disabled={loading}
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