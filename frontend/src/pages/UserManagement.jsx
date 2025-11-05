import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users");
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { data } = await API.patch(`/users/${userId}/role`, {
        role: newRole,
      });
      setUsers(users.map((u) => (u._id === userId ? data : u)));
      alert("User role updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-burgundy text-white";
      case "editor":
        return "bg-gold text-dark";
      case "viewer":
        return "bg-gray-300 text-dark";
      default:
        return "bg-gray-200 text-dark";
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-burgundy mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page. Admin access
            required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-burgundy mb-2">
              User Management
            </h1>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>

          <Link
            to="/register"
            className="inline-block bg-burgundy text-white px-4 py-2 rounded-md font-medium hover:bg-burgundy/90 transition"
          >
            + Add User
          </Link>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="card p-12 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="card p-6">
            {/* Role Legend */}
            <div className="mb-6 p-4 bg-cream/50 rounded-lg">
              <h3 className="text-sm font-semibold text-burgundy mb-2">
                Role Permissions:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-semibold">Admin:</span> Full access -
                  manage users, create/edit/view checklists
                </div>
                <div>
                  <span className="font-semibold">Editor:</span> Create, edit,
                  and view checklists
                </div>
                <div>
                  <span className="font-semibold">Viewer:</span> View-only
                  access to checklists
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-burgundy/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-burgundy">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-burgundy">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-burgundy">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-burgundy">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-burgundy">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-burgundy/10 hover:bg-cream/30"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{user.name}</div>
                        {user._id === currentUser?.id && (
                          <span className="text-xs text-burgundy">(You)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {user._id !== currentUser?.id && (
                            <>
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  updateUserRole(user._id, e.target.value)
                                }
                                className="text-sm border border-burgundy/30 rounded px-2 py-1 bg-white hover:border-burgundy transition"
                              >
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                              </select>
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="text-red-600 hover:text-red-800 transition p-1"
                                title="Delete user"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
