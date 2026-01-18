import React, { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    // TEMP MOCK (replace with API)
    setUsers([
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "Admin",
        status: "Active",
        subscription: "Premium",
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@lawfirm.com",
        role: "Premium",
        status: "Active",
        subscription: "Premium",
        createdAt: "2024-01-14",
      },
      {
        id: 3,
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@startup.com",
        role: "User",
        status: "Inactive",
        subscription: "Free",
        createdAt: "2024-01-10",
      },
    ]);
    setLoading(false);
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  /* ---------------- HELPERS ---------------- */
  const badge = {
    Active: "bg-green-900 text-green-300",
    Inactive: "bg-red-900 text-red-300",
    Admin: "bg-purple-900 text-purple-300",
    Premium: "bg-blue-900 text-blue-300",
    User: "bg-gray-700 text-gray-300",
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button
            onClick={() => setShowAddUser(true)}
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
            <option value="Premium">Premium</option>
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
          </select>

          <button className="bg-green-600 hover:bg-green-700 rounded-lg text-white">
            Export Users
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Total Users", users.length],
            ["Active Users", users.filter(u => u.status === "Active").length],
            ["Premium Users", users.filter(u => u.subscription === "Premium").length],
            ["New This Month", 156],
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
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-sm text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${badge[u.role]}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${badge[u.status]}`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-300">{u.subscription}</td>

                  <td className="px-6 py-4 text-gray-300">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">
                Add New User
              </h3>

              <div className="space-y-3">
                <input className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white" placeholder="Full Name" />
                <input className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white" placeholder="Email" />
                <select className="w-full bg-[#0d1117] border border-[#30363d] px-3 py-2 rounded text-white">
                  <option>User</option>
                  <option>Premium</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white py-2"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white py-2">
                  Add User
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
