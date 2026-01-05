// frontend/src/utils/chartHelpers.jsx
import React from 'react';

/**
 * 🎨 VIBRANT THEME PALETTES
 * Designed for high-contrast visibility on premium dashboards.
 */
export const FIELD_COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#3B82F6', '#64748B'
];

export const STATUS_COLORS = {
  ACTIVE: '#10B981',
  PENDING: '#F59E0B',
  EXPIRED: '#EF4444',
  ABANDONED: '#64748B',
  GRANTED: '#6366F1',
  REJECTED: '#F43F5E',
  FILED: '#0EA5E9'
};

/**
 * ⚙️ GLOBAL RECHARTS CONFIGURATIONS
 * Fixed: Explicitly exported to resolve browser SyntaxErrors.
 */
export const CHART_MARGIN = { top: 20, right: 30, left: 10, bottom: 10 };

export const CARTESIAN_GRID_CONFIG = { 
  strokeDasharray: '3 3', 
  stroke: '#E2E8F0',
  vertical: false 
};

export const TOOLTIP_CONFIG = {
  contentStyle: { 
    backgroundColor: '#ffffff', 
    border: 'none', 
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    fontSize: '12px',
    fontWeight: '700',
    padding: '12px'
  },
  cursor: { fill: '#F1F5F9', radius: 8 },
  itemStyle: { padding: '2px 0' }
};

export const CHART_CONFIG = {
  margin: CHART_MARGIN,
  grid: CARTESIAN_GRID_CONFIG,
  tooltip: TOOLTIP_CONFIG
};

/**
 * 🔢 ADVANCED DATA FORMATTERS
 * Handles currency, percentages, and large IP asset counts.
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3
  }).format(val);
};

export const formatPercent = (val) => {
  if (!val) return '0%';
  return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
};

/**
 * 🌍 REGIONAL METADATA
 */
export const JURISDICTIONS = [
  { id: 'US', label: 'United States', color: '#3B82F6' },
  { id: 'EP', label: 'Europe', color: '#10B981' },
  { id: 'CN', label: 'China', color: '#EF4444' },
  { id: 'JP', label: 'Japan', color: '#F59E0B' },
  { id: 'IN', label: 'India', color: '#8B5CF6' }
];