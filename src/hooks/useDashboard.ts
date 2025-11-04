import { useEffect } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';

/**
 * Hook simplificado que usa o store centralizado do dashboard
 * Substitui os múltiplos hooks individuais
 */
export const useDashboard = () => {
  const {
    data,
    stats,
    activities,
    loading,
    error,
    fetchDashboardData,
    fetchStats,
    fetchActivities
  } = useDashboardStore();

  useEffect(() => {
    // Fetch data only if not already loaded
    if (!data && !loading) {
      fetchDashboardData();
    }
  }, [data, loading, fetchDashboardData]);

  return {
    // Complete dashboard data (legacy compatibility)
    data,
    
    // Individual data pieces
    stats,
    activities,
    recentProducts: data?.recentProducts || [],
    donationsChart: data?.donationsChart || [],
    recentActivities: data?.recentActivities || activities,
    volunteersChart: data?.volunteersChart || [],
    projectsStatus: data?.projectsStatus || [],
    
    // States
    loading,
    error,
    
    // Actions
    refetch: fetchDashboardData,
    fetchStats,
    fetchActivities
  };
};

/**
 * Hook específico para estatísticas do dashboard
 */
export const useDashboardStats = () => {
  const { stats, loading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    if (!stats && !loading) {
      fetchStats();
    }
  }, [stats, loading, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

/**
 * Hook específico para atividades do dashboard
 */
export const useDashboardActivities = () => {
  const { activities, loading, error, fetchActivities } = useDashboardStore();

  useEffect(() => {
    if (activities.length === 0 && !loading) {
      fetchActivities();
    }
  }, [activities.length, loading, fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
};