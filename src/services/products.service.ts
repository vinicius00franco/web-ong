import axios from 'axios';
import './axios-logger';
import type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductsResponse } from '../types/product';
import { configManager } from '../config/app.config';
import { mockProductsService } from '../mocks';

/**
 * Service de produtos com suporte a dados mockados ou API real
 */
class ProductsService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    if (this.useMock) {
      return mockProductsService.getProducts(filters);
    }

    const { data } = await axios.get('/api/products', { 
      params: { page: 1, limit: 10, ...filters } 
    });
    return data;
  }

  async getProduct(id: string): Promise<Product> {
    if (this.useMock) {
      return mockProductsService.getProduct(id);
    }

    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    if (this.useMock) {
      return mockProductsService.createProduct(productData);
    }

    const { data } = await axios.post('/api/products', productData);
    return data;
  }

  async updateProduct(productData: UpdateProductData): Promise<Product> {
    if (this.useMock) {
      return mockProductsService.updateProduct(productData);
    }

    const { id, ...updateData } = productData;
    const { data } = await axios.put(`/api/products/${id}`, updateData);
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    if (this.useMock) {
      return mockProductsService.deleteProduct(id);
    }

    await axios.delete(`/api/products/${id}`);
  }
}

export const productsService = new ProductsService();