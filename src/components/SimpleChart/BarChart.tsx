import { memo } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  showValues?: boolean;
  showGrid?: boolean;
}

/**
 * Componente de gráfico de barras simples usando SVG puro
 */
const BarChart = memo<BarChartProps>(({
  data,
  height = 200,
  showValues = true,
  showGrid = true,
}) => {
  if (!data || data.length === 0) {
    return <div className="text-muted text-center py-4">Sem dados para exibir</div>;
  }

  const padding = { top: 20, right: 20, bottom: 60, left: 50 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = chartWidth / data.length * 0.8;
  const barGap = chartWidth / data.length * 0.2;

  // Linhas de grade
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = padding.top + chartHeight * (1 - ratio);
    const value = maxValue * ratio;
    return { y, value };
  });

  return (
    <div className="w-100 overflow-auto">
      <svg width={width} height={height} className="d-block">
        {/* Grid */}
        {showGrid && gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={padding.left + chartWidth}
              y2={line.y}
              stroke="#dee2e6"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text
              x={padding.left - 10}
              y={line.y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#6c757d"
            >
              {Math.round(line.value)}
            </text>
          </g>
        ))}

        {/* Barras */}
        {data.map((item, i) => {
          const x = padding.left + i * (barWidth + barGap) + barGap / 2;
          const barHeight = (item.value / maxValue) * chartHeight;
          const y = padding.top + chartHeight - barHeight;
          const barColor = item.color || '#0d6efd';

          return (
            <g key={i}>
              {/* Barra */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                rx="4"
                className="transition-all"
                style={{ opacity: 0.8 }}
              />
              
              {/* Valor */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#495057"
                >
                  {item.value}
                </text>
              )}

              {/* Label */}
              <text
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#6c757d"
              >
                {item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;
