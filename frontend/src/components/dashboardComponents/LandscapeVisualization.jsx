import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { CHART_TOOLTIP_STYLE } from "../../constants/tooltipStyles";

const LandscapeVisualization = ({ data = [] }) => {
  const [activeChart, setActiveChart] = useState("trend");
  const [timePeriod, setTimePeriod] = useState("yearly");
  const [patentField, setPatentField] = useState("all");
  const [viewMode, setViewMode] = useState("standard");
  const [hoveredData, setHoveredData] = useState(null);

  const COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5A2B",
    "#FF6B9D",
  ];
  // Patent field keywords for intelligent categorization
  const PATENT_FIELD_KEYWORDS = {
    "AI/ML": ["artificial intelligence", "machine learning", "neural network", "deep learning", "ai", "ml", "algorithm", "model"],
    "Blockchain": ["blockchain", "cryptocurrency", "distributed ledger", "smart contract", "bitcoin", "ethereum"],
    "Cybersecurity": ["security", "cybersecurity", "encryption", "authentication", "firewall", "malware", "privacy", "secure"],
    "IoT": ["internet of things", "iot", "sensor", "smart device", "connected device", "embedded system"],
    "Quantum Computing": ["quantum", "qubit", "quantum computing", "quantum algorithm"],
    "Biotechnology": ["biotech", "biotechnology", "pharmaceutical", "drug", "medical", "genetic", "dna", "protein", "biological"],
    "Software": ["software", "application", "system", "program", "code", "framework", "api"],
    "Hardware": ["hardware", "device", "circuit", "processor", "chip", "semiconductor"],
    "Telecommunications": ["telecom", "communication", "network", "wireless", "5g", "lte", "mobile"],
    "Energy": ["energy", "power", "battery", "solar", "renewable", "fuel cell"],
    "Manufacturing": ["manufacturing", "production", "assembly", "fabrication", "industrial"],
  };

  const PATENT_FIELDS = Object.keys(PATENT_FIELD_KEYWORDS);

  // Priority colors for consistent semantics
  const PRIORITY_COLORS = {
    High: "#EF4444", // Red
    Medium: "#F59E0B", // Orange/Yellow
    Low: "#10B981", // Green
  };

  // Country to region mapping
  const COUNTRY_TO_REGION = {
    // North America
    "US": "North America",
    "CA": "North America",
    "MX": "North America",
    // Europe
    "GB": "Europe", "UK": "Europe", "DE": "Europe", "FR": "Europe",
    "IT": "Europe", "ES": "Europe", "NL": "Europe", "BE": "Europe",
    "CH": "Europe", "AT": "Europe", "SE": "Europe", "NO": "Europe",
    "DK": "Europe", "FI": "Europe", "PL": "Europe", "IE": "Europe",
    "PT": "Europe", "GR": "Europe", "CZ": "Europe", "HU": "Europe",
    // Asia Pacific
    "CN": "Asia Pacific", "JP": "Asia Pacific", "KR": "Asia Pacific",
    "IN": "Asia Pacific", "AU": "Asia Pacific", "NZ": "Asia Pacific",
    "SG": "Asia Pacific", "TW": "Asia Pacific", "HK": "Asia Pacific",
    "MY": "Asia Pacific", "TH": "Asia Pacific", "PH": "Asia Pacific",
    "ID": "Asia Pacific", "VN": "Asia Pacific",
    // Middle East & Africa
    "AE": "Middle East & Africa", "SA": "Middle East & Africa",
    "IL": "Middle East & Africa", "ZA": "Middle East & Africa",
    "EG": "Middle East & Africa", "TR": "Middle East & Africa",
    // Latin America
    "BR": "Latin America", "AR": "Latin America", "CL": "Latin America",
    "CO": "Latin America", "PE": "Latin America",
  };

  // Function to extract patent field from title/abstract
  const extractPatentField = (title, abstract) => {
    if (!title && !abstract) return "Other";

    const searchText = `${title || ""} ${abstract || ""}`.toLowerCase();

    // Check each field's keywords
    for (const [field, keywords] of Object.entries(PATENT_FIELD_KEYWORDS)) {
      if (keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
        return field;
      }
    }

    return "Other";
  };

  // Function to map country code to region
  const getRegionFromCountry = (countryCode) => {
    if (!countryCode) return "Unknown";
    const upperCode = countryCode.toUpperCase().trim();
    return COUNTRY_TO_REGION[upperCode] || "Other";
  };

  // Helper function for grouping data by time
  const getTimeKey = (date, period) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Unknown";

    switch (period) {
      case "weekly":
        // Simple week of year calculation
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
        const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
      case "monthly":
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      case "quarterly":
        const q = Math.ceil((d.getMonth() + 1) / 3);
        return `${d.getFullYear()}-Q${q}`;
      case "half-yearly":
        const half = d.getMonth() < 6 ? "H1" : "H2";
        return `${d.getFullYear()}-${half}`;
      default: // yearly
        return d.getFullYear().toString();
    }
  };

  //      DATA NORMALIZATION (FRONTEND)
  const normalizedData = useMemo(() => {
    return data.map((item) => {
      // Extract patent field from title/abstract if not already present
      const patentField = item.patentField || extractPatentField(item.title, item.abstractText);

      // Map country to region
      const region = item.region || getRegionFromCountry(item.country);

      // Parse filing date safely
      let filingDate = null;
      if (item.filingDate) {
        try {
          // Handle both Date objects and date strings (YYYY-MM-DD format from backend)
          if (typeof item.filingDate === 'string') {
            filingDate = new Date(item.filingDate + 'T00:00:00');
          } else if (item.filingDate instanceof Date) {
            filingDate = item.filingDate;
          }
          // Check if date is valid
          if (filingDate && isNaN(filingDate.getTime())) {
            filingDate = null;
          }
        } catch (e) {
          filingDate = null;
        }
      }

      return {
        ...item,
        filingDate,
        assetType: item.assetType || "PATENT",
        legalStatus: item.legalStatus,
        patentField,
        region,
        country: item.country || "Unknown"
      };
    });
  }, [data]);

  // Enhanced data processing with patent-specific analysis
  const processedData = useMemo(() => {
    /* ---- TIME KEY ---- */

    const filtered =
      patentField === "all"
        ? normalizedData
        : normalizedData.filter((i) => i.patentField === patentField);

    /* ---- Filing Trend ---- */
    const filingTrend = Object.values(
      filtered.reduce((acc, item) => {
        if (!item.filingDate) return acc;

        const period = getTimeKey(item.filingDate, timePeriod);
        acc[period] = acc[period] || {
          period,
          filings: 0,
          patents: 0,
          trademarks: 0,
        };

        acc[period].filings++;
        if (item.assetType === "PATENT") acc[period].patents++;
        if (item.assetType === "TRADEMARK") acc[period].trademarks++;

        return acc;
      }, {})
    ).sort((a, b) => a.period.localeCompare(b.period));

    /* ===============================
       TYPE DISTRIBUTION
    =============================== */
    const typeDistribution = Object.values(
      normalizedData.reduce((acc, item) => {
        const type = item.assetType || "Unknown";
        acc[type] = acc[type] || { type, count: 0 };
        acc[type].count++;
        return acc;
      }, {})
    );

    /* ===============================
       FIELD DISTRIBUTION (ALL DATA)
    =============================== */
    const fieldDistribution = Object.values(
      normalizedData.reduce((acc, item) => {
        const field = item.patentField || "Other";
        acc[field] = acc[field] || { field, count: 0 };
        acc[field].count++;
        return acc;
      }, {})
    ).sort((a, b) => b.count - a.count); // Sort by count descending

    /* ===============================
       PRIORITY ANALYSIS (ALL DATA)
    =============================== */
    const priorityAnalysis = Object.values(
      normalizedData.reduce((acc, item) => {
        const priority = item.priority || "Unknown";
        acc[priority] = acc[priority] || {
          priority,
          count: 0,
        };
        acc[priority].count++;
        return acc;
      }, {})
    );

    /* ===============================
       REGIONAL DISTRIBUTION (ALL DATA)
    =============================== */
    const regionalDistribution = Object.values(
      normalizedData.reduce((acc, item) => {
        const region = item.region || "Other";
        acc[region] = acc[region] || { region, count: 0 };
        acc[region].count++;
        return acc;
      }, {})
    ).sort((a, b) => b.count - a.count); // Sort by count descending

    /* ===============================
       COUNTRY DISTRIBUTION (DETAILED)
    =============================== */
    const countryDistribution = Object.values(
      normalizedData.reduce((acc, item) => {
        const country = item.country || "Unknown";
        acc[country] = acc[country] || { country, count: 0 };
        acc[country].count++;
        return acc;
      }, {})
    ).sort((a, b) => b.count - a.count).slice(0, 10); // Top 10 countries

    /* ===============================
       MONTHLY ACTIVITY (SAFE)
    =============================== */
    const periodicActivity = Object.values(
      normalizedData.reduce((acc, item) => {
        if (!item.filingDate) return acc;

        const d = new Date(item.filingDate);
        if (isNaN(d)) return acc;

        const period = getTimeKey(item.filingDate, timePeriod);

        acc[period] = acc[period] || { period, count: 0 };
        acc[period].count++;
        return acc;
      }, {})
    ).sort((a, b) => a.period.localeCompare(b.period));

    /* ===============================
       RADAR DATA (SAFE + CLEAN)
    =============================== */
    const total = filtered.length;

    const radarData = [
      {
        metric: "Filing Volume",
        value: total ? 100 : 0,
      },
      {
        metric: "Granted Rate",
        value: total
          ? Math.round(
            (filtered.filter(
              (i) => i.legalStatus === "GRANTED"
            ).length /
              total) *
            100
          )
          : 0,
      },
      {
        metric: "Patent Ratio",
        value: total
          ? Math.round(
            (filtered.filter(
              (i) => i.assetType === "PATENT"
            ).length /
              total) *
            100
          )
          : 0,
      },
      {
        metric: "High Priority",
        value: normalizedData.length
          ? Math.round(
            (normalizedData.filter(
              (i) => i.priority === "High"
            ).length /
              normalizedData.length) *
            100
          )
          : 0,
      },
      {
        metric: "Recent Activity",
        value: total
          ? Math.round(
            (filtered.filter(
              (i) =>
                new Date(i.filingDate).getFullYear() ===
                new Date().getFullYear()
            ).length /
              total) *
            100
          )
          : 0,
      },
    ];

    return {
      filingTrend,
      typeDistribution,
      fieldDistribution,
      priorityAnalysis,
      regionalDistribution,
      countryDistribution,
      periodicActivity,
      radarData,
    };
  }, [normalizedData, timePeriod, patentField]);


  return (
    <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-xl shadow-black/40 space-y-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
      {/* ENHANCED HEADER WITH CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            IP Landscape Visualization
          </h3>
          <p className="text-sm text-purple-100 mt-2 font-medium">
            Visual analysis of IP activity across technologies, regions, and
            time to identify innovation trends and white spaces
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Time Period Selector */}
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          >
            <option value="weekly" className="bg-gray-800">
              Weekly
            </option>
            <option value="monthly" className="bg-gray-800">
              Monthly
            </option>
            <option value="quarterly" className="bg-gray-800">
              Quarterly
            </option>
            <option value="half-yearly" className="bg-gray-800">
              Half-Yearly
            </option>
            <option value="yearly" className="bg-gray-800">
              Yearly
            </option>
          </select>

          {/* Patent Field Filter */}
          <select
            value={patentField}
            onChange={(e) => setPatentField(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          >
            <option value="all" className="bg-gray-800">
              All Fields
            </option>
            {PATENT_FIELDS.map((field) => (
              <option key={field} value={field} className="bg-gray-800">
                {field}
              </option>
            ))}
          </select>

          {/* View Mode */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          >
            <option value="standard" className="bg-gray-800">
              Standard View
            </option>
            <option value="comparative" className="bg-gray-800">
              Comparative View
            </option>
            <option value="detailed" className="bg-gray-800">
              Detailed Analysis
            </option>
          </select>
        </div>
      </div>

      {/* CHART NAVIGATION */}
      <div className="flex flex-wrap gap-3">
        {[
          "trend",
          "distribution",
          "fields",
          "activity",
          "regional",
          "radar",
        ].map((chart) => (
          <button
            key={chart}
            onClick={() => setActiveChart(chart)}
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeChart === chart
              ? "bg-purple-500 text-white shadow-lg transform scale-105 border border-purple-400"
              : "bg-white/15 text-white hover:bg-white/25 hover:scale-102 border border-white/30"
              }`}
          >
            {chart.charAt(0).toUpperCase() + chart.slice(1)}
          </button>
        ))}
      </div>

      {/* DYNAMIC CHART DISPLAY */}
      <div className="min-h-[400px] transition-all duration-500">
        {data.length === 0 && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/60 mb-2 text-lg">No IP data available</p>
              <p className="text-white/40 text-sm">Search for patents to populate the landscape visualization</p>
            </div>
          </div>
        )}
        {activeChart === "trend" && (
          <div className="animate-fadeIn">
            <h4 className="text-lg text-white mb-6 flex items-center gap-2 font-semibold">
              Patent Filing Trends ({timePeriod})
              {hoveredData && (
                <span className="text-sm bg-purple-500/30 px-3 py-1 rounded-lg border border-purple-400/50">
                  {hoveredData.period}: {hoveredData.filings} filings
                </span>
              )}
            </h4>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === "comparative" ? (
                  <AreaChart data={processedData.filingTrend}>
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
                        backgroundColor: "rgba(30, 30, 30, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.5)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="patents"
                      stackId="1"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="trademarks"
                      stackId="1"
                      stroke="#06B6D4"
                      fill="#06B6D4"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={processedData.filingTrend}>
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
                        backgroundColor: "rgba(30, 30, 30, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.5)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="filings"
                      stroke="#8B5CF6"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#8B5CF6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#A78BFA",
                        stroke: "#fff",
                        strokeWidth: 3,
                      }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === "distribution" && (
          <div className="animate-fadeIn">
            <h4 className="text-lg text-white mb-6 flex items-center gap-2 font-semibold">
              IP Type Distribution
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processedData.typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="type"
                    >
                      {processedData.typeDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip {...CHART_TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.typeDistribution}>
                    <XAxis
                      dataKey="type"
                      tick={{ fill: "#FFFFFF", fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#FFFFFF", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 30, 30, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.5)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeChart === "fields" && (
          <div className="animate-fadeIn">
            <h4 className="text-lg text-white mb-6 flex items-center gap-2 font-semibold">
              Patent Field Analysis
              <span className="text-sm text-purple-200 font-normal">
                ({processedData.fieldDistribution.length} fields identified)
              </span>
            </h4>
            {processedData.fieldDistribution.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/60 mb-2">No field data available</p>
                  <p className="text-white/40 text-sm">Fields are extracted from patent titles and abstracts</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData.fieldDistribution.slice(0, 10)}
                      layout="horizontal"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.2)"
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#FFFFFF", fontSize: 12 }}
                        label={{ value: "Number of Patents", position: "insideBottom", offset: -5, fill: "#FFFFFF" }}
                      />
                      <YAxis
                        dataKey="field"
                        type="category"
                        tick={{ fill: "#FFFFFF", fontSize: 11 }}
                        width={140}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(30, 30, 30, 0.95)",
                          border: "1px solid rgba(16, 185, 129, 0.5)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value} patents`, "Count"]}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]}>
                        {processedData.fieldDistribution.slice(0, 10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedData.fieldDistribution.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="field"
                        label={({ field, percent }) => `${field}: ${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {processedData.fieldDistribution.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(30, 30, 30, 0.95)",
                          border: "1px solid rgba(16, 185, 129, 0.5)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value} patents`, "Count"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {activeChart === "regional" && (
          <div className="animate-fadeIn">
            <h4 className="text-lg text-white mb-6 flex items-center gap-2 font-semibold">
              Regional & Country Distribution
              <span className="text-sm text-purple-200 font-normal">
                ({processedData.regionalDistribution.length} regions)
              </span>
            </h4>
            {processedData.regionalDistribution.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/60 mb-2">No regional data available</p>
                  <p className="text-white/40 text-sm">Country information is mapped to regions</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-80">
                    <h5 className="text-white/90 mb-4 text-sm font-semibold">By Region</h5>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={processedData.regionalDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="region"
                          label={({ region, percent }) =>
                            percent > 0.05 ? `${region}: ${(percent * 100).toFixed(1)}%` : ''
                          }
                          labelLine={false}
                        >
                          {processedData.regionalDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.95)",
                            border: "1px solid rgba(139, 92, 246, 0.5)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          formatter={(value) => [`${value} patents`, "Count"]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          formatter={(value) => <span style={{ color: "#FFFFFF" }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-80">
                    <h5 className="text-white/90 mb-4 text-sm font-semibold">Top Countries</h5>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={processedData.countryDistribution}
                        layout="horizontal"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.2)"
                        />
                        <XAxis
                          type="number"
                          tick={{ fill: "#FFFFFF", fontSize: 12 }}
                        />
                        <YAxis
                          dataKey="country"
                          type="category"
                          tick={{ fill: "#FFFFFF", fontSize: 11 }}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(30, 30, 30, 0.95)",
                            border: "1px solid rgba(139, 92, 246, 0.5)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          formatter={(value) => [`${value} patents`, "Count"]}
                        />
                        <Bar dataKey="count" fill="#8B5CF6" radius={[0, 8, 8, 0]}>
                          {processedData.countryDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="h-80">
                  <h5 className="text-white/90 mb-4 text-sm font-semibold">Regional Breakdown</h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData.regionalDistribution}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.2)"
                      />
                      <XAxis
                        dataKey="region"
                        tick={{ fill: "#FFFFFF", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#FFFFFF", fontSize: 12 }}
                        label={{ value: "Number of Patents", angle: -90, position: "insideLeft", fill: "#FFFFFF" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(30, 30, 30, 0.95)",
                          border: "1px solid rgba(139, 92, 246, 0.5)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        formatter={(value) => [`${value} patents`, "Count"]}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {processedData.regionalDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {activeChart === "activity" && (
          <div className="animate-fadeIn">
            <h4 className="text-lg text-white mb-6 flex items-center gap-2 font-semibold capitalize">
              {timePeriod} Activity Analysis
            </h4>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData.periodicActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" tick={{ fill: "#FFFFFF", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#FFFFFF", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.95)",
                      border: "1px solid rgba(139, 92, 246, 0.5)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8B5CF6"
                    fill="url(#colorActivity)"
                    fillOpacity={0.6}
                  />
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === "radar" && (
          <div className="animate-fadeIn">
            <h4 className="text-lg text-white mb-6 flex items-center gap-2 font-semibold">
              Patent Performance Radar
            </h4>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={processedData.radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "#FFFFFF", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#FFFFFF", fontSize: 10 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.95)",
                      border: "1px solid rgba(139, 92, 246, 0.5)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ENHANCED STATS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
        <div className="bg-gradient-to-br from-purple-500/30 to-pink-600/30 p-6 rounded-2xl border border-purple-400/40 shadow-lg">
          <div className="text-3xl font-bold text-white mb-2">
            {data.length}
          </div>
          <div className="text-sm text-purple-100 font-medium">
            Total IP Assets
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/30 to-emerald-600/30 p-6 rounded-2xl border border-green-400/40 shadow-lg">
          <div className="text-3xl font-bold text-white mb-2">
            {
              data.filter(
                (item) =>
                  item.assetType === "PATENT" &&
                  (item.legalStatus === "FILED")
              ).length
            }
          </div>
          <div className="text-sm text-green-100 font-medium">
            Active Applications
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/30 to-cyan-600/30 p-6 rounded-2xl border border-blue-400/40 shadow-lg">
          <div className="text-3xl font-bold text-white mb-2">
            {data.filter((item) => item.legalStatus === "GRANTED").length}
          </div>
          <div className="text-sm text-blue-100 font-medium">
            Granted Patents
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/30 to-orange-600/30 p-6 rounded-2xl border border-yellow-400/40 shadow-lg">
          <div className="text-3xl font-bold text-white mb-2">
            {data.filter((item) =>
              item.assetType?.toUpperCase() === "TRADEMARK" ||
              item.assetType?.toUpperCase() === "TRADE MARK"
            ).length}
          </div>
          <div className="text-sm text-yellow-100 font-medium">Trademarks</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500/30 to-purple-600/30 p-6 rounded-2xl border border-indigo-400/40 shadow-lg">
          <div className="text-3xl font-bold text-white mb-2">
            {new Date().getFullYear()}
          </div>
          <div className="text-sm text-indigo-100 font-medium">
            Current Year
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandscapeVisualization;
