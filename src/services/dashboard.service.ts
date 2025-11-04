import axios from 'axios';
import './axios-logger';
import type { DashboardStats, DashboardActivity } from '../types/dashboard';
import { configManager } from '../config/app.config';
import { dashboardMockService } from '../mocks';

/**
 * Service de dashboard com suporte a dados mockados ou API real
 */
class DashboardService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    if (this.useMock) {
      return dashboardMockService.getDashboardStats();
    }

    const { data } = await axios.get('/api/dashboard/stats');
    return data.data;
  }

  async getDashboardActivities(): Promise<DashboardActivity[]> {
    if (this.useMock) {
      return dashboardMockService.getDashboardActivities();
    }

    const { data } = await axios.get('/api/dashboard/activities');
    return data.data;
  }

  // Método legado para compatibilidade
  async getDashboardData() {
    if (this.useMock) {
      return dashboardMockService.getDashboardData();
    }

    const { data } = await axios.get('/api/dashboard');
    return data;
  }
}

export const dashboardService = new DashboardService();