import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboard.service';
import type { RecentProduct, DonationChartData, DashboardActivity, VolunteerChartData, ProjectStatus, DashboardStats } from '../types/dashboard';

/**
 * Hook customizado para buscar produtos recentes
 */
export const useRecentProducts = () => {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await dashboardService.getDashboardData();
        setProducts(dashboardData.recentProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos recentes');
        console.error('Erro ao buscar produtos recentes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

/**
 * Hook customizado para buscar dados do gráfico de doações
 */
export const useDonationsChart = () => {
  const [data, setData] = useState<DonationChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData.donationsChart);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados de doações');
        console.error('Erro ao buscar dados de doações:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

/**
 * Hook customizado para buscar atividades recentes
 */
export const useRecentActivities = () => {
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await dashboardService.getDashboardData();
        setActivities(dashboardData.recentActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar atividades recentes');
        console.error('Erro ao buscar atividades recentes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};

/**
 * Hook customizado para buscar dados do gráfico de voluntários
 */
export const useVolunteersChart = () => {
  const [data, setData] = useState<VolunteerChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData.volunteersChart);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados de voluntários');
        console.error('Erro ao buscar dados de voluntários:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

/**
 * Hook customizado para buscar status dos projetos
 */
export const useProjectsStatus = () => {
  const [projects, setProjects] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await dashboardService.getDashboardData();
        setProjects(dashboardData.projectsStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar status dos projetos');
        console.error('Erro ao buscar status dos projetos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};

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
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas do dashboard');
        console.error('Erro ao buscar estatísticas do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

/**
 * Hook customizado para buscar atividades do dashboard
 */
export const useDashboardActivities = () => {
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardActivities = await dashboardService.getDashboardActivities();
        setActivities(dashboardActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar atividades do dashboard');
        console.error('Erro ao buscar atividades do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};