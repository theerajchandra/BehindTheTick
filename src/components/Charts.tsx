'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatCurrency, formatNumber } from '@/utils';

interface ChartProps {
  data: any[];
  height?: number;
  className?: string;
}

interface PerformanceChartProps extends ChartProps {
  showArea?: boolean;
  color?: string;
}

interface SectorAllocationProps extends ChartProps {
  colors?: string[];
}

interface TradeVolumeProps extends ChartProps {
  showBuySell?: boolean;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white font-semibold" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Performance chart for portfolio/stock performance
export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  height = 300,
  showArea = false,
  color = '#3B82F6',
  className = ''
}) => {
  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${formatNumber(value)}`}
          />
          <Tooltip 
            content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />}
          />
          <DataComponent
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={showArea ? `${color}20` : undefined}
            strokeWidth={2}
            dot={false}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

// Sector allocation pie chart
export const SectorAllocationChart: React.FC<SectorAllocationProps> = ({
  data,
  height = 300,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
  className = ''
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={<CustomTooltip formatter={(value: number) => `${value}%`} />}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Trade volume bar chart
export const TradeVolumeChart: React.FC<TradeVolumeProps> = ({
  data,
  height = 300,
  showBuySell = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${formatNumber(value)}`}
          />
          <Tooltip 
            content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />}
          />
          {showBuySell ? (
            <>
              <Bar dataKey="buys" fill="#10B981" name="Buys" />
              <Bar dataKey="sells" fill="#EF4444" name="Sells" />
            </>
          ) : (
            <Bar dataKey="volume" fill="#3B82F6" name="Volume" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Monthly returns chart
export const MonthlyReturnsChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = ''
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            content={<CustomTooltip formatter={(value: number) => `${value}%`} />}
          />
          <Bar 
            dataKey="return" 
            fill={(entry: any) => entry.return >= 0 ? '#10B981' : '#EF4444'}
            name="Monthly Return"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Holdings comparison chart
export const HoldingsComparisonChart: React.FC<ChartProps> = ({
  data,
  height = 400,
  className = ''
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis 
            type="category" 
            dataKey="stock" 
            stroke="#9CA3AF"
            fontSize={12}
            width={80}
          />
          <Tooltip 
            content={<CustomTooltip formatter={(value: number) => formatCurrency(value)} />}
          />
          <Bar dataKey="value" fill="#3B82F6" name="Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Trading frequency chart
export const TradingFrequencyChart: React.FC<ChartProps> = ({
  data,
  height = 300,
  className = ''
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip 
            content={<CustomTooltip />}
          />
          <Line
            type="monotone"
            dataKey="trades"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            name="Number of Trades"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
