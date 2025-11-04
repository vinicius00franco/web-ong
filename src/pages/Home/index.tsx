import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { publicProductsService } from '../../services/public-products.service';
import { publicSearchService } from '../../services/public-search.service';
import type { ProductsResponse } from '../../types/product';
import { ROUTES } from '../../config/routes';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [productsRes, setProductsRes] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [interpretationText, setInterpretationText] = useState<string | null>(null);

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleLogout = () => {
    // Logout logic handled by Header component
  };

  // Carrega catálogo público inicial (RN-PUB-01)
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      setInterpretationText(null);
      try {
        const res = await publicProductsService.getProducts();
        if (active) setProductsRes(res);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Erro ao carregar produtos');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await publicSearchService.search(query);
      setProductsRes({
        products: res.products,
        total: res.products.length,
        page: 1,
        limit: res.products.length || 12,
        totalPages: 1,
      });
      if (res.interpretation) {
        const parts: string[] = [];
        if (res.interpretation.category) parts.push(`Categoria=${res.interpretation.category}`);
        if (typeof res.interpretation.priceMax === 'number') parts.push(`Preço ≤ ${res.interpretation.priceMax}`);
        if (typeof res.interpretation.priceMin === 'number') parts.push(`Preço ≥ ${res.interpretation.priceMin}`);
        setInterpretationText(parts.length ? `Resultados para: ${parts.join('; ')}` : null);
      } else {
        // Fallback aplicado (RN-BUSCA-04): mostrar resultados normalmente, sem interpretação
        setInterpretationText(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro na busca');
    } finally {
      setLoading(false);
    }
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
                <Button variant="primary" onClick={() => navigate(ROUTES.ABOUT)}>Learn More</Button>
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
                  <Button variant="info" onClick={() => navigate(ROUTES.ONG.DASHBOARD)}>Dashboard</Button>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Catálogo Público (Fase 3) */}
        <div className="row mt-4">
          <div className="col-12">
            <Card>
              <Card.Header>
                <Card.Title>Catálogo Público</Card.Title>
              </Card.Header>
              <Card.Body>
                <form className="row g-2 align-items-center mb-3" onSubmit={onSearch}>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por produtos (ex: higiene até 50 reais)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Buscar"
                    />
                  </div>
                  <div className="col-sm-4 d-grid d-sm-block">
                    <Button type="submit" variant="primary">Buscar</Button>
                  </div>
                </form>

                {interpretationText && (
                  <div className="alert alert-info" role="alert">
                    {interpretationText}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger" role="alert">{error}</div>
                )}
                {loading && <div>Carregando catálogo...</div>}

                {/* Lista de produtos em cards */}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  {productsRes?.products && productsRes.products.length > 0 ? (
                    productsRes.products.map((p) => (
                      <div key={p.id} className="col">
                        <div className="card h-100">
                          <img src={p.imageUrl} className="card-img-top" alt={p.name} />
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{p.name}</h5>
                          <p className="card-text small text-muted mb-1">Categoria: {p.categoryId}</p>
                            <p className="card-text">{p.description}</p>
                            <div className="mt-auto fw-bold">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    !loading && <div className="col-12 text-center text-muted">Nenhum produto encontrado.</div>
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

export default Home;