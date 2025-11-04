import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDashboard, useDashboardStats, useDashboardActivities } from '../useDashboard';
import { useDashboardStore } from '../../stores/dashboardStore';

// Mock the store
vi.mock('../../stores/dashboardStore');

const mockUseDashboardStore = vi.mocked(useDashboardStore);

describe('useDashboard hooks', () => {
  const mockStore = {
    data: null,
    stats: null,
    activities: [],
    loading: false,
    error: null,
    fetchDashboardData: vi.fn(),
    fetchStats: vi.fn(),
    fetchActivities: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDashboardStore.mockReturnValue(mockStore);
  });

  describe('useDashboard', () => {
    it('should fetch data on mount when no data exists', () => {
      renderHook(() => useDashboard());
      
      expect(mockStore.fetchDashboardData).toHaveBeenCalledOnce();
    });

    it('should not fetch data when already loading', () => {
      mockUseDashboardStore.mockReturnValue({
        ...mockStore,
        loading: true
      });

      renderHook(() => useDashboard());
      
      expect(mockStore.fetchDashboardData).not.toHaveBeenCalled();
    });

    it('should not fetch data when data already exists', () => {
      mockUseDashboardStore.mockReturnValue({
        ...mockStore,
        data: { recentProducts: [], donationsChart: [] }
      });

      renderHook(() => useDashboard());
      
      expect(mockStore.fetchDashboardData).not.toHaveBeenCalled();
    });

    it('should return correct data structure', () => {
      const mockData = {
        recentProducts: [{ id: 1, name: 'Test' }],
        donationsChart: [{ label: 'Jan', value: 100 }],
        recentActivities: [{ id: '1', user: 'Test', action: 'created' }],
        volunteersChart: [],
        projectsStatus: []
      };

      mockUseDashboardStore.mockReturnValue({
        ...mockStore,
        data: mockData
      });

      const { result } = renderHook(() => useDashboard());
      
      expect(result.current.recentProducts).toEqual(mockData.recentProducts);
      expect(result.current.donationsChart).toEqual(mockData.donationsChart);
      expect(result.current.recentActivities).toEqual(mockData.recentActivities);
    });
  });

  describe('useDashboardStats', () => {
    it('should fetch stats on mount when no stats exist', () => {
      renderHook(() => useDashboardStats());
      
      expect(mockStore.fetchStats).toHaveBeenCalledOnce();
    });

    it('should not fetch stats when already exist', () => {
      mockUseDashboardStore.mockReturnValue({
        ...mockStore,
        stats: { totalProducts: 10, totalOrganizations: 5 }
      });

      renderHook(() => useDashboardStats());
      
      expect(mockStore.fetchStats).not.toHaveBeenCalled();
    });
  });

  describe('useDashboardActivities', () => {
    it('should fetch activities on mount when no activities exist', () => {
      renderHook(() => useDashboardActivities());
      
      expect(mockStore.fetchActivities).toHaveBeenCalledOnce();
    });

    it('should not fetch activities when already exist', () => {
      mockUseDashboardStore.mockReturnValue({
        ...mockStore,
        activities: [{ id: '1', user: 'Test', action: 'created' }]
      });

      renderHook(() => useDashboardActivities());
      
      expect(mockStore.fetchActivities).not.toHaveBeenCalled();
    });
  });
});