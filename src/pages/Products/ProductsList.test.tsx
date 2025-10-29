import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ProductsList } from './ProductsList';
import { productsService } from '../../services/products.service';
import type { ProductsResponse } from '../../types/product';

vi.mock('../../services/products.service');

const mockProductsResponse: ProductsResponse = {
  products: [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      price: 10,
      category: 'Test Category 1',
      image_url: 'https://via.placeholder.com/150',
      stock_qty: 10,
      weight_grams: 100,
      organization_id: '1',
      created_at: '',
      updated_at: '',
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('ProductsList', () => {
  it('renders the skeleton when loading', () => {
    vi.mocked(productsService.getProducts).mockResolvedValueOnce(new Promise(() => {}));
    render(
      <MemoryRouter>
        <ProductsList />
      </MemoryRouter>
    );
    expect(screen.getAllByTestId('skeleton-image').length).toBeGreaterThan(0);
  });

  it('renders the product cards when loaded', async () => {
    vi.mocked(productsService.getProducts).mockResolvedValueOnce(mockProductsResponse);
    render(
      <MemoryRouter>
        <ProductsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      // Check if the ProductCard is rendered
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
