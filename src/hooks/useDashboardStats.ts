import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats } from '../types/dashboard';

/**
 * Hook customizado para buscar estatísticas do dashboard
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await dashboardService.getDashboardData();
        setStats(dashboardData.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
        console.error('Erro ao buscar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};