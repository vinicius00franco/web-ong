import axios from './axios';
import './axios-logger';
import type { Category } from '../types/product';
import { configManager } from '../config/app.config';
import { mockCategoriesService } from '../mocks';

/**
 * Service de categorias com suporte a dados mockados ou API real
 */
class CategoriesService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getCategories(): Promise<Category[]> {
    if (this.useMock) {
      return mockCategoriesService.getCategories();
    }

    const { data } = await axios.get('/api/categories');
    return data.data; // API retorna { success: true, data: Category[] }
  }
}

export const categoriesService = new CategoriesService();