import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardWidgets } from '../hooks/useDashboardWidgets';
import { useDashboard } from '../hooks/useDashboard';
import DashboardWidget from '../components/DashboardWidget';
import DashboardStats from '../components/DashboardStats';
import DashboardSettings from '../components/DashboardSettings';
import SwipeContainer from '../components/SwipeContainer';
import { LineChart, BarChart } from '../components/SimpleChart';
import { configManager } from '../config/app.config';

const OngDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    visibleWidgets,
    widgets,
    toggleWidget,
    moveWidgetUp,
    moveWidgetDown,
    resetWidgets,
  } = useDashboardWidgets();

  // Hook unificado do dashboard (evita múltiplas requisições e deprecations)
  const {
    donationsChart,
    volunteersChart,
    projectsStatus,
    activities,
    recentProducts,
  } = useDashboard();

  const isMock = configManager.getConfig().useMockData;

  const asRecentDisplay = (p: any) => ({
    id: String(p.id),
    name: p.name,
    category: p.category,
    organization: 'organization' in p ? p.organization : '—',
    price: 'price' in p ? Number(p.price) : 0,
    createdAt: 'createdAt' in p ? p.createdAt : ('addedAt' in p ? p.addedAt : new Date().toISOString()),
  });

  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/ong' },
  ];

  /**
   * Renderiza o conteúdo de cada widget baseado no ID
   */
  const renderWidgetContent = (widgetId: string) => {
    switch (widgetId) {
      case 'stats':
        return <DashboardStats />;
        
      case 'recent-products':
        return (
          <div className="list-group list-group-flush">
            {(recentProducts || []).map(raw => {
              const product = asRecentDisplay(raw);
              return (
              <div key={product.id} className="list-group-item border-0 px-0">
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>📦</span>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{product.name}</h6>
                    <small className="text-muted">{product.category} • {product.organization}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">R$ {product.price.toFixed(2)}</div>
                    <small className="text-muted">
                      {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                </div>
              </div>
              );
            })}
            <div className="text-center pt-3">
              <Link to="/ong/products" className="btn btn-sm btn-outline-primary">
                Ver Todos os Produtos
              </Link>
            </div>
          </div>
        );
        
      case 'donations-chart':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="text-muted mb-0">Total Arrecadado</h6>
                <h3 className="mb-0">
                  R$ {(donationsChart || []).reduce((sum, d) => sum + d.value, 0).toLocaleString('pt-BR')}
                </h3>
              </div>
              <span className="badge bg-success">
                {(donationsChart || []).length >= 2
                  ? `+${Math.round(((donationsChart![donationsChart!.length - 1].value / donationsChart![donationsChart!.length - 2].value) - 1) * 100)}% vs mês anterior`
                  : '+0% vs mês anterior'
                }
              </span>
            </div>
            <LineChart 
              data={donationsChart || []}
              height={220}
              color="#198754"
              fillColor="rgba(25, 135, 84, 0.1)"
            />
          </div>
        );
        
      case 'activities':
        return (
          <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {(activities || []).map(activity => {
              const timeAgo = (timestamp: string) => {
                const now = new Date();
                const activityDate = new Date(timestamp);
                const diffMs = now.getTime() - activityDate.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                if (diffMins < 60) return `${diffMins}min atrás`;
                if (diffHours < 24) return `${diffHours}h atrás`;
                return `${diffDays}d atrás`;
              };

              const getIcon = (type: string) => {
                switch (type) {
                  case 'product': return '📦';
                  case 'search': return '🔍';
                  case 'donation': return '💰';
                  default: return '📝';
                }
              };

              return (
                <div key={activity.id} className="list-group-item border-0 px-0 py-2">
                  <div className="d-flex align-items-start">
                    <div className="me-3" style={{ fontSize: '1.5rem' }}>
                      {getIcon(activity.type)}
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 small">
                        <strong>{activity.user}</strong> {activity.action}
                        {activity.target && <> <span className="text-primary">{activity.target}</span></>}
                      </p>
                      <small className="text-muted">{timeAgo(activity.timestamp)}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
        
      case 'quick-actions':
        return (
          <div className="row g-2">
            <div className="col-6 col-md-4">
              <Link to="/ong/products/new" className="btn btn-outline-primary w-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="d-block mx-auto mb-2" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Novo Produto
              </Link>
            </div>
            <div className="col-6 col-md-4">
              <Link to="/ong/products" className="btn btn-outline-secondary w-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="d-block mx-auto mb-2" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                </svg>
                Ver Produtos
              </Link>
            </div>
            <div className="col-6 col-md-4">
              <button className="btn btn-outline-success w-100" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="d-block mx-auto mb-2" viewBox="0 0 16 16">
                  <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z"/>
                  <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z"/>
                </svg>
                Nova Doação
              </button>
            </div>
          </div>
        );
        
      case 'volunteers-chart':
        return (
          <div>
            <div className="mb-3">
              <h6 className="text-muted mb-0">Voluntários Ativos esta Semana</h6>
              <h3 className="mb-0">{(volunteersChart || []).reduce((sum, d) => sum + d.value, 0)}</h3>
            </div>
            <BarChart 
              data={volunteersChart || []}
              height={200}
            />
          </div>
        );
        
      case 'projects-status':
        return (
          <div className="list-group list-group-flush">
            {(projectsStatus || []).map(project => (
              <div key={project.id} className="list-group-item border-0 px-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">{project.name}</h6>
                  <span className={`badge ${project.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                    {project.status === 'active' ? 'Ativo' : 'Planejamento'}
                  </span>
                </div>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${project.progress}%` }}
                    aria-valuenow={project.progress} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>{project.current} / {project.goal} itens</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return <p className="text-muted">Widget desconhecido</p>;
    }
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      
      {/* Header do Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">ONG Dashboard</h1>
          <p className="text-muted mb-0">Bem-vindo(a), {user?.name}!</p>
        </div>
        
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${editMode ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setEditMode(!editMode)}
            title={editMode ? 'Sair do modo de edição' : 'Editar widgets'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
            {editMode ? 'Sair da Edição' : 'Editar'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowSettings(true)}
            title="Configurar widgets"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Grid de Widgets */}
      <div className="row g-3">
        {visibleWidgets.map(widget => {
          // Stats widget ocupa toda a largura
          if (widget.id === 'stats') {
            return (
              <div key={widget.id} className="col-12">
                {renderWidgetContent(widget.id)}
              </div>
            );
          }
          
          return null; // Renderizado no SwipeContainer abaixo
        })}
      </div>

      {/* Widgets com SwipeContainer em telas < 1000px */}
      {visibleWidgets.filter(w => w.id !== 'stats').length > 0 && (
        <SwipeContainer
          itemsPerView={1}
          gap={16}
          showIndicators={true}
          breakpoint={1000}
          className="row g-3 mt-3"
        >
          {visibleWidgets
            .filter(w => w.id !== 'stats')
            .map(widget => (
              <div key={widget.id} className="col-12 col-lg-6">
                <DashboardWidget
                  id={widget.id}
                  title={widget.name}
                  showControls={editMode}
                  onMoveUp={() => moveWidgetUp(widget.id)}
                  onMoveDown={() => moveWidgetDown(widget.id)}
                  onToggleVisibility={() => toggleWidget(widget.id)}
                >
                  {renderWidgetContent(widget.id)}
                </DashboardWidget>
              </div>
            ))}
        </SwipeContainer>
      )}

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <div className="text-center py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="text-muted mb-3 opacity-25" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
          </svg>
          <h4 className="text-muted mb-3">Nenhum widget visível</h4>
          <p className="text-muted mb-3">Configure quais widgets você deseja visualizar no dashboard</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowSettings(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
            Configurar Widgets
          </button>
        </div>
      )}

      {/* Info sobre dados mockados */}
      {isMock && (
        <div className="alert alert-info mt-4" role="alert">
          <strong>ℹ️ Modo de Desenvolvimento:</strong> Os dados exibidos são mockados.
          Acesse a seção de <Link to="/ong/products" className="alert-link">Produtos</Link> para começar a gerenciar itens.
        </div>
      )}

      {/* Modal de Configurações */}
      {showSettings && (
        <DashboardSettings
          widgets={widgets}
          onToggleWidget={toggleWidget}
          onMoveUp={moveWidgetUp}
          onMoveDown={moveWidgetDown}
          onReset={resetWidgets}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default OngDashboard;