import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import type { Product } from '../../types/product';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/ProductCardSkeleton';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import ConfirmationModal from '../../components/ConfirmationModal';
import Breadcrumbs from '../../components/Breadcrumbs';

export const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

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

  const handleDeleteConfirmation = (productId: string) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await productsService.deleteProduct(productToDelete);
        // Reload products after deletion
        const response = await productsService.getProducts();
        setProducts(response.products);
      } catch (err) {
        alert('Erro ao deletar produto: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
      } finally {
        setIsModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  if (error) {
    return <ErrorMessage message={`Erro ao carregar produtos: ${error}`} />;
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/ong' },
    { label: 'Products', href: '/ong/products' },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Produtos</h2>
        <button className="btn btn-primary" onClick={handleCreateProduct}>Novo Produto</button>
      </div>

      {loading ? (
        <div className="row">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={index}>
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="Nenhum produto encontrado." />
      ) : (
        <div className="row">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={product.id}>
              <ProductCard
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteConfirmation}
              />
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ConfirmationModal
          title="Confirmar exclusão"
          message="Tem certeza que deseja deletar este produto?"
          onConfirm={handleDeleteProduct}
          onCancel={() => {
            setIsModalOpen(false);
            setProductToDelete(null);
          }}
        />
      )}
    </>
  );
};
