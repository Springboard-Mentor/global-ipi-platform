import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { IP_STATUSES, STATUS_COLORS } from "../constants/ipStatuses";
import { logout } from "../utils/logout";
import { CHART_TOOLTIP_STYLE } from "../constants/tooltipStyles";
import { fetchStatusSummary, fetchAllIPAssets } from "../api/ipApi";

const LegalStatusDashboard = () => {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("yearly");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedField, setSelectedField] = useState("all");
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  // KPI + Pie data
  const [statusSummary, setStatusSummary] = useState([]);

  // RAW IP DATA
  const [ipAssets, setIpAssets] = useState([]);

  const FALLBACK_COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  // API INTEGRATION
  useEffect(() => {
    fetchStatusSummary().then((summary) => {
      const formatted = Object.entries(summary).map(([status, count]) => ({
        status,
        count,
      }));
      setStatusSummary(formatted);
    });
  }, []);

  // RAW IP ASSETS
  useEffect(() => {
    fetchAllIPAssets().then(setIpAssets);
  }, []);

  //  KPI HELPERS
  const getCount = (status) =>
    statusSummary.find((s) => s.status === status)?.count || 0;

  // DATA PROCESSING
  const processedData = useMemo(() => {
    if (!Array.isArray(ipAssets) || ipAssets.length === 0) {
      return {
        filingTrends: [],
        fieldTrends: [],
        lifecycleData: [],
        statusDistribution: statusSummary,
      };
    }

    const getTimeKey = (date, period) => {
      if (!date) return "Unknown";
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Unknown";

      switch (period) {
        case "monthly":
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        case "weekly":
          const week = Math.ceil(d.getDate() / 7);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-W${week}`;
        case "half-yearly":
          const half = d.getMonth() < 6 ? "H1" : "H2";
          return `${d.getFullYear()}-${half}`;
        default: // yearly
          return d.getFullYear().toString();
      }
    };

    // Filter Raw Data
    let filteredAssets = ipAssets;
    if (selectedStatus !== "all") {
      filteredAssets = filteredAssets.filter(
        (item) => item.legalStatus === selectedStatus
      );
    }
    if (selectedField !== "all") {
      filteredAssets = filteredAssets.filter(
        (item) => item.assetType === selectedField
      );
    }

    /* ===== Filing Trends (Area Chart) ===== */
    const filingTrendsMap = filteredAssets.reduce((acc, item) => {
      const period = getTimeKey(item.filingDate, timePeriod);
      acc[period] = acc[period] || {
        period,
        [IP_STATUSES.FILED]: 0,
        [IP_STATUSES.PUBLISHED]: 0,
        [IP_STATUSES.GRANTED]: 0,
        [IP_STATUSES.UNDER_EXAMINATION]: 0,
      };

      const status = item.legalStatus;
      if (status && acc[period].hasOwnProperty(status)) {
        acc[period][status]++;
      }
      return acc;
    }, {});

    const filingTrends = Object.values(filingTrendsMap).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    /* ===== Field-wise Trends (Line Chart) ===== */
    const fieldTrendsMap = filteredAssets.reduce((acc, item) => {
      const period = getTimeKey(item.filingDate, timePeriod);
      acc[period] = acc[period] || { period, PATENT: 0, TRADEMARK: 0 };
      if (item.assetType === "PATENT" || item.assetType === "TRADEMARK") {
        acc[period][item.assetType]++;
      }
      return acc;
    }, {});

    const fieldTrends = Object.values(fieldTrendsMap).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    /* ===== Lifecycle KPI ===== */
    const lifecycleData = filteredAssets
      .filter((i) => i.filingDate && i.updatedOn)
      .map((item) => {
        const filed = new Date(item.filingDate);
        const updated = new Date(item.updatedOn);
        const processingDays = Math.ceil(
          (updated - filed) / (1000 * 60 * 60 * 24)
        );
        return { ...item, processingDays };
      });

    /* ===== Status Distribution (Pie Chart) ===== */
    const statusDistMap = filteredAssets.reduce((acc, item) => {
      const status = item.legalStatus || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusDistMap).map(
      ([status, count]) => ({
        status,
        count,
      })
    );

    return {
      filingTrends,
      fieldTrends,
      lifecycleData,
      statusDistribution,
    };
  }, [ipAssets, statusSummary, timePeriod, selectedStatus, selectedField]);

  // Enhanced data processing with time period filtering
  // const processedData = useMemo(() => {
  //   if (!Array.isArray(data) || data.length === 0) return {};

  //   const getTimeKey = (date, period) => {
  //     const d = new Date(date);
  //     switch(period) {
  //       case 'monthly':
  //         return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  //       case 'weekly':
  //         const week = Math.ceil(d.getDate() / 7);
  //         return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-W${week}`;
  //       case 'half-yearly':
  //         const half = d.getMonth() < 6 ? 'H1' : 'H2';
  //         return `${d.getFullYear()}-${half}`;
  //       default: // yearly
  //         return d.getFullYear().toString();
  //     }
  //   };

  //   // Filter data based on selections
  //   let filteredData = data;
  //   if (selectedStatus !== 'all') {
  //     filteredData = filteredData.filter(item => item.status === selectedStatus);
  //   }
  //   if (selectedField !== 'all') {
  //     filteredData = filteredData.filter(item => item.type === selectedField);
  //   }

  //   // Filing trends by status
  //   const filingTrends = Object.values(
  //     filteredData.reduce((acc, item) => {
  //       const timeKey = getTimeKey(item.filedOn, timePeriod);
  //       acc[timeKey] = acc[timeKey] || {
  //         period: timeKey,
  //         [IP_STATUSES.GRANTED]: 0,
  //         [IP_STATUSES.FILED]: 0,
  //         [IP_STATUSES.UNDER_EXAMINATION]: 0,
  //         [IP_STATUSES.PENDING_REVIEW]: 0,
  //         [IP_STATUSES.REJECTED]: 0,
  //         [IP_STATUSES.ABANDONED]: 0
  //       };
  //       acc[timeKey][item.status] = (acc[timeKey][item.status] || 0) + 1;
  //       return acc;
  //     }, {})
  //   ).sort((a, b) => a.period.localeCompare(b.period));

  //   // Status distribution
  //   const statusDistribution = Object.values(
  //     filteredData.reduce((acc, item) => {
  //       acc[item.status] = acc[item.status] || { status: item.status, count: 0 };
  //       acc[item.status].count++;
  //       return acc;
  //     }, {})
  //   );

  //   // Field-wise trends
  //   const fieldTrends = Object.values(
  //     filteredData.reduce((acc, item) => {
  //       const timeKey = getTimeKey(item.filedOn, timePeriod);
  //       acc[timeKey] = acc[timeKey] || { period: timeKey };
  //       acc[timeKey][item.type] = (acc[timeKey][item.type] || 0) + 1;
  //       return acc;
  //     }, {})
  //   ).sort((a, b) => a.period.localeCompare(b.period));

  //   // Patent lifecycle analysis
  //   const lifecycleData = filteredData.map(item => {
  //     const filed = new Date(item.filedOn);
  //     const updated = new Date(item.updatedOn);
  //     const daysDiff = Math.ceil((updated - filed) / (1000 * 60 * 60 * 24));
  //     return { ...item, processingDays: daysDiff };
  //   });

  //   return { filingTrends, statusDistribution, fieldTrends, lifecycleData };
  // }, [data, timePeriod, selectedStatus, selectedField]);

  // if (!Array.isArray(data) || data.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
  //       <h1 className="text-3xl font-bold">Legal Status Dashboard</h1>
  //       <p className="text-purple-200 mt-2">No IP data available for analysis.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-wide">
          Global-IPI-Platform
        </h1>
        <div className="flex gap-8 text-sm">
          <button
            className="hover:text-purple-300"
            onClick={() => navigate("/dashboard")}
          >
            Home
          </button>
          <button
            className="hover:text-purple-300"
            onClick={() => navigate("/ipActivity")}
          >
            IP Activity
          </button>
          <button className="hover:text-purple-300 text-purple-300">
            Legal Status
          </button>
          <button
            className="hover:text-purple-300"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            🔔
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenProfileMenu(!openProfileMenu)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              👤
            </button>
            {openProfileMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg p-2 text-sm">
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-white/20 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard label="Granted" value={getCount(IP_STATUSES.GRANTED)} />
        <KpiCard
          label="Under Examination"
          value={getCount(IP_STATUSES.UNDER_EXAMINATION)}
        />
        <KpiCard label="Filed" value={getCount(IP_STATUSES.FILED)} />
      </div>

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Legal Status Dashboard</h2>
        <p className="text-purple-200 text-sm mt-1">
          Comprehensive analysis of patent filing trends and legal status
          evolution
        </p>
      </div>

      {/* CONTROL PANEL */}
      <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Analysis Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Time Period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="weekly" className="bg-gray-800">
                Weekly View
              </option>
              <option value="monthly" className="bg-gray-800">
                Monthly View
              </option>
              <option value="half-yearly" className="bg-gray-800">
                Half-Yearly View
              </option>
              <option value="yearly" className="bg-gray-800">
                Yearly View
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Legal Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800">
                All Statuses
              </option>
              <option value={IP_STATUSES.FILED} className="bg-gray-800">
                Filed
              </option>
              <option
                value={IP_STATUSES.UNDER_EXAMINATION}
                className="bg-gray-800"
              >
                Under Examination
              </option>
              <option value={IP_STATUSES.GRANTED} className="bg-gray-800">
                Granted
              </option>
              <option value={IP_STATUSES.REJECTED} className="bg-gray-800">
                Rejected
              </option>
              <option value={IP_STATUSES.ABANDONED} className="bg-gray-800">
                Abandoned
              </option>
              <option
                value={IP_STATUSES.PENDING_REVIEW}
                className="bg-gray-800"
              >
                Pending Review
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              IP Field
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="all" className="bg-gray-800">
                All Fields
              </option>
              <option value="PATENT" className="bg-gray-800">
                Patents
              </option>
              <option value="TRADEMARK" className="bg-gray-800">
                Trademarks
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500/30 to-emerald-600/30 p-6 rounded-2xl border border-green-400/30 shadow-xl">
          <div className="text-3xl font-bold text-white mb-2">
            {processedData.statusDistribution?.find(
              (s) => s.status === IP_STATUSES.GRANTED
            )?.count || 0}
          </div>
          <div className="text-sm text-green-100 font-medium">
            {processedData.statusDistribution?.find(
              (s) => s.status === IP_STATUSES.GRANTED
            )?.count > 0
              ? "Granted Patents"
              : "No granted patents in selected period"}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/30 to-orange-600/30 p-6 rounded-2xl border border-yellow-400/30 shadow-xl">
          <div className="text-3xl font-bold text-white mb-2">
            {processedData.statusDistribution?.find(
              (s) => s.status === IP_STATUSES.UNDER_EXAMINATION
            )?.count || 0}
          </div>
          <div className="text-sm text-yellow-100 font-medium">
            {processedData.statusDistribution?.find(
              (s) => s.status === IP_STATUSES.UNDER_EXAMINATION
            )?.count > 0
              ? "Under Examination"
              : "No applications under examination"}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/30 to-cyan-600/30 p-6 rounded-2xl border border-blue-400/30 shadow-xl">
          <div className="text-3xl font-bold text-white mb-2">
            {processedData.statusDistribution?.find(
              (s) => s.status === IP_STATUSES.FILED
            )?.count || 0}
          </div>
          <div className="text-sm text-blue-100 font-medium">
            {processedData.statusDistribution?.find(
              (s) => s.status === IP_STATUSES.FILED
            )?.count > 0
              ? "Filed Applications"
              : "No filed applications in period"}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/30 to-pink-600/30 p-6 rounded-2xl border border-purple-400/30 shadow-xl">
          <div className="text-3xl font-bold text-white mb-2">
            {processedData.lifecycleData?.length
              ? Math.round(
                processedData.lifecycleData.reduce(
                  (acc, item) => acc + item.processingDays,
                  0
                ) / processedData.lifecycleData.length
              )
              : 0}
          </div>
          <div className="text-sm text-purple-100 font-medium flex items-center gap-1">
            Avg. Processing Days
            <span
              className="text-xs bg-white/10 px-1 py-0.5 rounded cursor-help"
              title="Average time from filing to current status"
            >
              ⓘ
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Filing Trends */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            Filing Trends by Status
            <span
              className="text-xs bg-white/10 px-2 py-1 rounded cursor-help"
              title="Number of patent/trademark filings over time by legal status"
            >
              ⓘ
            </span>
          </h3>
          <div className="text-sm text-purple-100 mb-2">Number of Filings</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedData.filingTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.2)"
                />
                <XAxis
                  dataKey="period"
                  tick={{ fill: "#FFFFFF", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#FFFFFF", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 15, 15, 0.98)",
                    border: "1px solid rgba(139, 92, 246, 0.8)",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={IP_STATUSES.GRANTED}
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey={IP_STATUSES.UNDER_EXAMINATION}
                  stackId="1"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey={IP_STATUSES.PUBLISHED}
                  stackId="1"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey={IP_STATUSES.FILED}
                  stackId="1"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            Status Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="status"
                >
                  {processedData.statusDistribution?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[entry.status] ||
                        FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  {...CHART_TOOLTIP_STYLE}
                  formatter={(value, name) => {
                    const total = processedData.statusDistribution.reduce(
                      (sum, item) => sum + item.count,
                      0
                    );
                    const percentage = ((value / total) * 100).toFixed(1);
                    return [`${value} filings (${percentage}%)`, name];
                  }}
                  labelStyle={{
                    color: "#00d4ff",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Status Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            {processedData.statusDistribution?.map((entry, index) => {
              const total = processedData.statusDistribution.reduce(
                (sum, item) => sum + item.count,
                0
              );
              const percentage = ((entry.count / total) * 100).toFixed(1);
              return (
                <div key={entry.status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[entry.status] ||
                        FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                    }}
                  ></div>
                  <span className="text-white">
                    {entry.status}: {entry.count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Field-wise Analysis */}
      <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          IP Filings by Field
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData.fieldTrends}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis
                dataKey="period"
                tick={{ fill: "#FFFFFF", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#FFFFFF", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 15, 15, 0.98)",
                  border: "1px solid rgba(139, 92, 246, 0.8)",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                }}
              />
              <Line
                type="monotone"
                dataKey="PATENT"
                stroke="#8B5CF6"
                strokeWidth={4}
                dot={{ r: 6, fill: "#8B5CF6" }}
              />
              <Line
                type="monotone"
                dataKey="TRADEMARK"
                stroke="#06B6D4"
                strokeWidth={4}
                dot={{ r: 6, fill: "#06B6D4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Field Legend */}
        <div className="flex justify-center gap-8 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-white">Patent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-white">Trademark</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value }) => (
  <div className="bg-white/10 p-6 rounded-xl">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm">{label}</div>
  </div>
);

export default LegalStatusDashboard;
