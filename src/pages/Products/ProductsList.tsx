import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import type { Product } from '../../types/product';

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
    return <div>Carregando produtos...</div>;
  }

  if (error) {
    return <div>Erro ao carregar produtos: {error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Produtos</h2>
        <button onClick={handleCreateProduct}>Novo Produto</button>
      </div>

      {products.length === 0 ? (
        <div>Nenhum produto encontrado.</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Preço:</strong> R$ {product.price.toFixed(2).replace('.', ',')}</p>
              <p><strong>Categoria:</strong> {product.category}</p>
              <p><strong>Estoque:</strong> {product.stock_qty}</p>
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => handleEditProduct(product.id)} style={{ marginRight: '0.5rem' }}>
                  Editar
                </button>
                <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};