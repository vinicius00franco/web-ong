import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import Home from '../index';
import '@testing-library/jest-dom';
import { publicProductsService } from '../../../services/public-products.service';
import { vi } from 'vitest';

// Mock do serviço de produtos públicos
vi.mock('../../../services/public-products.service', () => ({
  publicProductsService: {
    getProducts: vi.fn(),
  },
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Should render with default props
  test('renders home page with default props', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    );

    const welcomeMessage = screen.getByText('Welcome to ONG Web App');
    expect(welcomeMessage).toBeInTheDocument();
  });

  // Test 2: Should not have custom styles applied
  test('should not have custom styles', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    );

    const welcomeMessage = screen.getByText('Welcome to ONG Web App');
    expect(welcomeMessage).not.toHaveStyle('transition: transform 0.2s ease-in-out');
  });

  // Test 3: Should handle undefined products gracefully (reproduces the bug)
  test('should handle undefined products gracefully', async () => {
    // Mock que retorna um objeto com products undefined
    (publicProductsService.getProducts as any).mockResolvedValue({
      products: undefined,
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    );

    // Espera que o componente seja renderizado sem erro
    await waitFor(() => {
      expect(screen.getByText('Welcome to ONG Web App')).toBeInTheDocument();
    });

    // Verifica que não há erro de map em undefined e mostra mensagem apropriada
    expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
  });

  // Test 4: Should render products when data is available
  test('should render products when data is available', async () => {
    const mockProducts = [
      {
        id: 'prod-001',
        name: 'Cesta Básica Completa',
        description: 'Cesta básica com alimentos essenciais',
        price: 150.00,
        category: 'Alimentos',
        imageUrl: 'https://example.com/image.jpg',
        stockQty: 45,
        weightGrams: 15000,
        organizationId: 'org-001',
        createdAt: '2024-01-15T10:30:00Z',
        categoryId: 1,
        updatedAt: '2024-10-20T14:22:00Z',
      },
    ];

    (publicProductsService.getProducts as any).mockResolvedValue({
      products: mockProducts,
      total: 1,
      page: 1,
      limit: 12,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </MemoryRouter>
    );

    // Espera que o produto seja renderizado
    await waitFor(() => {
      expect(screen.getByText('Cesta Básica Completa')).toBeInTheDocument();
    });

    expect(screen.getByText('Categoria: 1')).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
  });
});
