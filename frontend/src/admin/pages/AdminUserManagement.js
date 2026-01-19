import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
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

    return matchesSearch && matchesRole && matchesStatus;
  });

  /* ---------------- HELPERS ---------------- */
  const badge = {
    Active: "bg-green-900 text-green-300",
    Inactive: "bg-red-900 text-red-300",
    Disabled: "bg-gray-600 text-gray-200", // New style for Disabled
    Admin: "bg-purple-900 text-purple-300",
    ADMIN: "bg-purple-900 text-purple-300",
    Premium: "bg-blue-900 text-blue-300",
    User: "bg-gray-700 text-gray-300",
    USER: "bg-gray-700 text-gray-300",
    Free: "bg-gray-700 text-gray-300",
    Pro: "bg-indigo-900 text-indigo-300",
    Enterprise: "bg-orange-900 text-orange-300"
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

          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 rounded-lg text-white"
          >
            Export Users
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Total Users", users.length],
            ["Active Users", users.filter(u => (u.status || "").toLowerCase() === "active").length],
            ["Premium/Pro Users", users.filter(u => ["Premium", "Pro", "Enterprise"].includes(u.subscription)).length],
            ["New This Month", users.filter(u => {
              if (!u.createdAt) return false;
              const d = new Date(u.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length],
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
                    <span className={`px-2 py-1 text-xs rounded-full ${badge[u.status] || badge.Active}`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    <span className={`px-2 py-1 text-xs rounded-full border border-gray-700 ${badge[u.subscription] || badge.Free}`}>
                      {u.subscription}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-400 hover:text-red-300"
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
                    <option value="Premium">Premium</option>
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

      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
