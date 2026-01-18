import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/StatCard";
import UserGrowthChart from "../charts/UserGrowthChart";
import FilingStatusChart from "../charts/FilingStatusChart";
import PlatformActivityList from "../components/PlatformActivityList";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin Dashboard | Global IPI Platform";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:8081/api/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        console.error("Failed to fetch dashboard stats", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format "time ago"
  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center text-white h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Transform backend data to UI format
  // Fallback defaults in case stats is null (e.g. error)
  const userStats = stats?.userStats || { total: 0, newThisMonth: 0 };
  const filingStats = stats?.filingStats || { total: 0, newThisMonth: 0 };
  const revenueStats = stats?.revenueStats || { total: 0, monthly: 0 };
  const apiHealth = stats?.apiHealth || { value: "Unknown", status: "offline" };

  const statsCards = [
    {
      id: 1,
      title: "Total Users",
      value: userStats.total,
      subtext: `+ ${userStats.newThisMonth} new this month`,
      icon: "users",
      color: "blue",
      trend: "up"
    },
    {
      id: 2,
      title: "Total Filings",
      value: filingStats.total,
      subtext: `+ ${filingStats.newThisMonth} this month`,
      icon: "file-text",
      color: "purple",
      trend: "up"
    },
    {
      id: 3,
      title: "Revenue",
      value: `$${(revenueStats.total || 0).toLocaleString()}`,
      subtext: `Est. $${(revenueStats.monthly || 0).toLocaleString()} this month`,
      icon: "credit-card",
      color: "green",
      trend: "neutral"
    },
    {
      id: 4,
      title: "API Health",
      value: apiHealth.value,
      subtext: "All systems operational",
      icon: "activity",
      color: "emerald",
      status: apiHealth.status
    }
  ];

  const activityData = (stats?.platformActivity || []).map(a => ({
    ...a,
    time: formatTimeAgo(a.time)
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
            <UserGrowthChart data={stats?.userGrowthData || []} />
          </div>

          {/* Filing Status - Takes up 1 column */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
            <FilingStatusChart data={stats?.filingStatusData || []} />
          </div>
        </div>

        {/* Activity and Other Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Platform Activity */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
            <PlatformActivityList data={activityData} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
