import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import type { Product, UpdateProductData } from '../../types/product';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ROUTES } from '../../config/routes';

export const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('ID do produto não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadedProduct = await productsService.getProduct(id);
        setProduct(loadedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleSuccess = () => {
    navigate(ROUTES.ONG.PRODUCTS);
  };

  const handleCancel = () => {
    navigate(ROUTES.ONG.PRODUCTS);
  };

  if (loading) {
    return <div>Carregando produto...</div>;
  }

  if (error) {
    return <div>Erro ao carregar produto: {error}</div>;
  }

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  const breadcrumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Dashboard', href: ROUTES.ONG.DASHBOARD },
    { label: 'Products', href: ROUTES.ONG.PRODUCTS },
    { label: 'Edit', href: ROUTES.buildProductEdit(id!) },
  ];
  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1>Editar Produto</h1>
      <EditProductForm
        product={product}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

interface EditProductFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditProductForm = ({ product, onSuccess, onCancel }: EditProductFormProps) => {
  const [formData, setFormData] = useState<UpdateProductData>({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl,
    stockQty: product.stockQty,
    weightGrams: product.weightGrams,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Preço é obrigatório';
    }

    if (!formData.categoryId || formData.categoryId <= 0) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    if (!formData.imageUrl?.trim()) {
      newErrors.imageUrl = 'URL da imagem é obrigatória';
    }

    if (!formData.stockQty || formData.stockQty < 0) {
      newErrors.stockQty = 'Quantidade em estoque é obrigatória';
    }

    if (!formData.weightGrams || formData.weightGrams <= 0) {
      newErrors.weightGrams = 'Peso é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await productsService.updateProduct(formData);
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UpdateProductData, value: string | number) => {
    if (field === 'price') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      setFormData(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {errors.name && <span>{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors.description && <span>{errors.description}</span>}
      </div>

      <div>
        <label htmlFor="price">Preço</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={formData.price || ''}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
        />
        {errors.price && <span>{errors.price}</span>}
      </div>

      <div>
        <label htmlFor="category">Categoria</label>
        <input
          id="category"
          type="number"
          value={formData.categoryId || ''}
          onChange={(e) => handleChange('categoryId', parseInt(e.target.value) || 0)}
        />
        {errors.categoryId && <span>{errors.categoryId}</span>}
      </div>

      <div>
        <label htmlFor="imageUrl">URL da Imagem</label>
        <input
          id="imageUrl"
          type="url"
          value={formData.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
        />
        {errors.imageUrl && <span>{errors.imageUrl}</span>}
      </div>

      <div>
        <label htmlFor="stockQty">Quantidade em Estoque</label>
        <input
          id="stockQty"
          type="number"
          value={formData.stockQty || ''}
          onChange={(e) => handleChange('stockQty', parseInt(e.target.value) || 0)}
        />
        {errors.stockQty && <span>{errors.stockQty}</span>}
      </div>

      <div>
        <label htmlFor="weightGrams">Peso em Gramas</label>
        <input
          id="weightGrams"
          type="number"
          value={formData.weightGrams || ''}
          onChange={(e) => handleChange('weightGrams', parseInt(e.target.value) || 0)}
        />
        {errors.weightGrams && <span>{errors.weightGrams}</span>}
      </div>

      {submitError && <div>Erro ao atualizar produto: {submitError}</div>}

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};