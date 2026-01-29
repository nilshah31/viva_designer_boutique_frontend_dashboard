"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Role, ROLE_PERMISSIONS } from "@/app/types/roles";

interface AuthContextType {
  role: Role | null;
  isLoading: boolean;
  canDeleteCustomer: () => boolean;
  canManageUsers: () => boolean;
  canViewMeasurements: () => boolean;
  canEditMeasurements: () => boolean;
  canAddCustomer: () => boolean;
  canEditCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Helper to read cookie value
    const getCookieValue = (name: string): string | null => {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    };

    console.log("📖 AuthProvider - All cookies:", document.cookie);
    const roleValue = getCookieValue("role");
    console.log("📖 AuthProvider - Role cookie value:", roleValue);
    
    if (roleValue) {
      setRole(roleValue as Role);
      console.log("✅ AuthProvider - Role set to:", roleValue);
    } else {
      console.log("❌ AuthProvider - No role cookie found. Will retry in 500ms");
      // Retry after a short delay
      setTimeout(() => {
        const retryRoleValue = getCookieValue("role");
        console.log("🔄 AuthProvider - Retry: Role cookie value:", retryRoleValue);
        if (retryRoleValue) {
          setRole(retryRoleValue as Role);
          console.log("✅ AuthProvider - Role set on retry to:", retryRoleValue);
        }
      }, 500);
    }
    
    setIsLoading(false);
  }, []);

  const getPermission = (permission: keyof typeof ROLE_PERMISSIONS[Role.Admin]): boolean => {
    if (!role) return false;
    const hasPermission = ROLE_PERMISSIONS[role]?.[permission] ?? false;
    return Boolean(hasPermission);
  };

  const value = useMemo(
    () => ({
      role,
      isLoading,
      canDeleteCustomer: () => getPermission("canDeleteCustomer"),
      canManageUsers: () => getPermission("canManageUsers"),
      canViewMeasurements: () => getPermission("canViewMeasurements"),
      canEditMeasurements: () => getPermission("canEditMeasurements"),
      canAddCustomer: () => getPermission("canAddCustomer"),
      canEditCustomer: () => getPermission("canEditCustomer"),
    }),
    [role, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
