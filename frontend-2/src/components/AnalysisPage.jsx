// ------------------------------------------------------------
//           ADVANCED PORTFOLIO ANALYSIS (UPDATED VERSION)
// ------------------------------------------------------------

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";
import {
    Loader2,
    TrendingUp,
    BarChart2,
    PieChart as PieIcon,
    Activity,
    Globe,
    ArrowUpRight,
} from "lucide-react";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

const AnalysisPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ---------------- FETCH FROM BACKEND WITH FALLBACK ----------------
    useEffect(() => {
        const fetchDB = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/search/analysis");

                if (Array.isArray(res.data) && res.data.length > 0) {
                    console.log("Using Backend Data");
                    setData(res.data);
                } else {
                    console.log("Backend empty → Using Dummy Data");
                    loadDummyData();
                }
            } catch (err) {
                console.log("Backend Error → Using Dummy Data");
                loadDummyData();
            } finally {
                setLoading(false);
            }
        };

        fetchDB();
    }, []);

    const loadDummyData = () => {
        setData([
            { type: "Utility Patent", jurisdiction: "US", filingDate: "2022-01-10" },
            { type: "Utility Patent", jurisdiction: "US", filingDate: "2023-02-12" },
            { type: "Design Patent", jurisdiction: "EU", filingDate: "2022-07-15" },
            { type: "Trademark", jurisdiction: "JP", filingDate: "2024-03-10" },
            { type: "Copyright", jurisdiction: "IN", filingDate: "2023-09-20" },
            { type: "Utility Patent", jurisdiction: "CN", filingDate: "2024-01-02" },
        ]);
    };

    // ---------------- ADVANCED ANALYSIS LOGIC ----------------
    const stats = useMemo(() => {
        if (!data.length) return null;

        const typeCount = {};
        const regionCount = {};
        const yearCount = {};

        data.forEach(item => {
            const type = item.type || "Unknown";
            const region = item.jurisdiction || "Unknown";

            // Extract year safely
            let year = "Unknown";
            if (item.year) year = item.year;
            else if (item.filingDate) year = new Date(item.filingDate).getFullYear();
            else if (item.createdDate) year = new Date(item.createdDate).getFullYear();

            typeCount[type] = (typeCount[type] || 0) + 1;
            regionCount[region] = (regionCount[region] || 0) + 1;
            yearCount[year] = (yearCount[year] || 0) + 1;
        });

        // Convert to chart formats
        const pieData = Object.entries(typeCount).map(([k, v]) => ({ name: k, value: v }));
        const barData = Object.entries(regionCount).map(([k, v]) => ({ name: k, count: v }));
        const lineData = Object.entries(yearCount)
            .sort((a, b) => a[0] - b[0])
            .map(([year, count]) => ({ year, count }));

        // Compute highest values
        const topType = pieData.sort((a, b) => b.value - a.value)[0];
        const topRegion = barData.sort((a, b) => b.count - a.count)[0];

        // Growth calculation (last 2 years)
        let growthRate = 0;
        if (lineData.length > 1) {
            const last = lineData[lineData.length - 1].count;
            const prev = lineData[lineData.length - 2].count;
            growthRate = (((last - prev) / prev) * 100).toFixed(1);
        }

        return {
            pieData,
            barData,
            lineData,
            topType,
            topRegion,
            growthRate,
        };
    }, [data]);

    if (loading) return <LoaderUI />;

    return (
        <div className="p-10 bg-[#F8FAFC] space-y-10 min-h-screen">

            {/* HEADER */}
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-4">
                Portfolio Intelligence Dashboard
                <Activity className="text-indigo-600" size={32} />
            </h1>

            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title="Total Assets"
                    value={data.length}
                    icon={<TrendingUp size={28} />}
                    color="indigo"
                />

                <KPICard
                    title="Top Category"
                    value={stats.topType?.name}
                    icon={<PieIcon size={28} />}
                    color="purple"
                />

                <KPICard
                    title="Top Jurisdiction"
                    value={stats.topRegion?.name}
                    icon={<Globe size={28} />}
                    color="emerald"
                />

                <KPICard
                    title="Yearly Growth"
                    value={`${stats.growthRate}%`}
                    icon={<ArrowUpRight size={28} />}
                    color="yellow"
                />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* PIE CHART */}
                <ChartCard title="Portfolio Composition">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={stats.pieData}
                                dataKey="value"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                            >
                                {stats.pieData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip /><Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* BAR CHART */}
                <ChartCard title="Jurisdiction Distribution">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={stats.barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* LINE CHART */}
            <ChartCard title="Yearly Filing Trend">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

// ---------------- COMPONENTS ----------------

const LoaderUI = () => (
    <div className="flex h-screen items-center justify-center flex-col gap-3">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-lg text-gray-600">Loading insights...</p>
    </div>
);

const KPICard = ({ title, value, icon, color }) => {
    const colors = {
        indigo: "from-indigo-500 to-blue-500",
        emerald: "from-emerald-500 to-teal-500",
        purple: "from-purple-500 to-fuchsia-500",
        yellow: "from-yellow-400 to-amber-500",
    };

    return (
        <div className="p-6 bg-white rounded-3xl shadow-md border flex gap-5 hover:shadow-xl transition">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
            </div>
        </div>
    );
};

const ChartCard = ({ title, children }) => (
    <div className="bg-white shadow-lg rounded-3xl p-8 border">
        <h3 className="text-sm font-bold uppercase text-gray-500 mb-5">{title}</h3>
        <div className="h-64">{children}</div>
    </div>
);

export default AnalysisPage;
