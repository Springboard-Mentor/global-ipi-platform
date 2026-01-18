import React, { useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/StatCard";
import UserGrowthChart from "../charts/UserGrowthChart";
import FilingStatusChart from "../charts/FilingStatusChart";
import PlatformActivityList from "../components/PlatformActivityList";
import {
  statsData,
  userGrowthData,
  filingStatusData,
  platformActivityData
} from "../mockData/dashboardData";

const AdminDashboard = () => {

  // Placeholder for real data fetching if needed
  useEffect(() => {
    document.title = "Admin Dashboard | Global IPI Platform";
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
            <UserGrowthChart data={userGrowthData} />
          </div>

          {/* Filing Status - Takes up 1 column */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
            <FilingStatusChart data={filingStatusData} />
          </div>
        </div>

        {/* Activity and Other Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Platform Activity */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
            <PlatformActivityList data={platformActivityData} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;


