import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsService } from '../../services/products.service';
import type { Product, UpdateProductData } from '../../types/product';

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
    navigate('/ong/products');
  };

  const handleCancel = () => {
    navigate('/ong/products');
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

  return (
    <div>
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
    category: product.category,
    image_url: product.image_url,
    stock_qty: product.stock_qty,
    weight_grams: product.weight_grams,
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

    if (!formData.category?.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.image_url?.trim()) {
      newErrors.image_url = 'URL da imagem é obrigatória';
    }

    if (!formData.stock_qty || formData.stock_qty < 0) {
      newErrors.stock_qty = 'Quantidade em estoque é obrigatória';
    }

    if (!formData.weight_grams || formData.weight_grams <= 0) {
      newErrors.weight_grams = 'Peso é obrigatório';
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
          type="text"
          value={formData.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
        />
        {errors.category && <span>{errors.category}</span>}
      </div>

      <div>
        <label htmlFor="image_url">URL da Imagem</label>
        <input
          id="image_url"
          type="url"
          value={formData.image_url || ''}
          onChange={(e) => handleChange('image_url', e.target.value)}
        />
        {errors.image_url && <span>{errors.image_url}</span>}
      </div>

      <div>
        <label htmlFor="stock_qty">Quantidade em Estoque</label>
        <input
          id="stock_qty"
          type="number"
          value={formData.stock_qty || ''}
          onChange={(e) => handleChange('stock_qty', parseInt(e.target.value) || 0)}
        />
        {errors.stock_qty && <span>{errors.stock_qty}</span>}
      </div>

      <div>
        <label htmlFor="weight_grams">Peso em Gramas</label>
        <input
          id="weight_grams"
          type="number"
          value={formData.weight_grams || ''}
          onChange={(e) => handleChange('weight_grams', parseInt(e.target.value) || 0)}
        />
        {errors.weight_grams && <span>{errors.weight_grams}</span>}
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