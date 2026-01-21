import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminFinanceManagement = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal for Plan Management
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    name: "",
    price: 0,
    period: "monthly",
    features: [],
    popular: false,
    active: true
  });
  const [newFeature, setNewFeature] = useState("");

  const API_BASE = "http://localhost:8081/api/admin/subscriptions";

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [plansRes, historyRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/plans`),
        axios.get(`${API_BASE}/history`),
        axios.get(`${API_BASE}/stats`)
      ]);
      setPlans(plansRes.data);
      setHistory(historyRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSavePlan = async () => {
    try {
      await axios.post(`${API_BASE}/plans`, currentPlan);
      setShowPlanModal(false);
      fetchAllData();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan");
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.delete(`${API_BASE}/plans/${id}`);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const openAddModal = () => {
    setCurrentPlan({
      name: "",
      price: 0,
      period: "monthly",
      features: [],
      popular: false,
      active: true
    });
    setIsEditing(false);
    setShowPlanModal(true);
  };

  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setIsEditing(true);
    setShowPlanModal(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setCurrentPlan({
        ...currentPlan,
        features: [...currentPlan.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const removeFeature = (idx) => {
    setCurrentPlan({
      ...currentPlan,
      features: currentPlan.features.filter((_, i) => i !== idx)
    });
  };

  const actionBadge = {
    UPGRADED: "bg-green-900 text-green-300",
    NEW: "bg-blue-900 text-blue-300",
    DOWNGRADED: "bg-red-900 text-red-300",
  };

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading && !stats) return <div className="text-white p-10">Loading subscription management...</div>;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Subscription Management</h1>
          <button 
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            + Create Plan
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#30363d]">
          {["plans", "history", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize transition-all ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Revenue Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Monthly Revenue", value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: "💰" },
              { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: "👤" },
              { label: "Churn Rate", value: `${stats.churnRate}%`, icon: "📉" },
              { label: "ARPU", value: `$${stats.arpu}`, icon: "📊" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-default"
              >
                <div className="flex items-center gap-2 mb-1">
                    <span>{icon}</span>
                    <p className="text-gray-400 text-sm">{label}</p>
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-[#161b22] border ${plan.popular ? 'border-blue-500' : 'border-[#30363d]'} rounded-lg p-5 flex flex-col relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    ${plan.price}
                    <span className="text-sm text-gray-400">/{plan.period === 'monthly' ? 'mo' : 'yr'}</span>
                  </p>
                </div>

                <div className="space-y-2 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-sm">
                      <span className="text-green-500 text-xs">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t border-[#30363d]">
                  <button 
                    onClick={() => openEditModal(plan)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm py-1.5 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePlan(plan.id)}
                    className="flex-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded text-sm py-1.5 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            <table className="w-full">
              <thead className="bg-[#21262d] border-b border-[#30363d]">
                <tr>
                  {["User", "Old Plan", "New Plan", "Action", "Date", "Amount"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#30363d]">
                {history.map((r) => (
                  <tr key={r.id} className="hover:bg-[#21262d] transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                                {r.userName ? r.userName.charAt(0) : "U"}
                            </div>
                            <span className="text-white font-medium">{r.userName}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{r.oldPlan}</td>
                    <td className="px-6 py-4 font-semibold text-blue-400">{r.newPlan}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${actionBadge[r.action] || 'bg-gray-800'}`}>
                        {r.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                        {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white font-mono">
                      ${r.amount}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                    <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No recent activity found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700">
            {/* Revenue Area Chart */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Revenue Trends</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenueTrends}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Distribution Pie Chart */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Plan Distribution</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Plan Management Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              {isEditing ? "Edit Subscription Plan" : "Create New Plan"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Plan Name</label>
                  <input
                    className="w-full bg-[#0d1117] border border-[#30363d] px-4 py-2 rounded-lg text-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Enterprise"
                    value={currentPlan.name}
                    onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                  />
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Monthly Price ($)</label>
                    <input
                        type="number"
                        className="w-full bg-[#0d1117] border border-[#30363d] px-4 py-2 rounded-lg text-white focus:border-blue-500 outline-none"
                        value={currentPlan.price}
                        onChange={(e) => setCurrentPlan({ ...currentPlan, price: parseFloat(e.target.value) })}
                    />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-grow bg-[#0d1117] border border-[#30363d] px-4 py-2 rounded-lg text-white outline-none focus:border-blue-500"
                    placeholder="Add a feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <button 
                    onClick={addFeature}
                    className="bg-blue-600 px-4 py-2 rounded-lg text-white font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  {currentPlan.features.map((f, i) => (
                    <span key={i} className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {f}
                      <button onClick={() => removeFeature(i)} className="hover:text-white">×</button>
                    </span>
                  ))}
                  {currentPlan.features.length === 0 && <span className="text-gray-600 text-xs italic">No features added yet.</span>}
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-blue-600 focus:ring-blue-500"
                        checked={currentPlan.popular}
                        onChange={(e) => setCurrentPlan({ ...currentPlan, popular: e.target.checked })}
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-blue-600 focus:ring-blue-500"
                        checked={currentPlan.active}
                        onChange={(e) => setCurrentPlan({ ...currentPlan, active: e.target.checked })}
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Active Plan</span>
                  </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-white py-2.5 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white py-2.5 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                {isEditing ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFinanceManagement;
