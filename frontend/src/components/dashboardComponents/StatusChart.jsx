import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { IP_STATUSES, STATUS_COLORS } from "../../constants/ipStatuses";
import { CHART_TOOLTIP_STYLE } from "../../constants/tooltipStyles";

// Extended color mapping for all statuses
const EXTENDED_STATUS_COLORS = {
  ...STATUS_COLORS,
  UNDER_EXAMINATION: '#F59E0B', // Yellow/Orange
  PENDING_REVIEW: '#8B5CF6', // Purple
  EXPIRED: '#6B7280', // Gray
};

const StatusChart = ({ data = {} }) => {
  // Order of statuses in chart
  const STATUS_ORDER = [
    "FILED",
    "UNDER_EXAMINATION",
    "GRANTED",
    "PUBLISHED",
    "PENDING_REVIEW",
  ];

  // Map status values to display names
  const statusDisplayNames = {
    FILED: "Filed",
    UNDER_EXAMINATION: "Under Examination",
    GRANTED: "Granted",
    PUBLISHED: "Published",
    PENDING_REVIEW: "Pending Review",
    EXPIRED: "Expired"
  };

  // Build status counts dynamically from backend data (case-insensitive matching)
  const statusData = STATUS_ORDER.map((status) => {
    const found = data.find((d) => d.status?.toUpperCase() === status.toUpperCase());
    return found ? { 
      name: statusDisplayNames[status] || status, 
      value: found.count,
      originalStatus: found.status 
    } : null;
  }).filter(Boolean);

  
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/30 p-6 w-full animate-fadeIn">
      {/* Header */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-white">IP Status Overview</h3>
        <p className="text-xs text-purple-200 mt-1">
          Current distribution of IP filings
        </p>
      </div>

      {/* Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {statusData.map((entry, i) => {
                // Map display name back to status constant for color lookup
                const statusKey = Object.keys(statusDisplayNames).find(
                  key => statusDisplayNames[key] === entry.name
                ) || entry.originalStatus || entry.name;
                const color = EXTENDED_STATUS_COLORS[statusKey] || EXTENDED_STATUS_COLORS.FILED || '#06B6D4';
                return <Cell key={i} fill={color} />;
              })}
            </Pie>

            <Tooltip {...CHART_TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-purple-100">
        {statusData.map((d, i) => {
          const statusKey = Object.keys(statusDisplayNames).find(
            key => statusDisplayNames[key] === d.name
          ) || d.originalStatus || d.name;
          const color = EXTENDED_STATUS_COLORS[statusKey] || EXTENDED_STATUS_COLORS.FILED || '#06B6D4';
          return (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusChart;
