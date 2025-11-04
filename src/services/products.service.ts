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
   * Garante tipos corretos e compatibilidade de chaves usadas na UI
   */
  private normalizeProduct(item: any): Product {
    // Coerção de price para número (API pode enviar string)
    const priceNumber = typeof item?.price === 'string' ? parseFloat(item.price) : item?.price;

    return {
      // Identificador
      id: String(item.id),
      // Campos exibidos na UI (mantemos chaves esperadas pela UI em snake_case via mapeamento no componente/store quando necessário)
      // Nosso tipo Product usa camelCase conforme pasta types, então mapeamos para ele aqui
      name: item.name,
      description: item.description ?? '',
      price: Number.isFinite(priceNumber) ? priceNumber : 0,
      // Tentativas de normalização de nomenclatura
      categoryId: item.categoryId ?? item.category_id ?? item.categoryId ?? 0,
      imageUrl: item.imageUrl ?? item.image_url ?? '',
      stockQty: item.stockQty ?? item.stock_qty ?? 0,
      weightGrams: item.weightGrams ?? item.weight_grams ?? 0,
      organizationId: item.organizationId ?? item.organization_id ?? '',
      createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? item.updated_at ?? undefined,
    } as Product;
  }

  /**
   * Normaliza a resposta da API para o formato esperado
   */
  private normalizeProductsResponse(response: any): ProductsResponse {
    // Mapeia itens garantindo tipos esperados na UI/Tipos
    // Se for um array direto, converter para ProductsResponse
    if (Array.isArray(response)) {
      return {
        products: response.map((p) => this.normalizeProduct(p)),
        total: response.length,
        page: 1,
        limit: response.length,
        totalPages: 1
      };
    }

    // Se tiver estrutura { success: true, data: [...] }
    if (response?.success && Array.isArray(response.data)) {
      return {
        products: response.data.map((p: any) => this.normalizeProduct(p)),
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        totalPages: 1
      };
    }

    // Se já tiver a estrutura correta
    if (response?.products && Array.isArray(response.products)) {
      return {
        products: response.products.map((p: any) => this.normalizeProduct(p)),
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
      const res = await mockProductsService.getProducts(filters);
      return {
        ...res,
        products: res.products.map((p: any) => this.normalizeProduct(p)),
      };
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
      const p = await mockProductsService.getProduct(id);
      return this.normalizeProduct(p as any);
    }

    try {
      const { data } = await axios.get(`/api/products/${id}`);
      const payload = data?.data && typeof data.data === 'object' ? data.data : data;
      return this.normalizeProduct(payload);
    } catch (error) {
      console.error(`❌ Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    if (this.useMock) {
      const p = await mockProductsService.createProduct(productData);
      return this.normalizeProduct(p as any);
    }

    try {
      const { data } = await axios.post('/api/products', productData);
      const payload = data?.data && typeof data.data === 'object' ? data.data : data;
      return this.normalizeProduct(payload);
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      throw error;
    }
  }

  async updateProduct(productData: UpdateProductData): Promise<Product> {
    if (this.useMock) {
      const p = await mockProductsService.updateProduct(productData);
      return this.normalizeProduct(p as any);
    }

    try {
      const { id, ...updateData } = productData;
      const { data } = await axios.put(`/api/products/${id}`, updateData);
      const payload = data?.data && typeof data.data === 'object' ? data.data : data;
      return this.normalizeProduct(payload);
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
    } catch (error) {
      console.error(`❌ Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();