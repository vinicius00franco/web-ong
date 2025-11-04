import axios from './axios'
import type { Product, ProductsResponse } from '../types/product'
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

  /**
   * Normaliza um item de produto para o tipo Product (camelCase + tipos corretos)
   */
  private normalizeProduct(item: any): Product {
    const priceNumber = typeof item?.price === 'string' ? parseFloat(item.price) : item?.price
    return {
      id: String(item.id),
      name: item.name,
      description: item.description ?? '',
      price: Number.isFinite(priceNumber) ? priceNumber : 0,
      categoryId: item.categoryId ?? item.category_id ?? 0,
      imageUrl: item.imageUrl ?? item.image_url ?? '',
      stockQty: item.stockQty ?? item.stock_qty ?? 0,
      weightGrams: item.weightGrams ?? item.weight_grams ?? 0,
      organizationId: item.organizationId ?? item.organization_id ?? '',
      createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? item.updated_at ?? undefined,
    } as Product
  }

  /**
   * Normaliza diferentes formatos de resposta do catálogo público
   */
  private normalizeProductsResponse(response: any, paging?: { page?: number; limit?: number }): ProductsResponse {
    const page = paging?.page ?? response?.page ?? 1
    const limit = paging?.limit ?? response?.limit ?? (Array.isArray(response) ? response.length : 12)

    // Array direto
    if (Array.isArray(response)) {
      return {
        products: response.map((p) => this.normalizeProduct(p)),
        total: response.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(response.length / limit)),
      }
    }

    // { success: true, data: [...] }
    if (response?.success && Array.isArray(response.data)) {
      return {
        products: response.data.map((p: any) => this.normalizeProduct(p)),
        total: response.total ?? response.data.length,
        page,
        limit,
        totalPages: response.totalPages ?? Math.max(1, Math.ceil((response.total ?? response.data.length) / limit)),
      }
    }

    // { products, total, page, limit }
    if (Array.isArray(response?.products)) {
      return {
        products: response.products.map((p: any) => this.normalizeProduct(p)),
        total: response.total ?? response.products.length,
        page: response.page ?? page,
        limit: response.limit ?? limit,
        totalPages: response.totalPages ?? Math.max(1, Math.ceil((response.total ?? response.products.length) / (response.limit ?? limit))),
      }
    }

    // { data: { products|items, total, page, limit } } ou { data: [...] }
    if (response?.data) {
      const dataObj = response.data
      const payload = Array.isArray(dataObj)
        ? dataObj
        : (Array.isArray(dataObj.products)
            ? dataObj.products
            : (Array.isArray(dataObj.items) ? dataObj.items : []))

      const total = dataObj.total ?? payload.length
      const pageData = dataObj.page ?? page
      const limitData = dataObj.limit ?? limit
      return {
        products: (payload as any[]).map((p: any) => this.normalizeProduct(p)),
        total,
        page: pageData,
        limit: limitData,
        totalPages: Math.max(1, Math.ceil(total / (limitData || 1))),
      }
    }

    // fallback
    return { products: [], total: 0, page, limit, totalPages: 0 }
  }

  async getProducts(filters: PublicProductFilters = {}): Promise<ProductsResponse> {
    if (this.useMock) {
      const res = await mockPublicProductsService.getProducts(filters)
      return {
        ...res,
        products: res.products.map((p) => this.normalizeProduct(p)),
      }
    }

    const limit = filters.limit ?? 12
    const page = filters.page ?? 1
    const params: Record<string, any> = {
      category: filters.category,
      minPrice: filters.priceMin,
      maxPrice: filters.priceMax,
      limit,
      offset: (page - 1) * limit,
      page,
    }

    // Remove undefined para não poluir a query
    Object.keys(params).forEach((k) => params[k] === undefined && delete params[k])

    const { data } = await axios.get('/api/public/catalog', { params })
    return this.normalizeProductsResponse(data, { page, limit })
  }
}

export const publicProductsService = new PublicProductsService()
