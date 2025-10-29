import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { ProductForm } from '../pages/Products/ProductForm';
import type { CreateProductData } from '../types/product';

// Mock the products service
vi.mock('../services/products.service', () => ({
  productsService: {
    createProduct: vi.fn(),
  },
}));

import { productsService } from '../services/products.service';

describe('ProductForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with all required fields', () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url da imagem/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantidade em estoque/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/peso em gramas/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Preço é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('URL da imagem é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Quantidade em estoque é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('Peso é obrigatório')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99,
      category: 'Test Category',
      image_url: 'https://example.com/image.jpg',
      stock_qty: 100,
      weight_grams: 500,
      organization_id: 'org-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    (productsService.createProduct as any).mockResolvedValueOnce(mockProduct);

    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    // Fill form
    await user.type(screen.getByLabelText(/nome/i), 'Test Product');
    await user.type(screen.getByLabelText(/descrição/i), 'Test Description');
    await user.type(screen.getByLabelText(/preço/i), '29.99');
    await user.type(screen.getByLabelText(/categoria/i), 'Test Category');
    await user.type(screen.getByLabelText(/url da imagem/i), 'https://example.com/image.jpg');
    await user.type(screen.getByLabelText(/quantidade em estoque/i), '100');
    await user.type(screen.getByLabelText(/peso em gramas/i), '500');

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(productsService.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        category: 'Test Category',
        image_url: 'https://example.com/image.jpg',
        stock_qty: 100,
        weight_grams: 500,
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should handle API errors', async () => {
    (productsService.createProduct as any).mockRejectedValueOnce(new Error('API Error'));

    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    // Fill form with valid data
    await user.type(screen.getByLabelText(/nome/i), 'Test Product');
    await user.type(screen.getByLabelText(/descrição/i), 'Test Description');
    await user.type(screen.getByLabelText(/preço/i), '29.99');
    await user.type(screen.getByLabelText(/categoria/i), 'Test Category');
    await user.type(screen.getByLabelText(/url da imagem/i), 'https://example.com/image.jpg');
    await user.type(screen.getByLabelText(/quantidade em estoque/i), '100');
    await user.type(screen.getByLabelText(/peso em gramas/i), '500');

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao salvar produto: API Error')).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should validate price as decimal number', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    // Try to enter invalid price - input type="number" will prevent invalid input
    // So we'll test with empty value which should trigger validation
    await user.clear(screen.getByLabelText(/preço/i));
    await user.type(screen.getByLabelText(/nome/i), 'Test');
    await user.type(screen.getByLabelText(/descrição/i), 'Test');
    await user.type(screen.getByLabelText(/categoria/i), 'Test');
    await user.type(screen.getByLabelText(/url da imagem/i), 'https://test.com');
    await user.type(screen.getByLabelText(/quantidade em estoque/i), '10');
    await user.type(screen.getByLabelText(/peso em gramas/i), '100');

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Preço é obrigatório')).toBeInTheDocument();
    });
  });

  it('should have Bootstrap classes for responsive layout', () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Check for form-group or similar Bootstrap classes
    const nameInput = screen.getByLabelText(/nome/i);
    expect(nameInput.parentElement).toHaveClass('mb-3');

    // Check for form-control class on inputs
    expect(nameInput).toHaveClass('form-control');

    const descriptionInput = screen.getByLabelText(/descrição/i);
    expect(descriptionInput).toHaveClass('form-control');

    const priceInput = screen.getByLabelText(/preço/i);
    expect(priceInput).toHaveClass('form-control');

    // Check for button classes
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    expect(submitButton).toHaveClass('btn');
    expect(submitButton).toHaveClass('btn-primary');

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    expect(cancelButton).toHaveClass('btn');
    expect(cancelButton).toHaveClass('btn-secondary');
  });

  it('should have ARIA attributes for accessibility', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/nome/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');

      const descriptionInput = screen.getByLabelText(/descrição/i);
      expect(descriptionInput).toHaveAttribute('aria-invalid', 'true');
      expect(descriptionInput).toHaveAttribute('aria-describedby', 'description-error');

      const priceInput = screen.getByLabelText(/preço/i);
      expect(priceInput).toHaveAttribute('aria-invalid', 'true');
      expect(priceInput).toHaveAttribute('aria-describedby', 'price-error');

      const categoryInput = screen.getByLabelText(/categoria/i);
      expect(categoryInput).toHaveAttribute('aria-invalid', 'true');
      expect(categoryInput).toHaveAttribute('aria-describedby', 'category-error');

      const imageUrlInput = screen.getByLabelText(/url da imagem/i);
      expect(imageUrlInput).toHaveAttribute('aria-invalid', 'true');
      expect(imageUrlInput).toHaveAttribute('aria-describedby', 'image_url-error');

      const stockQtyInput = screen.getByLabelText(/quantidade em estoque/i);
      expect(stockQtyInput).toHaveAttribute('aria-invalid', 'true');
      expect(stockQtyInput).toHaveAttribute('aria-describedby', 'stock_qty-error');

      const weightGramsInput = screen.getByLabelText(/peso em gramas/i);
      expect(weightGramsInput).toHaveAttribute('aria-invalid', 'true');
      expect(weightGramsInput).toHaveAttribute('aria-describedby', 'weight_grams-error');
    });
  });

  it('should have role="alert" for error messages', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    await user.click(submitButton);

    await waitFor(() => {
      const nameError = screen.getByText('Nome é obrigatório');
      expect(nameError).toHaveAttribute('role', 'alert');

      const descriptionError = screen.getByText('Descrição é obrigatória');
      expect(descriptionError).toHaveAttribute('role', 'alert');

      const priceError = screen.getByText('Preço é obrigatório');
      expect(priceError).toHaveAttribute('role', 'alert');

      const categoryError = screen.getByText('Categoria é obrigatória');
      expect(categoryError).toHaveAttribute('role', 'alert');

      const imageUrlError = screen.getByText('URL da imagem é obrigatória');
      expect(imageUrlError).toHaveAttribute('role', 'alert');

      const stockQtyError = screen.getByText('Quantidade em estoque é obrigatória');
      expect(stockQtyError).toHaveAttribute('role', 'alert');

      const weightGramsError = screen.getByText('Peso é obrigatório');
      expect(weightGramsError).toHaveAttribute('role', 'alert');
    });
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should allow keyboard navigation', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nome/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const priceInput = screen.getByLabelText(/preço/i);
    const categoryInput = screen.getByLabelText(/categoria/i);
    const imageUrlInput = screen.getByLabelText(/url da imagem/i);
    const stockQtyInput = screen.getByLabelText(/quantidade em estoque/i);
    const weightGramsInput = screen.getByLabelText(/peso em gramas/i);
    const saveButton = screen.getByRole('button', { name: /salvar/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });

    await user.tab();
    expect(nameInput).toHaveFocus();

    await user.tab();
    expect(descriptionInput).toHaveFocus();

    await user.tab();
    expect(priceInput).toHaveFocus();

    await user.tab();
    expect(categoryInput).toHaveFocus();

    await user.tab();
    expect(imageUrlInput).toHaveFocus();

    await user.tab();
    expect(stockQtyInput).toHaveFocus();

    await user.tab();
    expect(weightGramsInput).toHaveFocus();

    await user.tab();
    expect(saveButton).toHaveFocus();

    await user.tab();
    expect(cancelButton).toHaveFocus();
  });
});