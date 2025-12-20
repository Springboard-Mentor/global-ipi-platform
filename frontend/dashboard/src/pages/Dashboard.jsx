import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Filters from "../components/Filters";
import OverviewGrid from "../components/OverviewGrid";
import IPAssetPanel from "../components/IPAssetPanel";

const Dashboard = ({ userProfile }) => {
  const [dashboardData, setDashboardData] = useState({
    portfolioValue: "$0",
    portfolioGrowth: "0%",
    activeSubscriptions: 0,
    recentFilings: 0,
    openAlerts: 0,
    loading: true,
  });

  /* ---------------- MOCK DATA ---------------- */
  const portfolioGrowthData = [
    { month: "Jan", value: 1000000 },
    { month: "Feb", value: 1050000 },
    { month: "Mar", value: 1100000 },
    { month: "Apr", value: 1080000 },
    { month: "May", value: 1150000 },
    { month: "Jun", value: 1200000 },
  ];

  const filingsData = [
    { month: "Jan", filings: 12 },
    { month: "Feb", filings: 15 },
    { month: "Mar", filings: 18 },
    { month: "Apr", filings: 22 },
    { month: "May", filings: 20 },
    { month: "Jun", filings: 25 },
  ];

  const assetData = [
    { name: "Patents", value: 45, color: "#6366f1" },
    { name: "Trademarks", value: 30, color: "#22c55e" },
    { name: "Copyrights", value: 15, color: "#facc15" },
    { name: "Trade Secrets", value: 10, color: "#f97316" },
  ];

  /* ---------------- FIRESTORE ---------------- */
  useEffect(() => {
    if (!userProfile?.uid) {
      setDashboardData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const ref = doc(db, "dashboardData", userProfile.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setDashboardData({
            portfolioValue: data.portfolioValue || "$0",
            portfolioGrowth: data.portfolioGrowth || "0%",
            activeSubscriptions: data.activeSubscriptions || 0,
            recentFilings: data.recentFilings || 0,
            openAlerts: data.openAlerts || 0,
            loading: false,
          });
        } else {
          setDashboardData({
            portfolioValue: "$1.2M",
            portfolioGrowth: "Up 7.5% this quarter",
            activeSubscriptions: 12,
            recentFilings: 45,
            openAlerts: 3,
            loading: false,
          });
        }
      } catch {
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [userProfile?.uid]);

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  /* ======================= UI ======================= */
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-4 p-4 overflow-hidden">
      {/* LEFT SECTION */}
      <div className="xl:col-span-3 space-y-4">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-6 shadow overflow-hidden">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-3xl font-bold">
            {getTimeGreeting()}, {userProfile?.firstName || "User"}.
          </h1>
          <p className="text-gray-600 mt-1">
            {userProfile?.email} • {userProfile?.company || "IP Platform"}
          </p>

          {userProfile?.emailVerified && (
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-green-600 font-medium">
                Verified Account
              </span>
            </div>
          )}
        </div>

        {/* Filters + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow overflow-hidden">
            <h2 className="font-bold mb-2">Quick Filters</h2>
            <Filters />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow overflow-hidden">
            <h2 className="font-bold mb-2">Overview</h2>
            <OverviewGrid dashboardData={dashboardData} />
          </div>
        </div>


      </div>

      {/* RIGHT SECTION */}
      <div className="xl:col-span-1 space-y-4">
        {/* Portfolio Card */}
        <div className="bg-white rounded-2xl p-4 shadow overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-600">Portfolio Value</h3>
            <div className="p-2 bg-blue-50 rounded-xl">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
          </div>

          <p className="text-3xl font-bold mt-2">
            {dashboardData.portfolioValue}
          </p>
          <p className="text-sm text-green-600 font-medium">
            {dashboardData.portfolioGrowth}
          </p>
        </div>

        {/* Asset Distribution */}
        <div className="bg-white rounded-2xl p-4 shadow overflow-hidden">
          <h3 className="font-bold mb-3">Asset Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetData} dataKey="value" outerRadius={75}>
                  {assetData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FULL WIDTH CHARTS SECTION */}
      <div className="xl:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow overflow-hidden">
          <h3 className="font-bold mb-3">Portfolio Growth</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="value" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow overflow-hidden">
          <h3 className="font-bold mb-3">Monthly Filings</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="filings" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <IPAssetPanel />
      </div>
    </div>
  );
};

export default Dashboard;
