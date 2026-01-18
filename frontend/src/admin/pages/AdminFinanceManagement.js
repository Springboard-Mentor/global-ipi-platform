import React, { useState } from "react";
import AdminLayout from "../layout/AdminLayout";

const AdminFinanceManagement = () => {
  const [activeTab, setActiveTab] = useState("plans");

  const subscriptionPlans = [
    {
      id: 1,
      name: "Free",
      price: 0,
      users: 1245,
      features: { search: true, analytics: false, alerts: false, api: false, support: false },
    },
    {
      id: 2,
      name: "Basic",
      price: 29,
      users: 456,
      features: { search: true, analytics: true, alerts: false, api: false, support: true },
    },
    {
      id: 3,
      name: "Premium",
      price: 99,
      users: 892,
      features: { search: true, analytics: true, alerts: true, api: true, support: true },
    },
    {
      id: 4,
      name: "Enterprise",
      price: 299,
      users: 254,
      features: { search: true, analytics: true, alerts: true, api: true, support: true },
    },
  ];

  const featureModules = [
    { key: "search", name: "Patent Search" },
    { key: "analytics", name: "Analytics Dashboard" },
    { key: "alerts", name: "Real-time Alerts" },
    { key: "api", name: "API Access" },
    { key: "support", name: "Priority Support" },
  ];

  const recentSubscriptions = [
    { id: 1, user: "John Doe", plan: "Premium", action: "Upgraded", date: "2024-01-15", amount: 99 },
    { id: 2, user: "Jane Smith", plan: "Basic", action: "New", date: "2024-01-14", amount: 29 },
    { id: 3, user: "Bob Johnson", plan: "Free", action: "Downgraded", date: "2024-01-13", amount: 0 },
  ];

  const actionBadge = {
    Upgraded: "bg-green-900 text-green-300",
    New: "bg-blue-900 text-blue-300",
    Downgraded: "bg-red-900 text-red-300",
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Subscription Management</h1>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
            + Create Plan
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#30363d]">
          {["plans", "features", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Revenue Stats (Finance-style cards) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Monthly Revenue", "$127,450"],
            ["Active Subscriptions", "2,847"],
            ["Churn Rate", "2.3%"],
            ["ARPU", "$44.78"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#161b22] border border-[#30363d] rounded-lg p-4"
            >
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* PLANS TAB */}
        {activeTab === "plans" && (
          <>
            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-[#161b22] border border-[#30363d] rounded-lg p-5"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <p className="text-2xl font-bold text-blue-400">
                      ${plan.price}
                      <span className="text-sm text-gray-400">/mo</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      {plan.users.toLocaleString()} users
                    </p>
                  </div>

                  <div className="space-y-2">
                    {featureModules.map((f) => (
                      <div key={f.key} className="flex justify-between text-sm">
                        <span className="text-gray-300">{f.name}</span>
                        <span
                          className={
                            plan.features[f.key]
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {plan.features[f.key] ? "Yes" : "No"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm py-1">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm py-1">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Subscriptions (Finance-style table) */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#30363d]">
                <h2 className="text-lg font-semibold text-white">
                  Recent Subscription Activity
                </h2>
              </div>

              <table className="w-full">
                <thead className="bg-[#21262d] border-b border-[#30363d]">
                  <tr>
                    {["User", "Plan", "Action", "Date", "Amount"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#30363d]">
                  {recentSubscriptions.map((r) => (
                    <tr key={r.id} className="hover:bg-[#21262d]">
                      <td className="px-6 py-4 text-white">{r.user}</td>
                      <td className="px-6 py-4 text-white">{r.plan}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${actionBadge[r.action]}`}
                        >
                          {r.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{r.date}</td>
                      <td className="px-6 py-4 text-white">
                        ${r.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4">
            {featureModules.map((f) => (
              <div
                key={f.key}
                className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{f.name}</p>
                  <p className="text-gray-400 text-sm">
                    Module configuration & usage
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm">
                    Configure
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-white text-sm">
                    Usage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {["Revenue Trends", "Plan Distribution"].map((title) => (
              <div
                key={title}
                className="bg-[#161b22] border border-[#30363d] rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {title}
                </h3>
                <div className="h-64 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center text-gray-400">
                  Chart Placeholder
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminFinanceManagement;
