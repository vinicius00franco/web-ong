import axios from 'axios'
import type { Product } from '../types/product'
import { configManager } from '../config/app.config'
import { mockPublicSearchService } from '../mocks'

export interface SearchInterpretation {
  category?: string
  priceMax?: number
  priceMin?: number
  raw?: string
}

export interface PublicSearchResponse {
  products: Product[]
  interpretation?: SearchInterpretation
  fallbackApplied: boolean
}

class PublicSearchService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData
  }

  async search(query: string): Promise<PublicSearchResponse> {
    if (this.useMock) {
      return mockPublicSearchService.search(query)
    }

    const { data } = await axios.get('/api/public/search', { params: { q: query } })
    return data
  }
}

export const publicSearchService = new PublicSearchService()
