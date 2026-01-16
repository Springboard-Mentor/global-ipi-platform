import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { IP_STATUSES, STATUS_COLORS } from "../../constants/ipStatuses";
import { CHART_TOOLTIP_STYLE } from "../../constants/tooltipStyles";

const StatusChart = ({ data = {} }) => {
  // Order of statuses in chart
  const STATUS_ORDER = [
    IP_STATUSES.FILED,
    // IP_STATUSES.UNDER_EXAMINATION,
    // IP_STATUSES.PENDING_REVIEW,
    IP_STATUSES.GRANTED,
    IP_STATUSES.PUBLISHED,
    // IP_STATUSES.REJECTED,
    // IP_STATUSES.ABANDONED,
  ];

  // convert array of assets into status counts
  // data = [{ legalStatus: "Filed" }, { legalStatus: "Granted" }, ...]

  // Build status counts dynamically from backend data
  const statusData = STATUS_ORDER.map((status) => {
    const found = data.find((d) => d.status === status);
    return found ? { name: status, value: found.count } : null;
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
              {statusData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>

            <Tooltip {...CHART_TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-purple-100">
        {statusData.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[d.name] }}
            />
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
