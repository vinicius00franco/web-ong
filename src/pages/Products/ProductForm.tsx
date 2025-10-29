import { useState } from 'react';
import { productsService } from '../../services/products.service';
import type { CreateProductData } from '../../types/product';

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  image_url?: string;
  stock_qty?: string;
  weight_grams?: string;
}

export const ProductForm = ({ onSuccess, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_qty: 0,
    weight_grams: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(formData.price)) {
      newErrors.price = 'Preço deve ser um número válido';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.image_url.trim()) {
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
      await productsService.createProduct(formData);
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateProductData, value: string | number) => {
    if (field === 'price') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      setFormData(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nome</label>
        <input
          id="name"
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {errors.name && <div className="text-danger">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descrição</label>
        <textarea
          id="description"
          className="form-control"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors.description && <div className="text-danger">{errors.description}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="price" className="form-label">Preço</label>
        <input
          id="price"
          type="number"
          step="0.01"
          className="form-control"
          value={formData.price || ''}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
        />
        {errors.price && <div className="text-danger">{errors.price}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Categoria</label>
        <input
          id="category"
          type="text"
          className="form-control"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        />
        {errors.category && <div className="text-danger">{errors.category}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="image_url" className="form-label">URL da Imagem</label>
        <input
          id="image_url"
          type="url"
          className="form-control"
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
        />
        {errors.image_url && <div className="text-danger">{errors.image_url}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="stock_qty" className="form-label">Quantidade em Estoque</label>
        <input
          id="stock_qty"
          type="number"
          className="form-control"
          value={formData.stock_qty || ''}
          onChange={(e) => handleChange('stock_qty', parseInt(e.target.value) || 0)}
        />
        {errors.stock_qty && <div className="text-danger">{errors.stock_qty}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="weight_grams" className="form-label">Peso em Gramas</label>
        <input
          id="weight_grams"
          type="number"
          className="form-control"
          value={formData.weight_grams || ''}
          onChange={(e) => handleChange('weight_grams', parseInt(e.target.value) || 0)}
        />
        {errors.weight_grams && <div className="text-danger">{errors.weight_grams}</div>}
      </div>

      {submitError && <div className="alert alert-danger">Erro ao salvar produto: {submitError}</div>}

      <div>
        <button type="submit" className="btn btn-primary me-2" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
