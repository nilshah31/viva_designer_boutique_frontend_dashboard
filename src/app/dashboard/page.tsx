"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Customers from "../customers/customers";

// ✅ MODULE TYPES
type Module = "customers" | "orders" | "measurements" | null;

const Orders = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Orders</h2>
    <p className="text-gray-400">Order management module</p>
  </div>
);

const Measurements = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Measurements</h2>
    <p className="text-gray-400">Measurements module</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<Module>(null);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const renderRightPanel = () => {
    switch (activeModule) {
      case "customers":
        return <Customers />;
      case "orders":
        return <Orders />;
      case "measurements":
        return <Measurements />;
      default:
        return <Customers />;
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      
      {/* LEFT MENU */}
      <aside className="w-64 bg-[#111] p-6 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-8">Viva Dashboard</h2>

        <nav className="space-y-4 text-sm">
          <div
            onClick={() => setActiveModule("customers")}
            className={`cursor-pointer hover:text-gold ${
              activeModule === "customers" ? "text-gold" : ""
            }`}
          >
            Customers
          </div>

          <div
            onClick={() => setActiveModule("orders")}
            className={`cursor-pointer hover:text-gold ${
              activeModule === "orders" ? "text-gold" : ""
            }`}
          >
            Orders
          </div>

          <div
            onClick={() => setActiveModule("measurements")}
            className={`cursor-pointer hover:text-gold ${
              activeModule === "measurements" ? "text-gold" : ""
            }`}
          >
            Measurements
          </div>
        </nav>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-600 py-2 rounded-lg text-sm hover:bg-red-500 transition"
        >
          Logout
        </button>
      </aside>

      {/* RIGHT SIDE */}
      <main className="flex-1 p-10">
        {renderRightPanel()}
      </main>
    </div>
  );
}
