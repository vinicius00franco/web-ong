import React, { memo } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  onClick?: () => void;
}

/**
 * Card individual de estatística
 */
const StatCard = memo<StatCardProps>(({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  onClick
}) => {
  return (
    <div 
      className={`card border-0 shadow-sm h-100 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {title}
            </h6>
            <h3 className="mb-2 fw-bold">{value}</h3>
            {trend && (
              <small className={`d-flex align-items-center ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  fill="currentColor" 
                  className="me-1" 
                  viewBox="0 0 16 16"
                >
                  {trend.isPositive ? (
                    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                  ) : (
                    <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                  )}
                </svg>
                <span className="fw-semibold">{Math.abs(trend.value)}%</span>
                <span className="text-muted ms-1">{trend.label}</span>
              </small>
            )}
          </div>
          <div className={`bg-${color} bg-opacity-10 p-3 rounded`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
