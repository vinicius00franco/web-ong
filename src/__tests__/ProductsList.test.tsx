import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductsList } from '../pages/Products/ProductsList';
import { productsService } from '../services/products.service';
import type { Product } from '../types/product';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the products service
vi.mock('../services/products.service', () => ({
  productsService: {
    getProducts: vi.fn(),
  },
}));

describe('ProductsList', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Description 1',
      price: 29.99,
      category: 'Category A',
      image_url: 'https://example.com/image1.jpg',
      stock_qty: 100,
      weight_grams: 500,
      organization_id: 'org-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Description 2',
      price: 49.99,
      category: 'Category B',
      image_url: 'https://example.com/image2.jpg',
      stock_qty: 50,
      weight_grams: 300,
      organization_id: 'org-1',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    (productsService.getProducts as any).mockResolvedValueOnce({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });

    render(<ProductsList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('should render products list when data is loaded', async () => {
    (productsService.getProducts as any).mockResolvedValueOnce({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    render(<ProductsList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    expect(screen.getByText('R$ 29,99')).toBeInTheDocument();
    expect(screen.getByText('R$ 49,99')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Category B')).toBeInTheDocument();
  });

  it('should render empty state when no products', async () => {
    (productsService.getProducts as any).mockResolvedValueOnce({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });

    render(<ProductsList />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    (productsService.getProducts as any).mockRejectedValueOnce(new Error('API Error'));

    render(<ProductsList />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar produtos: API Error')).toBeInTheDocument();
    });
  });

  it('should render action buttons for each product', async () => {
    (productsService.getProducts as any).mockResolvedValueOnce({
      products: [mockProducts[0]],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    render(<ProductsList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /editar/i });
    const deleteButton = screen.getByRole('button', { name: /deletar/i });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Test navigation to edit page
    fireEvent.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith('/ong/products/1/edit');
  });

  it('should navigate to create product page when clicking new product button', async () => {
    (productsService.getProducts as any).mockResolvedValueOnce({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });

    render(<ProductsList />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
    });

    const newProductButton = screen.getByRole('button', { name: /novo produto/i });
    fireEvent.click(newProductButton);

    expect(mockNavigate).toHaveBeenCalledWith('/ong/products/new');
  });
});
