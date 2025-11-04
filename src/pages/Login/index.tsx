import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ROUTES } from '../../config/routes';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ONG.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Login: Formulário submetido', { email });

    try {
      console.log('🔄 Login: Chamando authService.login...');
      const { token, user } = await authService.login({ email, password });
      
      console.log('✅ Login: Resposta recebida do serviço:', {
        hasToken: !!token,
        tokenPreview: token?.substring(0, 30) + '...',
        user
      });
      
      console.log('🔐 Login: Chamando context.login...');
      login(token, user);
      
      console.log('🧭 Login: Navegando para /ong...');
      navigate(ROUTES.ONG.DASHBOARD);
    } catch (err) {
      console.error('❌ Login: Erro durante autenticação:', err);
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
                      <strong>💡 Credenciais de teste (do banco de dados):</strong><br />
                      ONG A: onga@example.com | Senha: password<br />
                      ONG B: ongb@example.com | Senha: password<br />
                      <br />
                      <strong>📝 Ou registre uma nova ONG:</strong><br />
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => navigate(ROUTES.REGISTER)}
                      >
                        Criar nova conta
                      </button>
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Entrando...' : 'Login'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate(ROUTES.HOME)}
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