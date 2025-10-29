import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditProductPage } from '../pages/Products/EditProduct';
import { productsService } from '../services/products.service';
import type { Product } from '../types/product';

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockParams = { id: '1' };
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

// Mock the products service
vi.mock('../services/products.service', () => ({
  productsService: {
    getProduct: vi.fn(),
    updateProduct: vi.fn(),
  },
}));

describe('EditProductPage', () => {
  const mockProduct: Product = {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and display product data', async () => {
    (productsService.getProduct as any).mockResolvedValueOnce(mockProduct);

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('29.99')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching product', () => {
    (productsService.getProduct as any).mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<EditProductPage />);

    expect(screen.getByText('Carregando produto...')).toBeInTheDocument();
  });

  it('should handle product load error', async () => {
    (productsService.getProduct as any).mockRejectedValueOnce(new Error('Product not found'));

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar produto: Product not found')).toBeInTheDocument();
    });
  });

  it('should update product and navigate back on success', async () => {
    (productsService.getProduct as any).mockResolvedValueOnce(mockProduct);
    (productsService.updateProduct as any).mockResolvedValueOnce({
      ...mockProduct,
      name: 'Updated Product',
    });

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    });

    // Update the name
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Updated Product' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(productsService.updateProduct).toHaveBeenCalledWith({
        id: '1',
        name: 'Updated Product',
        description: 'Test Description',
        price: 29.99,
        category: 'Test Category',
        image_url: 'https://example.com/image.jpg',
        stock_qty: 100,
        weight_grams: 500,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/ong/products');
    });
  });

  it('should handle update error', async () => {
    (productsService.getProduct as any).mockResolvedValueOnce(mockProduct);
    (productsService.updateProduct as any).mockRejectedValueOnce(new Error('Update failed'));

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar produto: Update failed')).toBeInTheDocument();
    });
  });

  it('should navigate back when cancel is clicked', async () => {
    (productsService.getProduct as any).mockResolvedValueOnce(mockProduct);

    render(<EditProductPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/ong/products');
  });
});