import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { productsService } from '../services/products.service';
import { configManager } from '../config/app.config';
import type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductsResponse } from '../types/product';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('ProductsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure tests run against real API layer (axios) rather than mocks
    configManager.setUseMockData(false);
  });

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

  const mockProductsResponse: ProductsResponse = {
    products: [mockProduct],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  describe('getProducts', () => {
    it('should fetch products with default filters', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockProductsResponse });

      const result = await productsService.getProducts();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/products', {
        params: { page: 1, limit: 10 },
      });
      expect(result).toEqual(mockProductsResponse);
    });

    it('should fetch products with custom filters', async () => {
      const filters: ProductFilters = {
        category: 'Electronics',
        name: 'Laptop',
        page: 2,
        limit: 20,
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockProductsResponse });

      const result = await productsService.getProducts(filters);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/products', {
        params: filters,
      });
      expect(result).toEqual(mockProductsResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(productsService.getProducts()).rejects.toThrow('API Error');
    });
  });

  describe('getProduct', () => {
    it('should fetch a single product by id', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

      const result = await productsService.getProduct('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('should handle API errors', async () => {
      const error = new Error('Product not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(productsService.getProduct('1')).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createData: CreateProductData = {
        name: 'New Product',
        description: 'New Description',
        price: 19.99,
        category: 'New Category',
        image_url: 'https://example.com/new-image.jpg',
        stock_qty: 50,
        weight_grams: 300,
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockProduct });

      const result = await productsService.createProduct(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/products', createData);
      expect(result).toEqual(mockProduct);
    });

    it('should handle API errors', async () => {
      const createData: CreateProductData = {
        name: 'New Product',
        description: 'New Description',
        price: 19.99,
        category: 'New Category',
        image_url: 'https://example.com/new-image.jpg',
        stock_qty: 50,
        weight_grams: 300,
      };
      const error = new Error('Validation Error');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(productsService.createProduct(createData)).rejects.toThrow('Validation Error');
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateData: UpdateProductData = {
        id: '1',
        name: 'Updated Product',
        price: 39.99,
      };
      const updatedProduct = { ...mockProduct, ...updateData };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedProduct });

      const result = await productsService.updateProduct(updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith('/api/products/1', {
        name: 'Updated Product',
        price: 39.99,
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should handle API errors', async () => {
      const updateData: UpdateProductData = {
        id: '1',
        name: 'Updated Product',
      };
      const error = new Error('Update failed');
      mockedAxios.put.mockRejectedValueOnce(error);

      await expect(productsService.updateProduct(updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await productsService.deleteProduct('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/products/1');
    });

    it('should handle API errors', async () => {
      const error = new Error('Delete failed');
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(productsService.deleteProduct('1')).rejects.toThrow('Delete failed');
    });
  });
});