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
  categoryId?: string;
  imageUrl?: string;
  stockQty?: string;
  weightGrams?: string;
}

export const ProductForm = ({ onSuccess, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    imageUrl: '',
    stockQty: 0,
    weightGrams: 0,
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

    if (!formData.categoryId || formData.categoryId <= 0) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    if (!formData.imageUrl.trim()) {
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
          aria-invalid={!!errors.name}
          aria-describedby="name-error"
        />
        {errors.name && <div id="name-error" className="text-danger" role="alert">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descrição</label>
        <textarea
          id="description"
          className="form-control"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby="description-error"
        />
        {errors.description && <div id="description-error" className="text-danger" role="alert">{errors.description}</div>}
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
          aria-invalid={!!errors.price}
          aria-describedby="price-error"
        />
        {errors.price && <div id="price-error" className="text-danger" role="alert">{errors.price}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Categoria</label>
        <input
          id="category"
          type="number"
          className="form-control"
          value={formData.categoryId || ''}
          onChange={(e) => handleChange('categoryId', parseInt(e.target.value) || 0)}
          aria-invalid={!!errors.categoryId}
          aria-describedby="categoryId-error"
        />
        {errors.categoryId && <div id="categoryId-error" className="text-danger" role="alert">{errors.categoryId}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="imageUrl" className="form-label">URL da Imagem</label>
        <input
          id="imageUrl"
          type="url"
          className="form-control"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          aria-invalid={!!errors.imageUrl}
          aria-describedby="imageUrl-error"
        />
        {errors.imageUrl && <div id="imageUrl-error" className="text-danger" role="alert">{errors.imageUrl}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="stockQty" className="form-label">Quantidade em Estoque</label>
        <input
          id="stockQty"
          type="number"
          className="form-control"
          value={formData.stockQty || ''}
          onChange={(e) => handleChange('stockQty', parseInt(e.target.value) || 0)}
          aria-invalid={!!errors.stockQty}
          aria-describedby="stockQty-error"
        />
        {errors.stockQty && <div id="stockQty-error" className="text-danger" role="alert">{errors.stockQty}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="weightGrams" className="form-label">Peso em Gramas</label>
        <input
          id="weightGrams"
          type="number"
          className="form-control"
          value={formData.weightGrams || ''}
          onChange={(e) => handleChange('weightGrams', parseInt(e.target.value) || 0)}
          aria-invalid={!!errors.weightGrams}
          aria-describedby="weightGrams-error"
        />
        {errors.weightGrams && <div id="weightGrams-error" className="text-danger" role="alert">{errors.weightGrams}</div>}
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
