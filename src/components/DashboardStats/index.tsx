import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import SwipeContainer from '../SwipeContainer';

/**
 * Ícones SVG reutilizáveis
 */
const Icons = {
  Products: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
  ),
  Donations: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-success" viewBox="0 0 16 16">
      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
    </svg>
  ),
  Volunteers: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    </svg>
  ),
  Projects: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-info" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  ),
};

/**
 * Componente de estatísticas gerais do dashboard
 * Segue princípios de composição e reutilização
 */
const DashboardStats = memo(() => {
  const navigate = useNavigate();

  // Dados mockados - em produção viriam de uma API
  const stats = [
    {
      id: 'products',
      title: 'Produtos',
      value: 24,
      icon: Icons.Products,
      color: 'primary' as const,
      trend: { value: 12, isPositive: true, label: 'vs. mês anterior' },
      onClick: () => navigate('/ong/products'),
    },
    {
      id: 'donations',
      title: 'Doações',
      value: 'R$ 12.450',
      icon: Icons.Donations,
      color: 'success' as const,
      trend: { value: 8.5, isPositive: true, label: 'este mês' },
    },
    {
      id: 'volunteers',
      title: 'Voluntários',
      value: 48,
      icon: Icons.Volunteers,
      color: 'warning' as const,
      trend: { value: 3, isPositive: false, label: 'vs. semana anterior' },
    },
    {
      id: 'projects',
      title: 'Projetos Ativos',
      value: 7,
      icon: Icons.Projects,
      color: 'info' as const,
      trend: { value: 2, isPositive: true, label: 'novos este mês' },
    },
  ];

  return (
    <SwipeContainer 
      itemsPerView={1} 
      gap={12}
      showIndicators={true}
      breakpoint={1000}
      className="row g-3"
    >
      {stats.map(stat => (
        <div key={stat.id} className="col-12 col-sm-6 col-lg-3">
          <StatCard {...stat} />
        </div>
      ))}
    </SwipeContainer>
  );
});

DashboardStats.displayName = 'DashboardStats';

export default DashboardStats;
