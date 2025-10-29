import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
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

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

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

    // Fill form
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/preço/i), { target: { value: '29.99' } });
    fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/url da imagem/i), { target: { value: 'https://example.com/image.jpg' } });
    fireEvent.change(screen.getByLabelText(/quantidade em estoque/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/peso em gramas/i), { target: { value: '500' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

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

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/preço/i), { target: { value: '29.99' } });
    fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText(/url da imagem/i), { target: { value: 'https://example.com/image.jpg' } });
    fireEvent.change(screen.getByLabelText(/quantidade em estoque/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/peso em gramas/i), { target: { value: '500' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao salvar produto: API Error')).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should validate price as decimal number', async () => {
    render(<ProductForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Try to enter invalid price - input type="number" will prevent invalid input
    // So we'll test with empty value which should trigger validation
    fireEvent.change(screen.getByLabelText(/preço/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/url da imagem/i), { target: { value: 'https://test.com' } });
    fireEvent.change(screen.getByLabelText(/quantidade em estoque/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/peso em gramas/i), { target: { value: '100' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

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
});