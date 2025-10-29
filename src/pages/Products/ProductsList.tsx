import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import type { Product } from '../../types/product';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../components/EmptyState/EmptyState';

export const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await productsService.getProducts();
        setProducts(response.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCreateProduct = () => {
    navigate('/ong/products/new');
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/ong/products/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productsService.deleteProduct(productId);
        // Reload products after deletion
        const response = await productsService.getProducts();
        setProducts(response.products);
      } catch (err) {
        alert('Erro ao deletar produto: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={`Erro ao carregar produtos: ${error}`} />;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Produtos</h2>
        <button className="btn btn-primary" onClick={handleCreateProduct}>Novo Produto</button>
      </div>

      {products.length === 0 ? (
        <EmptyState message="Nenhum produto encontrado." />
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>Preço:</strong> R$ {product.price.toFixed(2).replace('.', ',')}</p>
                  <p className="card-text"><strong>Categoria:</strong> {product.category}</p>
                  <p className="card-text"><strong>Estoque:</strong> {product.stock_qty}</p>
                  <div className="mt-auto">
                    <button className="btn btn-secondary me-2" onClick={() => handleEditProduct(product.id)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
