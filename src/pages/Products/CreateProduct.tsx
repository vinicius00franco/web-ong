import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../Products/ProductForm';
import Breadcrumbs from '../../components/Breadcrumbs';

export const CreateProductPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/ong/products');
  };

  const handleCancel = () => {
    navigate('/ong/products');
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/ong' },
    { label: 'Products', href: '/ong/products' },
    { label: 'New', href: '/ong/products/new' },
  ];

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1>Criar Novo Produto</h1>
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};