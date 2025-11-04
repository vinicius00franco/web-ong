import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../../stores/productsStore';
import { ProductCard } from '../../components/ProductCard';
import { ProductCardSkeleton } from '../../components/ProductCardSkeleton';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import ConfirmationModal from '../../components/ConfirmationModal';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ROUTES } from '../../config/routes';

export const ProductsList = () => {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts, deleteProduct } = useProductsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    // Fetch products only once when component mounts
    if (!hasAttemptedLoad) {
      fetchProducts();
      setHasAttemptedLoad(true);
    }
  }, [hasAttemptedLoad, fetchProducts]);

  const handleRetryLoad = () => {
    fetchProducts();
  };

  const handleCreateProduct = () => {
    navigate(ROUTES.ONG.PRODUCTS_NEW);
  };

  const handleEditProduct = (productId: string) => {
    navigate(ROUTES.buildProductEdit(productId));
  };

  const handleDeleteConfirmation = (productId: string) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
      } catch (err) {
        alert('Erro ao deletar produto: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
      } finally {
        setIsModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  if (error) {
    return (
      <div className="text-center py-5">
        <ErrorMessage message={`Erro ao carregar produtos: ${error}`} />
        <button
          className="btn btn-primary mt-3"
          onClick={handleRetryLoad}
          disabled={loading}
        >
          {loading ? 'Tentando novamente...' : 'Tentar Novamente'}
        </button>
      </div>
    );
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
        <div className="row" role="status" aria-live="polite" aria-busy="true">
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
