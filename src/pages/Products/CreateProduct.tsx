import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../Products/ProductForm';

export const CreateProductPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/ong/products');
  };

  const handleCancel = () => {
    navigate('/ong/products');
  };

  return (
    <div>
      <h1>Criar Novo Produto</h1>
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};