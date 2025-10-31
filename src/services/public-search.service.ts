import axios from 'axios'
import './axios-logger'
import { logSearchAI } from './logger'
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
      const resp = await mockPublicSearchService.search(query)
      // RN-LOG-02: log específico da busca
      logSearchAI({
        type: 'search_ai',
        inputText: query,
        filters: resp.interpretation,
        aiSuccess: !!resp.interpretation,
        fallbackApplied: resp.fallbackApplied,
      })
      return resp
    }

    const { data } = await axios.get('/api/public/search', { params: { q: query } })
    logSearchAI({
      type: 'search_ai',
      inputText: query,
      filters: (data as PublicSearchResponse).interpretation,
      aiSuccess: !!(data as PublicSearchResponse).interpretation,
      fallbackApplied: (data as PublicSearchResponse).fallbackApplied,
    })
    return data
  }
}

export const publicSearchService = new PublicSearchService()
