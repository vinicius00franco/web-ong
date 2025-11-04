import axios from './axios'
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

  private normalizeProduct(item: any): Product {
    const priceNumber = typeof item?.price === 'string' ? parseFloat(item.price) : item?.price
    return {
      id: String(item.id),
      name: item.name,
      description: item.description ?? '',
      price: Number.isFinite(priceNumber) ? priceNumber : 0,
      category: item.category ?? undefined,
      categoryId: item.categoryId ?? item.category_id ?? 0,
      imageUrl: item.imageUrl ?? item.image_url ?? '',
      stockQty: item.stockQty ?? item.stock_qty ?? 0,
      weightGrams: item.weightGrams ?? item.weight_grams ?? 0,
      organizationId: item.organizationId ?? item.organization_id ?? '',
      createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? item.updated_at ?? undefined,
    }
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

    // Normalizações possíveis do backend:
    // 1) { interpretation, aiUsed, fallbackApplied, data: [...] }
    // 2) { products: [...] , interpretation?, fallbackApplied? }
    // 3) { success: true, data: { items: [...], interpretation?, fallbackApplied? } }

    const payload = (() => {
      if (Array.isArray((data as any)?.data)) {
        return {
          products: (data as any).data,
          interpretation: (data as any).interpretation,
          fallbackApplied: (data as any).fallbackApplied ?? !(data as any).aiUsed,
        }
      }
      if ((data as any)?.success && (data as any)?.data) {
        const d = (data as any).data
        const items = Array.isArray(d) ? d : (Array.isArray(d.items) ? d.items : [])
        return {
          products: items,
          interpretation: d.interpretation,
          fallbackApplied: !!d.fallbackApplied,
        }
      }
      if (Array.isArray((data as any)?.products)) {
        return {
          products: (data as any).products,
          interpretation: (data as any).interpretation,
          fallbackApplied: !!(data as any).fallbackApplied,
        }
      }
      return { products: [], interpretation: undefined, fallbackApplied: false }
    })()

    const normalized = {
      products: (payload.products as any[]).map((p) => this.normalizeProduct(p)),
      interpretation: payload.interpretation,
      fallbackApplied: payload.fallbackApplied,
    }

    logSearchAI({
      type: 'search_ai',
      inputText: query,
      filters: normalized.interpretation,
      aiSuccess: !!normalized.interpretation,
      fallbackApplied: normalized.fallbackApplied,
    })
    return normalized
  }
}

export const publicSearchService = new PublicSearchService()
