import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../Products/ProductForm';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ROUTES } from '../../config/routes';

export const CreateProductPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.ONG.PRODUCTS);
  };

  const handleCancel = () => {
    navigate(ROUTES.ONG.PRODUCTS);
  };

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Dashboard', href: ROUTES.ONG.DASHBOARD },
    { label: 'Products', href: ROUTES.ONG.PRODUCTS },
    { label: 'New', href: ROUTES.ONG.PRODUCTS_NEW },
  ];

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1>Criar Novo Produto</h1>
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};