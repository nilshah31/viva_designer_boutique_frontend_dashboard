"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaPlus } from "react-icons/fa";
import UserModal, { User } from "@/app/components/ui/modals/user";
import { useAuth } from "@/app/providers/AuthProvider";
import { Role, ROLE_PERMISSIONS } from "@/app/types/roles";
import FullScreenLoader from "@/app/components/ui/FullScreenLoader";

export default function UsersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, canManageUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // Check permission after auth loads and load users if authorized
  useEffect(() => {
    if (!authLoading) {
      // Check if user has canManageUsers permission
      if (!canManageUsers()) {
        router.replace("/dashboard");
      } else {
        // Only load users if user has permission
        loadUsers();
      }
    }
  }, [authLoading, canManageUsers, router]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (user: User) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, data.data]);
        setShowModal(false);
      } else {
        // Handle backend error
        const errorMessage = data.error || "Failed to create user";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative px-2 md:px-0">
      <FullScreenLoader show={isLoading} text="Processing..." />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Users</h2>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Search username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-black border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-gold"
          />

          <button
            onClick={() => setShowModal(true)}
            disabled={isLoading}
            className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      {/* USER LIST */}
      <div className="space-y-2">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No users found</p>
        ) : (
          <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-400">Username</th>
                    <th className="text-left px-4 py-3 text-gray-400">Role</th>
                    <th className="text-right px-4 py-3 text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-800 hover:bg-gray-900 transition"
                    >
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-gray-800">
                          {ROLE_PERMISSIONS[user.role]?.name || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canManageUsers() && (
                          <button
                            onClick={() => user.id && handleDeleteUser(user.id)}
                            className="text-red-500 hover:text-red-300 transition"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-900 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-white">{user.username}</p>
                    </div>
                    {canManageUsers() && (
                      <button
                        onClick={() => user.id && handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-gray-800 inline-block">
                    {ROLE_PERMISSIONS[user.role]?.name || user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* USER MODAL */}
      <UserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddUser}
        isLoading={isLoading}
      />
    </div>
  );
}
