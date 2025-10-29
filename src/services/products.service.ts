import axios from 'axios';
import type { Product, CreateProductData, UpdateProductData, ProductFilters, ProductsResponse } from '../types/product';

export const productsService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await axios.get('/api/products', { params: { page: 1, limit: 10, ...filters } });
    return data;
  },

  async getProduct(id: string): Promise<Product> {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  },

  async createProduct(productData: CreateProductData): Promise<Product> {
    const { data } = await axios.post('/api/products', productData);
    return data;
  },

  async updateProduct(productData: UpdateProductData): Promise<Product> {
    const { id, ...updateData } = productData;
    const { data } = await axios.put(`/api/products/${id}`, updateData);
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    await axios.delete(`/api/products/${id}`);
  },
};