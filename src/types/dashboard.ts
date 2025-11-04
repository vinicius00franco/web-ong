/**
 * Tipos e interfaces para o Dashboard
 */

// Tipos para /dashboard/stats
export interface DashboardStats {
  totalProducts: number;
  totalOrganizations: number;
  totalCategories: number;
  totalInventoryValue: number;
  averageProductPrice: number;
  totalStockQuantity: number;
  productsByCategory: ProductByCategory[];
  productsByOrganization: ProductByOrganization[];
  recentProducts: RecentProduct[];
  searchMetrics: SearchMetrics;
}

export interface ProductByCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface ProductByOrganization {
  organization: string;
  count: number;
  stock: number;
}

export interface RecentProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  organization: string;
  createdAt: string;
}

export interface SearchMetrics {
  totalSearches: number;
  aiUsageRate: number;
  fallbackRate: number;
  averageLatency: number;
}

// Tipos para /dashboard/activities
export interface DashboardActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  icon: string;
  type: string;
}

// Tipos legados (para compatibilidade)
export interface DonationChartData {
  label: string;
  value: number;
}

export interface TopProductData {
  label: string;
  value: number;
  color: string;
}

export interface VolunteerChartData {
  label: string;
  value: number;
}

export interface ProjectStatus {
  id: string;
  name: string;
  progress: number;
  goal: number;
  current: number;
  status: 'active' | 'planning';
  deadline: string;
}

// Tipos legados (para compatibilidade)
export interface LegacyDashboardStats {
  products: number;
  donations: number;
  volunteers: number;
  projects: number;
}

export interface LegacyRecentProduct {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'low-stock' | 'reserved';
  quantity: number;
  image: string;
  addedAt: string;
}

export interface DashboardData {
  stats: LegacyDashboardStats | DashboardStats;
  recentProducts: LegacyRecentProduct[] | RecentProduct[];
  donationsChart: DonationChartData[];
  topProducts: TopProductData[];
  recentActivities: DashboardActivity[];
  volunteersChart: VolunteerChartData[];
  projectsStatus: ProjectStatus[];
}