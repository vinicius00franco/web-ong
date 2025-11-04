import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats, DashboardActivity, DashboardData } from '../types/dashboard';

interface DashboardState {
  // Data
  data: DashboardData | null;
  stats: DashboardStats | null;
  activities: DashboardActivity[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  data: null,
  stats: null,
  activities: [],
  loading: false,
  error: null,

  // Fetch complete dashboard data (legacy compatibility)
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    
    try {
      const data = await dashboardService.getDashboardData();
      set({ data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch dashboard stats
  fetchStats: async () => {
    set({ loading: true, error: null });
    
    try {
      const stats = await dashboardService.getDashboardStats();
      set({ stats, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar estatísticas';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch dashboard activities
  fetchActivities: async () => {
    set({ loading: true, error: null });
    
    try {
      const activities = await dashboardService.getDashboardActivities();
      set({ activities, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar atividades';
      set({ error: errorMessage, loading: false });
    }
  },

  // Reset store state
  reset: () => {
    set({
      data: null,
      stats: null,
      activities: [],
      loading: false,
      error: null
    });
  }
}));