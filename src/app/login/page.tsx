"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginResponse } from "../types/Auth";
import { NextResponse } from "next/server";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Invalid login");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#111] p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Viva Dashboard
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          Sign in to continue
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black text-white border border-gray-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black text-white border border-gray-700"
          />

          <button
            onClick={handleLogin}
            className="w-full mt-4 bg-gold text-black font-semibold py-3 rounded-xl"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
