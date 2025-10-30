import React, { useRef, useState, useEffect, memo } from 'react';
import './SwipeContainer.css';

interface SwipeContainerProps {
  children: React.ReactNode;
  itemsPerView?: number;
  gap?: number;
  showIndicators?: boolean;
  className?: string;
  breakpoint?: number; // Largura em px para ativar swipe
}

/**
 * Container com scroll horizontal para telas pequenas
 * Permite navegação por swipe/arrasto em cards e gráficos
 * Segue princípios de UX responsivo e acessibilidade
 */
const SwipeContainer = memo<SwipeContainerProps>(({
  children,
  itemsPerView = 1,
  gap = 16,
  showIndicators = true,
  className = '',
  breakpoint = 1000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(false);

  // Detecta se deve ativar modo swipe baseado na largura da tela
  useEffect(() => {
    const checkWidth = () => {
      setIsSwipeEnabled(window.innerWidth < breakpoint);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [breakpoint]);

  // Conta total de itens
  useEffect(() => {
    if (containerRef.current) {
      const count = containerRef.current.children.length;
      setTotalItems(count);
    }
  }, [children]);

  // Atualiza índice atual ao fazer scroll
  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / totalItems;
    const index = Math.round(scrollLeft / itemWidth);
    
    setCurrentIndex(index);
  };

  // Navega para um item específico
  const scrollToItem = (index: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const itemWidth = container.scrollWidth / totalItems;
    
    container.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth',
    });
  };

  // Navegação por botões
  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToItem(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(totalItems - 1, currentIndex + 1);
    scrollToItem(newIndex);
  };

  // Se não está em modo swipe, renderiza normalmente
  if (!isSwipeEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`swipe-container-wrapper ${className}`}>
      {/* Container com scroll */}
      <div
        ref={containerRef}
        className="swipe-container"
        onScroll={handleScroll}
        style={{
          gap: `${gap}px`,
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div 
            key={index} 
            className="swipe-item"
            style={{
              minWidth: `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      {totalItems > 1 && (
        <>
          <button
            className="swipe-nav swipe-nav-prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Item anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          
          <button
            className="swipe-nav swipe-nav-next"
            onClick={handleNext}
            disabled={currentIndex >= totalItems - 1}
            aria-label="Próximo item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </>
      )}

      {/* Indicadores de posição */}
      {showIndicators && totalItems > 1 && (
        <div className="swipe-indicators">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              className={`swipe-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => scrollToItem(index)}
              aria-label={`Ir para item ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Dica de swipe para usuários */}
      {currentIndex === 0 && totalItems > 1 && (
        <div className="swipe-hint">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
          <span className="ms-2">Deslize para ver mais</span>
        </div>
      )}
    </div>
  );
});

SwipeContainer.displayName = 'SwipeContainer';

export default SwipeContainer;
