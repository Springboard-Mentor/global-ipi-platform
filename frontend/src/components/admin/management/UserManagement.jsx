import React, { useState } from 'react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15', subscription: 'Premium' },
    { id: 2, name: 'Jane Smith', email: 'jane@lawfirm.com', role: 'Premium', status: 'Active', lastLogin: '2024-01-14', subscription: 'Premium' },
    { id: 3, name: 'Bob Johnson', email: 'bob@startup.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-10', subscription: 'Free' },
    { id: 4, name: 'Alice Brown', email: 'alice@research.org', role: 'User', status: 'Active', lastLogin: '2024-01-15', subscription: 'Basic' },
  ];

  const handleUserAction = (userId, action) => {
    console.log(`${action} user ${userId}`);
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-500' : 'bg-red-500';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-500';
      case 'Premium': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <button onClick={() => setShowAddUser(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Premium">Premium</option>
            <option value="User">User</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition">
            Export Users
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white">2,847</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active Users</p>
          <p className="text-2xl font-bold text-white">2,156</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Premium Users</p>
          <p className="text-2xl font-bold text-white">892</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">New This Month</p>
          <p className="text-2xl font-bold text-white">156</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-gray-400 py-3">User</th>
                <th className="text-left text-gray-400 py-3">Role</th>
                <th className="text-left text-gray-400 py-3">Status</th>
                <th className="text-left text-gray-400 py-3">Subscription</th>
                <th className="text-left text-gray-400 py-3">Last Login</th>
                <th className="text-right text-gray-400 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/10">
                  <td className="py-4">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full text-white ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                      <span className="text-white">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white">{user.subscription}</td>
                  <td className="py-4 text-gray-400">{user.lastLogin}</td>
                  <td className="py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleUserAction(user.id, 'edit')} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                      <button onClick={() => handleUserAction(user.id, 'disable')} className="text-yellow-400 hover:text-yellow-300 text-sm">Disable</button>
                      <button onClick={() => handleUserAction(user.id, 'promote')} className="text-green-400 hover:text-green-300 text-sm">Promote</button>
                      <button onClick={() => handleUserAction(user.id, 'delete')} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-white/20 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add New User</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
              <input type="email" placeholder="Email Address" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400" />
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option value="User">User</option>
                <option value="Premium">Premium</option>
                <option value="Admin">Admin</option>
              </select>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddUser(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition">Cancel</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition">Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;