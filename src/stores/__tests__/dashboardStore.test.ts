import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDashboardStore } from '../dashboardStore';
import { dashboardService } from '../../services/dashboard.service';

// Mock do serviço
vi.mock('../../services/dashboard.service');

const mockDashboardService = vi.mocked(dashboardService);

describe('Dashboard Store', () => {
  beforeEach(() => {
    // Reset store state
    useDashboardStore.getState().reset();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useDashboardStore.getState();
      
      expect(state.data).toBeNull();
      expect(state.stats).toBeNull();
      expect(state.activities).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchDashboardData', () => {
    it('should fetch dashboard data successfully', async () => {
      const mockData = {
        recentProducts: [{ id: 1, name: 'Test Product' }],
        donationsChart: [{ label: 'Jan', value: 100 }],
        recentActivities: [{ id: '1', user: 'Test User', action: 'created' }]
      };

      mockDashboardService.getDashboardData.mockResolvedValue(mockData);

      const { fetchDashboardData } = useDashboardStore.getState();
      
      await fetchDashboardData();
      
      const state = useDashboardStore.getState();
      expect(state.data).toEqual(mockData);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Network error';
      mockDashboardService.getDashboardData.mockRejectedValue(new Error(errorMessage));

      const { fetchDashboardData } = useDashboardStore.getState();
      
      await fetchDashboardData();
      
      const state = useDashboardStore.getState();
      expect(state.data).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      mockDashboardService.getDashboardData.mockReturnValue(promise);

      const { fetchDashboardData } = useDashboardStore.getState();
      
      const fetchPromise = fetchDashboardData();
      
      // Check loading state
      expect(useDashboardStore.getState().loading).toBe(true);
      
      // Resolve promise
      resolvePromise!({});
      await fetchPromise;
      
      expect(useDashboardStore.getState().loading).toBe(false);
    });
  });

  describe('fetchStats', () => {
    it('should fetch stats successfully', async () => {
      const mockStats = { totalProducts: 10, totalOrganizations: 5 };
      mockDashboardService.getDashboardStats.mockResolvedValue(mockStats);

      const { fetchStats } = useDashboardStore.getState();
      
      await fetchStats();
      
      const state = useDashboardStore.getState();
      expect(state.stats).toEqual(mockStats);
    });
  });

  describe('fetchActivities', () => {
    it('should fetch activities successfully', async () => {
      const mockActivities = [{ id: '1', user: 'Test', action: 'created' }];
      mockDashboardService.getDashboardActivities.mockResolvedValue(mockActivities);

      const { fetchActivities } = useDashboardStore.getState();
      
      await fetchActivities();
      
      const state = useDashboardStore.getState();
      expect(state.activities).toEqual(mockActivities);
    });
  });
});