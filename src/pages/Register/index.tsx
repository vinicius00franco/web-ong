import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ROUTES } from '../../config/routes';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Register: Formulário submetido', { name, email });

    try {
      console.log('🔄 Register: Chamando authService.register...');
      await authService.register({ name, email, password });

      console.log('✅ Register: Registro realizado com sucesso');

      // Redirecionar para login após registro bem-sucedido
      console.log('🧭 Register: Redirecionando para login...');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('❌ Register: Erro durante registro:', err);
      setError(err instanceof Error ? err.message : 'Falha no registro');
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
                <Card.Title>Registrar Nova Organização</Card.Title>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome da Organização</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      minLength={2}
                    />
                  </div>
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
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Registrando...' : 'Registrar'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(ROUTES.LOGIN)}
                      disabled={loading}
                    >
                      Já tem conta? Fazer Login
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate(ROUTES.HOME)}
                      disabled={loading}
                    >
                      Voltar ao Início
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

export default Register;