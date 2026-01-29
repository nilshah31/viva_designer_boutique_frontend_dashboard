"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Customers from "../customers/customers";
import Users from "../users/page";
import {
  FaUsers,
  FaShoppingBag,
  FaSignOutAlt,
  FaBars,
  FaCog,
} from "react-icons/fa";
import FullScreenLoader from "@/app/components/ui/FullScreenLoader";
import { useAuth } from "@/app/providers/AuthProvider";

type Module = "customers" | "orders" | "users" | null;

const Orders = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Orders</h2>
    <p className="text-gray-400">Please visit customer module to place an order</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { canManageUsers, isLoading: authLoading } = useAuth();

  const [activeModule, setActiveModule] = useState<Module>("customers");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ GLOBAL BLOCKING LOADER

  // Log for debugging
  useEffect(() => {
    console.log("Dashboard - authLoading:", authLoading, "canManageUsers:", canManageUsers());
  }, [authLoading, canManageUsers]);

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const changeModule = (module: Module) => {
    setLoading(true); // ✅ show overlay
    setTimeout(() => {
      setActiveModule(module);
      setSidebarOpen(false);
      setLoading(false);
    }, 400); // small UX delay for smoothness
  };

  const renderRightPanel = () => {
    switch (activeModule) {
      case "customers":
        return <Customers />;
      case "orders":
        return <Orders />;
      case "users":
        return <Users />;
      default:
        return <Customers />;
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white relative">

      {/* ✅ FULL SCREEN BLOCKING LOADER */}
      <FullScreenLoader show={loading} text="Please wait..." />

      {/* ✅ MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111] border-b border-gray-800 flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-bold text-gold">Viva Admin</h2>
        <FaBars
          onClick={() => setSidebarOpen(true)}
          className="text-xl cursor-pointer"
        />
      </div>

      {/* ✅ OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-full w-64
          bg-gradient-to-b from-[#0b0b0b] to-[#111]
          p-6 border-r border-gray-800 flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gold">Viva Admin</h2>
            <p className="text-xs text-gray-500">Dashboard Control</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 text-xl"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2 flex-1 text-sm">

          <div
            onClick={() => changeModule("customers")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
              ${
                activeModule === "customers"
                  ? "bg-gold text-black shadow-md"
                  : "text-gray-300 hover:bg-[#1c1c1c] hover:text-gold"
              }
            `}
          >
            <FaUsers />
            Customers
          </div>

          <div
            onClick={() => changeModule("orders")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
              ${
                activeModule === "orders"
                  ? "bg-gold text-black shadow-md"
                  : "text-gray-300 hover:bg-[#1c1c1c] hover:text-gold"
              }
            `}
          >
            <FaShoppingBag />
            Orders
          </div>

          {canManageUsers() && (
            <div
              onClick={() => changeModule("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                ${
                  activeModule === "users"
                    ? "bg-gold text-black shadow-md"
                    : "text-gray-300 hover:bg-[#1c1c1c] hover:text-gold"
                }
              `}
            >
              <FaCog />
              Users
            </div>
          )}

        </nav>

        <button
          onClick={logout}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-red-600 py-3 rounded-xl text-sm font-semibold hover:bg-red-500 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* ✅ RIGHT CONTENT */}
      <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10">
        {renderRightPanel()}
      </main>
    </div>
  );
}
