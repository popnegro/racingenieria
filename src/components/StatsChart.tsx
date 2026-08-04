import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

interface StatsChartProps {
  id: string;
  title: string;
  subtitle: string;
  type: 'area' | 'bar';
  data: ChartDataPoint[];
  color?: 'zinc' | 'blue' | 'indigo' | 'emerald';
}

export default function StatsChart({
  id,
  title,
  subtitle,
  type,
  data,
  color = 'blue'
}: StatsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Styling maps
  const colorMap = {
    zinc: {
      stroke: '#52525b',
      fill: 'rgba(113, 113, 122, 0.15)',
      barBg: 'bg-zinc-600',
      text: 'text-zinc-600'
    },
    blue: {
      stroke: '#2563eb',
      fill: 'rgba(37, 99, 235, 0.15)',
      barBg: 'bg-primary',
      text: 'text-primary'
    },
    indigo: {
      stroke: '#4f46e5',
      fill: 'rgba(79, 70, 229, 0.15)',
      barBg: 'bg-indigo-600',
      text: 'text-indigo-600'
    },
    emerald: {
      stroke: '#059669',
      fill: 'rgba(5, 150, 105, 0.15)',
      barBg: 'bg-emerald-600',
      text: 'text-emerald-600'
    }
  };

  const selectedColor = colorMap[color];
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 200;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  // Render SVG Area Chart
  const renderAreaChart = () => {
    const pointsCount = data.length;
    const stepX = (chartWidth - paddingX * 2) / (pointsCount - 1 || 1);
    
    // Create points array
    const points = data.map((d, i) => {
      const x = paddingX + i * stepX;
      // Invert Y axis for SVG (0 is at top)
      const ratio = d.value / maxValue;
      const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
      return { x, y, val: d.value, label: d.label };
    });

    const pathData = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      return `${acc} L ${p.x} ${p.y}`;
    }, '');

    const closedPathData = points.length > 0 
      ? `${pathData} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
      : '';

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
          const val = Math.round(ratio * maxValue);
          return (
            <g key={i} className="opacity-40">
              <line 
                x1={paddingX} 
                y1={y} 
                x2={chartWidth - paddingX} 
                y2={y} 
                stroke="#e4e4e7" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              <text 
                x={paddingX - 10} 
                y={y + 4} 
                textAnchor="end" 
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X Axis labels */}
        {points.map((p, i) => {
          // Only show alternate labels to prevent overlapping
          if (points.length > 8 && i % 2 !== 0 && i !== points.length - 1) return null;
          return (
            <text
              key={i}
              x={p.x}
              y={chartHeight - 4}
              textAnchor="middle"
              className="text-[9px] fill-zinc-400 font-medium"
            >
              {p.label}
            </text>
          );
        })}

        {/* Area fill */}
        {closedPathData && (
          <path 
            d={closedPathData} 
            fill={selectedColor.fill}
            className="transition-all duration-300"
          />
        )}

        {/* Stroke path */}
        {pathData && (
          <path 
            d={pathData} 
            fill="none" 
            stroke={selectedColor.stroke} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        )}

        {/* Interaction dots */}
        {points.map((p, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g key={i}>
              {/* Invisible touch target */}
              <circle
                cx={p.x}
                cy={p.y}
                r={20}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Visible dot on hover or permanent small dots */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 3}
                fill={isHovered ? selectedColor.stroke : '#ffffff'}
                stroke={selectedColor.stroke}
                strokeWidth={isHovered ? 3 : 1.5}
                className="pointer-events-none transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  // Render SVG Bar Chart
  const renderBarChart = () => {
    const barsCount = data.length;
    const spacing = 15;
    const contentWidth = chartWidth - paddingX * 2;
    const barWidth = Math.max(8, (contentWidth - spacing * (barsCount - 1)) / barsCount);

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
          const val = Math.round(ratio * maxValue);
          return (
            <g key={i} className="opacity-40">
              <line 
                x1={paddingX} 
                y1={y} 
                x2={chartWidth - paddingX} 
                y2={y} 
                stroke="#e4e4e7" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              <text 
                x={paddingX - 10} 
                y={y + 4} 
                textAnchor="end" 
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Render Bars */}
        {data.map((d, i) => {
          const x = paddingX + i * (barWidth + spacing);
          const ratio = d.value / maxValue;
          const barHeight = ratio * (chartHeight - paddingY * 2);
          const y = chartHeight - paddingY - barHeight;
          const isHovered = hoveredIndex === i;

          return (
            <g key={i}>
              {/* Bar background track */}
              <rect
                x={x}
                y={paddingY}
                width={barWidth}
                height={chartHeight - paddingY * 2}
                fill="#f4f4f5"
                rx={Math.min(4, barWidth / 2)}
                className="opacity-40"
              />
              {/* Actual bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                fill={isHovered ? selectedColor.stroke : '#71717a'}
                rx={Math.min(4, barWidth / 2)}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* X Axis text */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 4}
                textAnchor="middle"
                className={`text-[8px] font-medium transition-colors ${
                  isHovered ? 'fill-zinc-800 font-semibold' : 'fill-zinc-400'
                }`}
              >
                {d.label.length > 10 ? `${d.label.substring(0, 8)}...` : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div id={id} className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">{title}</h4>
          <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
          <span className={`w-2 h-2 rounded-full ${selectedColor.barBg}`} />
          <span>Valor registrado</span>
        </div>
      </div>

      <div className="relative pt-2">
        {type === 'area' ? renderAreaChart() : renderBarChart()}

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute top-0 right-0 bg-zinc-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl flex flex-col gap-0.5 border border-zinc-800"
            >
              <span className="font-semibold text-zinc-300">{data[hoveredIndex].label}</span>
              <span className="text-sm font-bold text-white">
                {data[hoveredIndex].value} <span className="text-[10px] text-zinc-400 font-normal">registros</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
