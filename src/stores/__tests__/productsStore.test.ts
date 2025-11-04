import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductsStore } from '../productsStore';
import { productsService } from '../../services/products.service';
import type { Product } from '../../types/product';

// Mock do serviço
vi.mock('../../services/products.service');

const mockProductsService = vi.mocked(productsService);

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  category: 'Test Category',
  stock: 10,
  organization: 'Test Org',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('Products Store', () => {
  beforeEach(() => {
    // Reset store state
    useProductsStore.getState().reset();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useProductsStore.getState();
      
      expect(state.products).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const { fetchProducts } = useProductsStore.getState();
      
      await fetchProducts();
      
      const state = useProductsStore.getState();
      expect(state.products).toEqual(mockProducts);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle array response format', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const { fetchProducts } = useProductsStore.getState();
      
      await fetchProducts();
      
      const state = useProductsStore.getState();
      expect(state.products).toEqual(mockProducts);
    });

    it('should handle object response format', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.getProducts.mockResolvedValue({ products: mockProducts });

      const { fetchProducts } = useProductsStore.getState();
      
      await fetchProducts();
      
      const state = useProductsStore.getState();
      expect(state.products).toEqual(mockProducts);
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error';
      mockProductsService.getProducts.mockRejectedValue(new Error(errorMessage));

      const { fetchProducts } = useProductsStore.getState();
      
      await fetchProducts();
      
      const state = useProductsStore.getState();
      expect(state.products).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('addProduct', () => {
    it('should add product to store after creation', async () => {
      const newProduct = { ...mockProduct, id: '2' };
      mockProductsService.createProduct.mockResolvedValue(newProduct);

      const { addProduct } = useProductsStore.getState();
      
      await addProduct(newProduct);
      
      const state = useProductsStore.getState();
      expect(state.products).toContain(newProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update product in store', async () => {
      // Set initial state
      useProductsStore.setState({ products: [mockProduct] });
      
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };
      mockProductsService.updateProduct.mockResolvedValue(updatedProduct);

      const { updateProduct } = useProductsStore.getState();
      
      await updateProduct('1', updatedProduct);
      
      const state = useProductsStore.getState();
      expect(state.products[0].name).toBe('Updated Product');
    });
  });

  describe('deleteProduct', () => {
    it('should remove product from store', async () => {
      // Set initial state
      useProductsStore.setState({ products: [mockProduct] });
      
      mockProductsService.deleteProduct.mockResolvedValue(undefined);

      const { deleteProduct } = useProductsStore.getState();
      
      await deleteProduct('1');
      
      const state = useProductsStore.getState();
      expect(state.products).toEqual([]);
    });
  });
});