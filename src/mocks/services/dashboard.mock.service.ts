import type {
  DashboardData,
  DashboardStats,
  RecentProduct,
  DonationChartData,
  TopProductData,
  RecentActivity,
  VolunteerChartData,
  ProjectStatus,
} from '../../types/dashboard';

/**
 * Service mockado para dados do Dashboard
 * Simula respostas da API com dados fake
 */
class DashboardMockService {
  async getDashboardData(): Promise<DashboardData> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      stats: this.getStats(),
      recentProducts: this.getRecentProducts(),
      donationsChart: this.getDonationsChart(),
      topProducts: this.getTopProducts(),
      recentActivities: this.getRecentActivities(),
      volunteersChart: this.getVolunteersChart(),
      projectsStatus: this.getProjectsStatus(),
    };
  }

  private getStats(): DashboardStats {
    return {
      products: 24,
      donations: 12450, // em centavos ou reais?
      volunteers: 48,
      projects: 7,
    };
  }

  private getRecentProducts(): RecentProduct[] {
    return [
      {
        id: '1',
        name: 'Cesta Básica Completa',
        category: 'Alimentos',
        status: 'available',
        quantity: 45,
        image: 'https://via.placeholder.com/60x60/0d6efd/ffffff?text=CB',
        addedAt: new Date(2025, 9, 28).toISOString(),
      },
      {
        id: '2',
        name: 'Agasalho Infantil',
        category: 'Roupas',
        status: 'low-stock',
        quantity: 8,
        image: 'https://via.placeholder.com/60x60/198754/ffffff?text=AI',
        addedAt: new Date(2025, 9, 27).toISOString(),
      },
      {
        id: '3',
        name: 'Kit Higiene Pessoal',
        category: 'Higiene',
        status: 'available',
        quantity: 32,
        image: 'https://via.placeholder.com/60x60/ffc107/000000?text=KH',
        addedAt: new Date(2025, 9, 26).toISOString(),
      },
      {
        id: '4',
        name: 'Livros Didáticos',
        category: 'Educação',
        status: 'reserved',
        quantity: 15,
        image: 'https://via.placeholder.com/60x60/dc3545/ffffff?text=LD',
        addedAt: new Date(2025, 9, 25).toISOString(),
      },
      {
        id: '5',
        name: 'Brinquedos Educativos',
        category: 'Recreação',
        status: 'available',
        quantity: 21,
        image: 'https://via.placeholder.com/60x60/6f42c1/ffffff?text=BE',
        addedAt: new Date(2025, 9, 24).toISOString(),
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

  private getRecentActivities(): RecentActivity[] {
    return [
      {
        id: '1',
        type: 'donation',
        user: 'Maria Silva',
        action: 'realizou uma doação',
        target: 'R$ 500,00',
        timestamp: new Date(2025, 9, 30, 14, 30).toISOString(),
        icon: '💰',
      },
      {
        id: '2',
        type: 'product',
        user: 'João Santos',
        action: 'adicionou produto',
        target: 'Cesta Básica Completa',
        timestamp: new Date(2025, 9, 30, 12, 15).toISOString(),
        icon: '📦',
      },
      {
        id: '3',
        type: 'volunteer',
        user: 'Ana Costa',
        action: 'se cadastrou como voluntária',
        target: '',
        timestamp: new Date(2025, 9, 30, 10, 45).toISOString(),
        icon: '👥',
      },
      {
        id: '4',
        type: 'product',
        user: 'Pedro Oliveira',
        action: 'reservou produto',
        target: 'Livros Didáticos (5 unidades)',
        timestamp: new Date(2025, 9, 29, 16, 20).toISOString(),
        icon: '🔖',
      },
      {
        id: '5',
        type: 'donation',
        user: 'Carla Mendes',
        action: 'realizou uma doação',
        target: 'R$ 250,00',
        timestamp: new Date(2025, 9, 29, 14, 10).toISOString(),
        icon: '💰',
      },
      {
        id: '6',
        type: 'product',
        user: 'Admin',
        action: 'atualizou estoque',
        target: 'Kit Higiene Pessoal',
        timestamp: new Date(2025, 9, 29, 9, 30).toISOString(),
        icon: '📝',
      },
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