import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubscription, setFilterSubscription] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedUserForSub, setSelectedUserForSub] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
    subscription: "Free"
  });

  const API_URL = "http://localhost:8081/api/admin/users";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      // Map basic fields if needed, but the backend now returns everything we need
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open Modal for Create
  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      role: "User",
      status: "Active",
      subscription: "Free"
    });
    setIsEditing(false);
    setEditingId(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const openEditModal = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      // Map backend values if they differ, or rely on consistency
      role: user.role || "User",
      status: user.status || "Active",
      subscription: user.subscription || "Free"
    });
    setIsEditing(true);
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    try {
      // Backend expects: role (USER/ADMIN/etc), status, subscription
      // We'll normalize role to uppercase for backend consistency if preferred, 
      // or keep as is if backend handles strings loosely.
      // Based on User.java, role is just a String.

      const payload = { ...formData };

      if (isEditing) {
        await axios.put(`${API_URL}/${editingId}`, payload, getAuthHeaders());
      } else {
        await axios.post(API_URL, payload, getAuthHeaders());
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export`, {
        ...getAuthHeaders(),
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting users:", error);
    }
  };

  /* ---------------- FILTERING ---------------- */
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Simple filter logic
    let matchesRole = (filterRole === "all") || (u.role === filterRole);
    // If we want smarter mapping (e.g. backend ADMIN vs frontend Admin), do it here:
    if (filterRole === "Admin" && u.role === "ADMIN") matchesRole = true;
    if (filterRole === "User" && u.role === "USER") matchesRole = true;

    const filterStatusNorm = filterStatus.toLowerCase();
    const uStatusNorm = (u.status || "").toLowerCase();
    const matchesStatus = (filterStatus === "all") || (uStatusNorm === filterStatusNorm);

    const matchesSubscription = (filterSubscription === "all") || (u.subscription === filterSubscription);

    return matchesSearch && matchesRole && matchesStatus && matchesSubscription;
  });

  /* BADGE STYLES - Enhanced for better visual hierarchy */
  const badge = {
    // Status badges
    Active: "bg-green-900 text-green-300 border border-green-700",
    Inactive: "bg-orange-900 text-orange-300 border border-orange-700",
    Disabled: "bg-red-900 text-red-300 border border-red-700",
    // Role badges
    Admin: "bg-purple-900 text-purple-300 border border-purple-700",
    ADMIN: "bg-purple-900 text-purple-300 border border-purple-700",
    User: "bg-gray-700 text-gray-300 border border-gray-600",
    USER: "bg-gray-700 text-gray-300 border border-gray-600",
    // Subscription badges
    Free: "bg-gray-700 text-gray-300 border border-gray-600",
    Pro: "bg-blue-900 text-blue-300 border border-blue-700",
    Enterprise: "bg-orange-900 text-orange-300 border border-orange-700"
  };

  // Subscription tier colors for better visual distinction
  const subscriptionColors = {
    Free: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-900" },
    Pro: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900" },
    Enterprise: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-900" }
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            + Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded-lg text-white"
          />

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded-lg text-white"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Disabled">Disabled</option>
          </select>

          <select
            value={filterSubscription}
            onChange={(e) => setFilterSubscription(e.target.value)}
            className="bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded-lg text-white"
          >
            <option value="all">All Subscriptions</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 rounded-lg text-white"
          >
            Export Users
          </button>
        </div>

        {/* Stats - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Total Users", value: users.length, icon: "👥" },
            { label: "Active Users", value: users.filter(u => (u.status || "").toLowerCase() === "active").length, icon: "✅" },
            { label: "Inactive Users", value: users.filter(u => (u.status || "").toLowerCase() === "inactive").length, icon: "⏸️" },
            { label: "Free/Pro Users", value: users.filter(u => ["Free", "Pro", "Enterprise"].includes(u.subscription)).length, icon: "⭐" },
            { label: "Free Users", value: users.filter(u => u.subscription === "Free").length, icon: "📦" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#444c56] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <p className="text-gray-400 text-sm">{label}</p>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#21262d] border-b border-[#30363d]">
              <tr>
                {["User", "Role", "Status", "Subscription", "Joined", "Actions"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs text-gray-400 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#30363d]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#21262d]">
                  <td className="px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                        {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="font-medium">{u.name || "Unknown"}</p>
                        <p className="text-sm text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${badge[u.role] || badge.User}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        (u.status || "").toLowerCase() === "active" ? "bg-green-500" :
                        (u.status || "").toLowerCase() === "inactive" ? "bg-orange-500" :
                        "bg-red-500"
                      }`}></span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${badge[u.status] || badge.Active}`}>
                        {u.status || "Active"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${badge[u.subscription] || badge.Free}`}>
                        {u.subscription || "Free"}
                      </span>
                      {["Free", "Pro", "Enterprise"].includes(u.subscription) && (
                        <span className="text-xs text-yellow-400">★</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => { setSelectedUserForSub(u); setShowSubscriptionModal(true); }}
                      className="text-purple-400 hover:text-purple-300 text-xs font-medium"
                      title="View subscription details"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => openEditModal(u)}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">
                {isEditing ? "Edit User" : "Add New User"}
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <label className="text-gray-400 text-xs mb-1">Full Name</label>
                  <input
                    className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-400 text-xs mb-1">Email</label>
                  <input
                    className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isEditing} // Often we don't allow email edits, but we can if necessary. The backend allows it.
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-xs mb-1">Role</label>
                  <select
                    className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-xs mb-1">Status</label>
                  <select
                    className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {/* Subscription */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-xs mb-1">Subscription</label>
                  <select
                    className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white"
                    value={formData.subscription}
                    onChange={(e) => setFormData({ ...formData, subscription: e.target.value })}
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white py-2"
                >
                  {isEditing ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Details Modal */}
        {showSubscriptionModal && selectedUserForSub && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg max-w-2xl w-full p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-white">Subscription Details</h2>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase">User Information</h3>
                  <div className="bg-[#161b22] rounded-lg p-4 space-y-2">
                    <p className="text-white"><span className="text-gray-400">Name:</span> {selectedUserForSub.name || "N/A"}</p>
                    <p className="text-white"><span className="text-gray-400">Email:</span> {selectedUserForSub.email}</p>
                    <p className="text-white"><span className="text-gray-400">Role:</span> {selectedUserForSub.role}</p>
                    <p className="text-white"><span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${badge[selectedUserForSub.status] || badge.Active}`}>
                        {selectedUserForSub.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Subscription Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase">Subscription Information</h3>
                  <div className="bg-[#161b22] rounded-lg p-4 space-y-2">
                    <p className="text-white"><span className="text-gray-400">Plan:</span> 
                      <span className={`ml-2 px-3 py-1 text-xs rounded-full font-semibold ${badge[selectedUserForSub.subscription] || badge.Free}`}>
                        {selectedUserForSub.subscription || "Free"}
                      </span>
                    </p>
                    <p className="text-white"><span className="text-gray-400">Member Since:</span> {selectedUserForSub.createdAt ? new Date(selectedUserForSub.createdAt).toLocaleDateString() : "N/A"}</p>
                    
                    {/* Subscription Benefits */}
                    <div className="mt-4 pt-4 border-t border-[#30363d]">
                      <p className="text-gray-400 text-xs uppercase mb-2">Benefits</p>
                      <div className="space-y-1">
                        {selectedUserForSub.subscription === "Free" && (
                          <>
                            <p className="text-gray-300 text-sm">✓ Basic IP Search</p>
                            <p className="text-gray-300 text-sm">✓ Limited Queries (10/month)</p>
                            <p className="text-gray-300 text-sm">✓ Community Support</p>
                          </>
                        )}
                        {selectedUserForSub.subscription === "Pro" && (
                          <>
                            <p className="text-blue-300 text-sm">✓ Advanced IP Search</p>
                            <p className="text-blue-300 text-sm">✓ 100 Queries/month</p>
                            <p className="text-blue-300 text-sm">✓ Email Support</p>
                            <p className="text-blue-300 text-sm">✓ Patent Tracking</p>
                          </>
                        )}
                        {selectedUserForSub.subscription === "Enterprise" && (
                          <>
                            <p className="text-orange-300 text-sm">✓ Unlimited Everything</p>
                            <p className="text-orange-300 text-sm">✓ Dedicated Support</p>
                            <p className="text-orange-300 text-sm">✓ API Access</p>
                            <p className="text-orange-300 text-sm">✓ Custom Integration</p>
                            <p className="text-orange-300 text-sm">✓ SLA Guaranteed</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white py-2"
                >
                  Close
                </button>
                <button
                  onClick={() => { 
                    openEditModal(selectedUserForSub); 
                    setShowSubscriptionModal(false); 
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white py-2"
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
