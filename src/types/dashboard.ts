/**
 * Tipos e interfaces para o Dashboard
 */

export interface DashboardStats {
  products: number;
  donations: number;
  volunteers: number;
  projects: number;
}

export interface RecentProduct {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'low-stock' | 'reserved';
  quantity: number;
  image: string;
  addedAt: string;
}

export interface DonationChartData {
  label: string;
  value: number;
}

export interface TopProductData {
  label: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: 'donation' | 'product' | 'volunteer';
  user: string;
  action: string;
  target: string;
  timestamp: string;
  icon: string;
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

export interface DashboardData {
  stats: DashboardStats;
  recentProducts: RecentProduct[];
  donationsChart: DonationChartData[];
  topProducts: TopProductData[];
  recentActivities: RecentActivity[];
  volunteersChart: VolunteerChartData[];
  projectsStatus: ProjectStatus[];
}