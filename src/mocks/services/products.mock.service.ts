import type { Product, ProductFilters, ProductsResponse, CreateProductData, UpdateProductData } from '../../types/product';
import productsData from '../data/products.mock.json';
import { configManager } from '../../config/app.config';

/**
 * Simula latência de rede
 */
const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Gera ID único para novos produtos
 */
const generateId = (): string => {
  return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Service de produtos mockados
 */
class MockProductsService {
  private products: Product[] = this.normalizeProducts(productsData);

  private normalizeProducts(data: any[]): Product[] {
    return data.map(p => ({
      id: String(p.id),
      name: p.name,
      description: p.description ?? '',
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      category: p.category ?? undefined,
      categoryId: p.categoryId ?? p.category_id ?? 0,
      imageUrl: p.imageUrl ?? p.image_url ?? '',
      stockQty: p.stockQty ?? p.stock_qty ?? 0,
      weightGrams: p.weightGrams ?? p.weight_grams ?? 0,
      organizationId: p.organizationId ?? p.organization_id ?? '',
      createdAt: p.createdAt ?? p.created_at ?? new Date().toISOString(),
      updatedAt: p.updatedAt ?? p.updated_at ?? undefined,
    }));
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    await simulateDelay();

    let filtered = [...this.products];

    // Filtro por categoria
    if (filters.categoryId) {
      filtered = filtered.filter(p => 
        p.categoryId === filters.categoryId
      );
    }

    // Filtro por nome
    if (filters.name) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.name?.toLowerCase() || '')
      );
    }

    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getProduct(id: string): Promise<Product> {
    await simulateDelay();

    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    await simulateDelay();

    const newProduct: Product = {
      ...productData,
      id: generateId(),
      organizationId: 'org-001', // Fixo para mock
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(productData: UpdateProductData): Promise<Product> {
    await simulateDelay();

    const index = this.products.findIndex(p => p.id === productData.id);
    if (index === -1) {
      throw new Error(`Produto com ID ${productData.id} não encontrado`);
    }

    const { id, ...updateData } = productData;
    const updatedProduct: Product = {
      ...this.products[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await simulateDelay();

    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }

    this.products.splice(index, 1);
  }

  // Método para resetar dados ao estado inicial
  reset(): void {
    this.products = this.normalizeProducts(productsData);
  }
}

export const mockProductsService = new MockProductsService();
