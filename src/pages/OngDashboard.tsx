import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardWidgets } from '../hooks/useDashboardWidgets';
import DashboardWidget from '../components/DashboardWidget';
import DashboardStats from '../components/DashboardStats';
import DashboardSettings from '../components/DashboardSettings';

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
          <div className="text-center text-muted py-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-3 opacity-25" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <p className="small mb-2">Nenhum produto recente</p>
            <Link to="/ong/products/new" className="btn btn-sm btn-primary">Adicionar Produto</Link>
          </div>
        );
        
      case 'donations-chart':
        return (
          <div className="text-center text-muted py-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-3 opacity-25" viewBox="0 0 16 16">
              <path d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"/>
            </svg>
            <p className="small mb-0">Gráfico de doações em desenvolvimento</p>
          </div>
        );
        
      case 'activities':
        return (
          <div className="text-center text-muted py-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-3 opacity-25" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
            <p className="small mb-0">Nenhuma atividade recente</p>
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
          <div className="text-center text-muted py-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-3 opacity-25" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
            <p className="small mb-0">Dados de voluntários em desenvolvimento</p>
          </div>
        );
        
      case 'projects-status':
        return (
          <div className="text-center text-muted py-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mb-3 opacity-25" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
            </svg>
            <p className="small mb-0">Status de projetos em desenvolvimento</p>
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
          <h1 className="h2 mb-1">Dashboard da ONG</h1>
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
          
          // Outros widgets ocupam metade da largura em telas médias
          return (
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
          );
        })}
      </div>

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
      <div className="alert alert-info mt-4" role="alert">
        <strong>ℹ️ Modo de Desenvolvimento:</strong> Os dados exibidos são mockados. 
        Acesse a seção de <Link to="/ong/products" className="alert-link">Produtos</Link> para começar a gerenciar itens.
      </div>

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