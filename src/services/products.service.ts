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

  /**
   * Normaliza a resposta da API para o formato esperado
   */
  private normalizeProductsResponse(response: any): ProductsResponse {
    console.log('🔄 Normalizando resposta da API:', response);

    // Se for um array direto, converter para ProductsResponse
    if (Array.isArray(response)) {
      return {
        products: response,
        total: response.length,
        page: 1,
        limit: response.length,
        totalPages: 1
      };
    }

    // Se tiver estrutura { success: true, data: [...] }
    if (response?.success && Array.isArray(response.data)) {
      return {
        products: response.data,
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        totalPages: 1
      };
    }

    // Se já tiver a estrutura correta
    if (response?.products && Array.isArray(response.products)) {
      return {
        products: response.products,
        total: response.total || response.products.length,
        page: response.page || 1,
        limit: response.limit || response.products.length,
        totalPages: response.totalPages || 1
      };
    }

    // Fallback para array vazio
    console.warn('⚠️ Resposta com formato desconhecido, retornando array vazio:', response);
    return {
      products: [],
      total: 0,
      page: 1,
      limit: 0,
      totalPages: 0
    };
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    if (this.useMock) {
      return mockProductsService.getProducts(filters);
    }

    try {
      const { data } = await axios.get('/api/products', { 
        params: { page: 1, limit: 10, ...filters } 
      });
      return this.normalizeProductsResponse(data);
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    if (this.useMock) {
      return mockProductsService.getProduct(id);
    }

    try {
      const { data } = await axios.get(`/api/products/${id}`);
      console.log('📦 Resposta da API para produto individual:', data);
      
      // Normalizar se necessário
      if (data?.data && typeof data.data === 'object') {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error(`❌ Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    if (this.useMock) {
      return mockProductsService.createProduct(productData);
    }

    try {
      const { data } = await axios.post('/api/products', productData);
      console.log('✅ Produto criado:', data);
      
      // Normalizar se necessário
      if (data?.data && typeof data.data === 'object') {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      throw error;
    }
  }

  async updateProduct(productData: UpdateProductData): Promise<Product> {
    if (this.useMock) {
      return mockProductsService.updateProduct(productData);
    }

    try {
      const { id, ...updateData } = productData;
      const { data } = await axios.put(`/api/products/${id}`, updateData);
      console.log('✅ Produto atualizado:', data);
      
      // Normalizar se necessário
      if (data?.data && typeof data.data === 'object') {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    if (this.useMock) {
      return mockProductsService.deleteProduct(id);
    }

    try {
      await axios.delete(`/api/products/${id}`);
      console.log(`✅ Produto ${id} deletado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();