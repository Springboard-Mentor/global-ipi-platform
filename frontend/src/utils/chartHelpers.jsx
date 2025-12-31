import React from 'react';

/**
 * @file chartHelpers.jsx
 * @description FIXED: Includes all missing exports for LegalDashboardPage
 */

// ============================================================================
// 1. 🎨 THEME & COLORS
// ============================================================================

export const CHART_COLORS = {
  primary: '#4F46E5',   // Indigo
  secondary: '#10B981', // Emerald
  tertiary: '#F59E0B',  // Amber
  danger: '#EF4444',    // Red
  info: '#3B82F6',      // Blue
  gray: '#6B7280',      // Gray
  dark: '#1F2937'
};

export const STATUS_COLORS = {
  ACTIVE: '#10B981',
  PENDING: '#F59E0B',
  EXPIRED: '#EF4444',
  ABANDONED: '#6B7280',
  GRANTED: '#10B981',
  REJECTED: '#EF4444',
  FILED: '#3B82F6'
};

export const FIELD_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#3B82F6', '#6366F1'
];

// ============================================================================
// 2. ⚙️ CONFIGURATION CONSTANTS (Yeh Missing The)
// ============================================================================

// ✅ Missing Export 1: CHART_MARGIN
export const CHART_MARGIN = { top: 10, right: 30, left: 0, bottom: 0 };

// ✅ Missing Export 2: CARTESIAN_GRID_CONFIG
export const CARTESIAN_GRID_CONFIG = { 
  strokeDasharray: '3 3', 
  stroke: '#E5E7EB',
  vertical: false 
};

// ✅ Missing Export 3: TOOLTIP_CONFIG
export const TOOLTIP_CONFIG = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '12px',
    color: '#374151'
  },
  cursor: { fill: '#F3F4F6' }
};

// ✅ Missing Export 4: LEGEND_CONFIG
export const LEGEND_CONFIG = {
  iconType: 'circle',
  wrapperStyle: { paddingTop: '10px' }
};

// Unified Config Object (Optional use)
export const CHART_CONFIG = {
  margin: CHART_MARGIN,
  cartesianGrid: CARTESIAN_GRID_CONFIG,
  tooltip: TOOLTIP_CONFIG
};

// ============================================================================
// 3. 🔢 FORMATTERS & HELPERS
// ============================================================================

// ✅ Missing Export 5: formatNumber
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  // 1.2K, 1.5M format
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatPercent = (value) => {
  if (value === undefined || value === null) return '0%';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// ✅ Missing Export 6: getGrowthIndicator
export const getGrowthIndicator = (growth) => {
  if (growth > 0) return { color: 'text-emerald-600', symbol: '↑', bgColor: 'bg-emerald-100' };
  if (growth < 0) return { color: 'text-red-600', symbol: '↓', bgColor: 'bg-red-100' };
  return { color: 'text-gray-500', symbol: '—', bgColor: 'bg-gray-100' };
};

export const customTooltipFormatter = (value, name) => {
  return [formatNumber(value), name];
};

// ============================================================================
// 4. 🏷️ DROPDOWN OPTIONS
// ============================================================================

export const DATE_RANGES = [
  { value: 'year', label: 'Last Year' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'month', label: 'Last Month' },
  { value: 'all', label: 'All Time' }
];

// ✅ Missing Export 7: IP_TYPES
export const IP_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'patent', label: 'Patents' },
  { value: 'trademark', label: 'Trademarks' }
];

export const JURISDICTIONS = [
  { value: 'all', label: 'Global (All)', flag: '🌍' },
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'EP', label: 'European Union', flag: '🇪🇺' },
  { value: 'CN', label: 'China', flag: '🇨🇳' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵' },
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' }
];

// Custom Components (Optional)
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
        <p className="text-xs font-bold text-slate-700 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {formatNumber(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};