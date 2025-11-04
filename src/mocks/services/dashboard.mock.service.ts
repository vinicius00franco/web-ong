import type {
  DashboardData,
  DashboardStats,
  RecentProduct,
  DonationChartData,
  TopProductData,
  DashboardActivity,
  VolunteerChartData,
  ProjectStatus,
  ProductByCategory,
  ProductByOrganization,
  SearchMetrics,
} from '../../types/dashboard';

// Tipo legado para compatibilidade
interface LegacyDashboardStats {
  products: number;
  donations: number;
  volunteers: number;
  projects: number;
}

interface LegacyRecentProduct {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'low-stock' | 'reserved';
  quantity: number;
  image: string;
  addedAt: string;
}

/**
 * Service mockado para dados do Dashboard
 * Simula respostas da API com dados fake
 */
class DashboardMockService {
  async getDashboardStats(): Promise<DashboardStats> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      totalProducts: 25,
      totalOrganizations: 1,
      totalCategories: 5,
      totalInventoryValue: 15750.50,
      averageProductPrice: 35.75,
      totalStockQuantity: 450,
      productsByCategory: this.getProductsByCategory(),
      productsByOrganization: this.getProductsByOrganization(),
      recentProducts: this.getRecentProducts(),
      searchMetrics: this.getSearchMetrics(),
    };
  }

  async getDashboardActivities(): Promise<DashboardActivity[]> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    return [
      {
        id: "product_123",
        user: "Sistema",
        action: "adicionou",
        target: "Brigadeiro Gourmet",
        timestamp: "2025-01-11T10:30:00.000Z",
        icon: "package",
        type: "product"
      },
      {
        id: "search_456",
        user: "Usuário",
        action: "pesquisou",
        target: "doces até 20 reais",
        timestamp: "2025-01-11T09:15:00.000Z",
        icon: "search",
        type: "search"
      },
      {
        id: "product_789",
        user: "João Silva",
        action: "atualizou",
        target: "Cesta Básica",
        timestamp: "2025-01-11T08:45:00.000Z",
        icon: "edit",
        type: "product"
      },
      {
        id: "donation_101",
        user: "Maria Santos",
        action: "doou",
        target: "R$ 150,00",
        timestamp: "2025-01-11T07:30:00.000Z",
        icon: "heart",
        type: "donation"
      }
    ];
  }

  private getProductsByCategory(): ProductByCategory[] {
    return [
      {
        category: "Doces",
        count: 10,
        percentage: 40.0
      },
      {
        category: "Alimentos",
        count: 8,
        percentage: 32.0
      },
      {
        category: "Higiene",
        count: 4,
        percentage: 16.0
      },
      {
        category: "Roupas",
        count: 2,
        percentage: 8.0
      },
      {
        category: "Outros",
        count: 1,
        percentage: 4.0
      }
    ];
  }

  private getProductsByOrganization(): ProductByOrganization[] {
    return [
      {
        organization: "ONG Exemplo",
        count: 25,
        stock: 450
      }
    ];
  }

  private getRecentProducts(): RecentProduct[] {
    return [
      {
        id: 123,
        name: "Brigadeiro Gourmet",
        price: 15.99,
        category: "Doces",
        organization: "ONG Exemplo",
        createdAt: "2025-01-11T10:30:00.000Z"
      },
      {
        id: 124,
        name: "Cesta Básica Completa",
        price: 45.50,
        category: "Alimentos",
        organization: "ONG Exemplo",
        createdAt: "2025-01-10T14:20:00.000Z"
      },
      {
        id: 125,
        name: "Kit Higiene Pessoal",
        price: 28.75,
        category: "Higiene",
        organization: "ONG Exemplo",
        createdAt: "2025-01-09T09:15:00.000Z"
      }
    ];
  }

  private getSearchMetrics(): SearchMetrics {
    return {
      totalSearches: 150,
      aiUsageRate: 85.5,
      fallbackRate: 12.3,
      averageLatency: 245.8
    };
  }

      // Métodos legados para compatibilidade
  async getDashboardData(): Promise<DashboardData> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    const activities = await this.getDashboardActivities();

    return {
      stats: this.getLegacyStats(),
      recentProducts: this.getLegacyRecentProducts(),
      donationsChart: this.getDonationsChart(),
      topProducts: this.getTopProducts(),
      recentActivities: activities,
      volunteersChart: this.getVolunteersChart(),
      projectsStatus: this.getProjectsStatus(),
    };
  }

  private getLegacyStats(): LegacyDashboardStats {
    return {
      products: 24,
      donations: 12450, // em centavos ou reais?
      volunteers: 48,
      projects: 7,
    };
  }

  private getLegacyRecentProducts(): LegacyRecentProduct[] {
    return [
      {
        id: '1',
        name: 'Cesta Básica Completa',
        category: 'Alimentos',
        status: 'available' as const,
        quantity: 45,
        image: 'https://via.placeholder.com/60x60/0d6efd/ffffff?text=CB',
        addedAt: new Date(2025, 9, 28).toISOString(),
      },
      {
        id: '2',
        name: 'Agasalho Infantil',
        category: 'Roupas',
        status: 'low-stock' as const,
        quantity: 8,
        image: 'https://via.placeholder.com/60x60/198754/ffffff?text=AI',
        addedAt: new Date(2025, 9, 27).toISOString(),
      },
      {
        id: '3',
        name: 'Kit Higiene Pessoal',
        category: 'Higiene',
        status: 'available' as const,
        quantity: 32,
        image: 'https://via.placeholder.com/60x60/ffc107/000000?text=KH',
        addedAt: new Date(2025, 9, 26).toISOString(),
      },
    ];
  }

  private getDonationsChart(): DonationChartData[] {
    return [
      { label: 'Jan', value: 2500 },
      { label: 'Fev', value: 3200 },
      { label: 'Mar', value: 2800 },
      { label: 'Abr', value: 4100 },
      { label: 'Mai', value: 3600 },
      { label: 'Jun', value: 5200 },
      { label: 'Jul', value: 4800 },
      { label: 'Ago', value: 6100 },
      { label: 'Set', value: 5500 },
      { label: 'Out', value: 7200 },
    ];
  }

  private getTopProducts(): TopProductData[] {
    return [
      { label: 'Cestas Básicas', value: 145, color: '#0d6efd' },
      { label: 'Roupas', value: 98, color: '#198754' },
      { label: 'Higiene', value: 76, color: '#ffc107' },
      { label: 'Educação', value: 54, color: '#dc3545' },
      { label: 'Outros', value: 32, color: '#6c757d' },
    ];
  }

  private getVolunteersChart(): VolunteerChartData[] {
    return [
      { label: 'Seg', value: 12 },
      { label: 'Ter', value: 15 },
      { label: 'Qua', value: 18 },
      { label: 'Qui', value: 14 },
      { label: 'Sex', value: 20 },
      { label: 'Sáb', value: 25 },
      { label: 'Dom', value: 22 },
    ];
  }

  private getProjectsStatus(): ProjectStatus[] {
    return [
      {
        id: '1',
        name: 'Campanha do Agasalho 2025',
        progress: 75,
        goal: 1000,
        current: 750,
        status: 'active',
        deadline: '2025-11-30',
      },
      {
        id: '2',
        name: 'Arrecadação de Alimentos',
        progress: 45,
        goal: 500,
        current: 225,
        status: 'active',
        deadline: '2025-12-15',
      },
      {
        id: '3',
        name: 'Natal Solidário',
        progress: 20,
        goal: 2000,
        current: 400,
        status: 'planning',
        deadline: '2025-12-24',
      },
    ];
  }
}

export const dashboardMockService = new DashboardMockService();