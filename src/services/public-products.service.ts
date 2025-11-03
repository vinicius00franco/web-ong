import axios from 'axios'
import type { ProductsResponse } from '../types/product'
import { configManager } from '../config/app.config'
import { mockPublicProductsService } from '../mocks'

export interface PublicProductFilters {
  category?: string
  name?: string
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
}

class PublicProductsService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData
  }

  async getProducts(filters: PublicProductFilters = {}): Promise<ProductsResponse> {
    if (this.useMock) {
      return mockPublicProductsService.getProducts(filters)
    }

    const { data } = await axios.get('/api/public/catalog', {
      params: { page: 1, limit: 12, ...filters },
    })
    return data
  }
}

export const publicProductsService = new PublicProductsService()
