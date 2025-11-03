import type { Category } from '../../types/product';

const categoriesData: Category[] = [
  { id: 1, name: 'Doce', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 2, name: 'Salgado', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 3, name: 'Bebida', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 4, name: 'Higiene', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 5, name: 'Vestuário', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 6, name: 'Educação', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 7, name: 'Alimentos', createdAt: '2025-11-03T00:00:00.000Z' },
];

class MockCategoriesService {
  private categories = [...categoriesData];

  async getCategories(): Promise<Category[]> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.categories];
  }
}

export const mockCategoriesService = new MockCategoriesService();