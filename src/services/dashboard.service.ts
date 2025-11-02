import axios from 'axios';
import './axios-logger';
import type { DashboardData } from '../types/dashboard';
import { configManager } from '../config/app.config';
import { dashboardMockService } from '../mocks';

/**
 * Service de dashboard com suporte a dados mockados ou API real
 */
class DashboardService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getDashboardData(): Promise<DashboardData> {
    if (this.useMock) {
      return dashboardMockService.getDashboardData();
    }

    const { data } = await axios.get('/api/dashboard');
    return data;
  }
}

export const dashboardService = new DashboardService();