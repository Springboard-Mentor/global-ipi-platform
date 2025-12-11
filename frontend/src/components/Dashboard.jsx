import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const ipLocations = [
  { label: "12.110.16.213", region: "North America", top: "65%", left: "23%" },
  { label: "42.801.68.21", region: "Europe", top: "50%", left: "47%" },
  { label: "12.491.66.55", region: "Asia", top: "60%", left: "62%" },
  { label: "16.148.88.29", region: "Australia", top: "78%", left: "75%" },
];

// Bar chart data
const ipIntelligenceData = [
  { name: "Mon", hp: 35, session: 20 },
  { name: "Tue", hp: 25, session: 30 },
  { name: "Wed", hp: 45, session: 28 },
  { name: "Thu", hp: 30, session: 40 },
  { name: "Fri", hp: 50, session: 22 },
];

// Line chart data
const activeSessionsData = [
  { name: "10AM", users: 20 },
  { name: "11AM", users: 35 },
  { name: "12PM", users: 28 },
  { name: "1PM", users: 42 },
  { name: "2PM", users: 33 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [threatLevel, setThreatLevel] = useState(60); // 0–100
  const [selectedRegion, setSelectedRegion] = useState(ipLocations[0].region);

  const threatLabel =
    threatLevel < 33 ? "Low" : threatLevel < 66 ? "Medium" : "High";

  const threatLabelColor =
    threatLevel < 33
      ? "text-green-400"
      : threatLevel < 66
      ? "text-yellow-300"
      : "text-red-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold tracking-wide">
          Global-IPI-Platform
        </h1>

        <div className="flex gap-8 text-sm">
          <button className="hover:text-purple-300">Home</button>
          <button className="hover:text-purple-300">IP Activity</button>
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
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            👤
          </div>
        </div>
      </nav>

      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      {/* TOP GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CARD - IP Intelligence */}
        <div className="col-span-2 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold mb-4">IP Intelligence</h3>
            {/*  Bar Chart */}
          <div className="h-52 bg-white/5 rounded-lg flex items-center justify-center">
           <ResponsiveContainer width="100%" height="100%">
  <BarChart data={ipIntelligenceData}>
    <CartesianGrid stroke="rgba(255,255,255,0.15)" vertical={false} />
    <XAxis
      dataKey="name"
      stroke="#ddd"
      tick={{ fill: "#ddd", fontSize: 12 }}
      axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
    />
    <YAxis
      stroke="#ddd"
      tick={{ fill: "#ddd", fontSize: 12 }}
      axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
    />
    <Tooltip
      contentStyle={{
        background: "#2e1b47",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff",
      }}
    />

    {/* Gradient Bars */}
    <defs>
      <linearGradient id="barPurple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b26bff" />
        <stop offset="100%" stopColor="#8a2be2" />
      </linearGradient>

      <linearGradient id="barPink" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff6ac1" />
        <stop offset="100%" stopColor="#e84393" />
      </linearGradient>
    </defs>

    <Bar dataKey="hp" fill="url(#barPurple)" radius={[6, 6, 0, 0]} />
    <Bar dataKey="session" fill="url(#barPink)" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

          </div>
        </div>

        {/* RIGHT CARD - Active Sessions */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold mb-4">Active Sessions</h3>

          {/* Line Chart */}
          <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height="100%">
  <LineChart data={activeSessionsData}>
    <CartesianGrid stroke="rgba(255,255,255,0.15)" vertical={false} />
    <XAxis
      dataKey="name"
      stroke="#ddd"
      tick={{ fill: "#ddd", fontSize: 12 }}
      axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
    />
    <YAxis
      stroke="#ddd"
      tick={{ fill: "#ddd", fontSize: 12 }}
      axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
    />
    <Tooltip
      contentStyle={{
        background: "#2e1b47",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "#fff",
      }}
    />
    
    {/* Add glow effect */}
    <defs>
      <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#d066ff" />
        <stop offset="100%" stopColor="#9b4dff" />
      </linearGradient>
    </defs>

    <Line
      type="monotone"
      dataKey="users"
      stroke="url(#lineGlow)"
      strokeWidth={3}
      dot={{ r: 5, fill: "#fff", stroke: "#b26bff", strokeWidth: 2 }}
      activeDot={{ r: 7 }}
    />
  </LineChart>
</ResponsiveContainer>

          </div>

          {/* Threat Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-semibold">Threat Level</h4>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/10 ${threatLabelColor}`}
              >
                {threatLabel}
              </span>
            </div>

            <div className="mt-2 relative w-full h-3">
              <div className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-300 to-red-500 rounded-full relative pointer-events-none">
                <div
                  className="absolute -top-1 w-4 h-4 bg-white rounded-full shadow-lg shadow-black/40 border border-purple-400 transition-all"
                  style={{ left: `calc(${threatLevel}% - 8px)` }}
                ></div>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={threatLevel}
                onChange={(e) => setThreatLevel(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-white/60 mt-2">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ALERTS TABLE */}
      <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4">Recent Alerts</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-purple-200">
              <th className="text-left pb-2">Time</th>
              <th className="text-left pb-2">Status</th>
              <th className="text-left pb-2">Alerts</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {[
              ["07.2187.16:21:50", "Warning", "3 hours ago"],
              ["07.2180.14:35:00", "Warning", "5 hours ago"],
              ["07.2168.11:59:04", "Warning", "3 hours ago"],
              ["07.2118.15:51:80", "Warning", "1 hour ago"],
            ].map(([time, status, alert], i) => (
              <tr key={i} className="border-b border-white/10">
                <td className="py-2">{time}</td>
                <td className="py-2">{status}</td>
                <td className="py-2">{alert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GLOBAL MAP */}
      <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Global Map</h3>
            <p className="text-xs text-white/60 mt-1">
              Attack surface across regions · Selected:{" "}
              <span className="font-semibold text-purple-200">
                {selectedRegion}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          {/* pseudo-map */}
          <div className="relative h-72 rounded-xl bg-gradient-to-tr from-indigo-950/80 via-purple-900/60 to-slate-900/80 overflow-hidden border border-white/10">
            {/* Simple continents blobs */}
            <div className="absolute w-[55%] h-[40%] bg-white/10 rounded-full blur-2xl top-[45%] left-[15%]" />
            <div className="absolute w-[50%] h-[35%] bg-white/10 rounded-full blur-2xl top-[30%] left-[40%]" />
            <div className="absolute w-[30%] h-[25%] bg-white/10 rounded-full blur-2xl top-[65%] left-[65%]" />

            {ipLocations.map((loc) => (
              <button
                key={loc.label}
                onClick={() => setSelectedRegion(loc.region)}
                style={{ top: loc.top, left: loc.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-lg shadow-pink-500/70 animate-pulse" />
                <span className="text-[9px] bg-black/50 px-1.5 py-0.5 rounded-full">
                  {loc.label}
                </span>
              </button>
            ))}
          </div>

          {/* side list */}
          <div className="space-y-3 text-xs">
            <p className="text-white/60 mb-2">Active IPs by Region</p>
            {ipLocations.map((loc) => (
              <button
                key={loc.label}
                onClick={() => setSelectedRegion(loc.region)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition ${
                  selectedRegion === loc.region
                    ? "bg-purple-600/40 border-purple-300"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div>
                  <p className="font-medium text-[11px]">{loc.region}</p>
                  <p className="text-[10px] text-white/70">{loc.label}</p>
                </div>
                <span className="text-[11px] text-white/60">View</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
