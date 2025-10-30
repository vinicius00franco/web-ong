import { memo } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  fillColor?: string;
  showGrid?: boolean;
  showLabels?: boolean;
}

/**
 * Componente de gráfico de linha simples usando SVG puro
 * Sem dependências externas - performance otimizada
 */
const LineChart = memo<LineChartProps>(({
  data,
  height = 200,
  color = '#0d6efd',
  fillColor = 'rgba(13, 110, 253, 0.1)',
  showGrid = true,
  showLabels = true,
}) => {
  if (!data || data.length === 0) {
    return <div className="text-muted text-center py-4">Sem dados para exibir</div>;
  }

  const padding = { top: 20, right: 20, bottom: showLabels ? 40 : 20, left: 50 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  // Calcula pontos do gráfico
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Cria path para linha
  const linePath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  // Cria path para área preenchida
  const areaPath = `
    M ${points[0].x} ${padding.top + chartHeight}
    L ${points[0].x} ${points[0].y}
    ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
    L ${points[points.length - 1].x} ${padding.top + chartHeight}
    Z
  `;

  // Linhas de grade horizontais
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const y = padding.top + chartHeight * (1 - ratio);
    const value = minValue + valueRange * ratio;
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

        {/* Área preenchida */}
        <path
          d={areaPath}
          fill={fillColor}
        />

        {/* Linha */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
            />
            {/* Labels */}
            {showLabels && (
              <text
                x={point.x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#6c757d"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
});

LineChart.displayName = 'LineChart';

export default LineChart;
