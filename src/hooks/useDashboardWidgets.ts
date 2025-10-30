import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Interface para configuração de um widget do dashboard
 */
export interface DashboardWidget {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

/**
 * Configuração padrão dos widgets do dashboard
 */
const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'stats', name: 'Estatísticas Gerais', visible: true, order: 0 },
  { id: 'recent-products', name: 'Produtos Recentes', visible: true, order: 1 },
  { id: 'donations-chart', name: 'Gráfico de Doações', visible: true, order: 2 },
  { id: 'activities', name: 'Atividades Recentes', visible: true, order: 3 },
  { id: 'quick-actions', name: 'Ações Rápidas', visible: true, order: 4 },
  { id: 'volunteers-chart', name: 'Voluntários Ativos', visible: false, order: 5 },
  { id: 'projects-status', name: 'Status de Projetos', visible: false, order: 6 },
];

/**
 * Hook customizado para gerenciar estado e configurações dos widgets do dashboard
 * Segue princípio SRP (Single Responsibility Principle)
 */
export const useDashboardWidgets = () => {
  const [widgets, setWidgets] = useLocalStorage<DashboardWidget[]>(
    'dashboard-widgets',
    DEFAULT_WIDGETS
  );

  /**
   * Widgets visíveis ordenados
   */
  const visibleWidgets = useMemo(() => 
    widgets
      .filter(w => w.visible)
      .sort((a, b) => a.order - b.order),
    [widgets]
  );

  /**
   * Alterna visibilidade de um widget
   */
  const toggleWidget = useCallback((widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  }, [setWidgets]);

  /**
   * Atualiza a ordem dos widgets
   */
  const reorderWidgets = useCallback((reorderedWidgets: DashboardWidget[]) => {
    setWidgets(reorderedWidgets.map((widget, index) => ({
      ...widget,
      order: index
    })));
  }, [setWidgets]);

  /**
   * Move um widget para cima na ordem
   */
  const moveWidgetUp = useCallback((widgetId: string) => {
    setWidgets(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex(w => w.id === widgetId);
      
      if (index <= 0) return prev;
      
      const temp = sorted[index - 1].order;
      sorted[index - 1].order = sorted[index].order;
      sorted[index].order = temp;
      
      return sorted;
    });
  }, [setWidgets]);

  /**
   * Move um widget para baixo na ordem
   */
  const moveWidgetDown = useCallback((widgetId: string) => {
    setWidgets(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex(w => w.id === widgetId);
      
      if (index === -1 || index >= sorted.length - 1) return prev;
      
      const temp = sorted[index + 1].order;
      sorted[index + 1].order = sorted[index].order;
      sorted[index].order = temp;
      
      return sorted;
    });
  }, [setWidgets]);

  /**
   * Reseta widgets para configuração padrão
   */
  const resetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, [setWidgets]);

  /**
   * Mostra todos os widgets
   */
  const showAllWidgets = useCallback(() => {
    setWidgets(prev => prev.map(w => ({ ...w, visible: true })));
  }, [setWidgets]);

  /**
   * Esconde todos os widgets
   */
  const hideAllWidgets = useCallback(() => {
    setWidgets(prev => prev.map(w => ({ ...w, visible: false })));
  }, [setWidgets]);

  return {
    widgets,
    visibleWidgets,
    toggleWidget,
    reorderWidgets,
    moveWidgetUp,
    moveWidgetDown,
    resetWidgets,
    showAllWidgets,
    hideAllWidgets,
  };
};
