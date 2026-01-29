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
          let value = cookie.substring(name.length + 1);
          // Decode URL-encoded value if needed
          try {
            value = decodeURIComponent(value);
          } catch (e) {
            // If decoding fails, use as-is
          }
          return value;
        }
      }
      return null;
    };

    console.log("📖 AuthProvider - All cookies:", document.cookie);
    const roleValue = getCookieValue("role");
    console.log("📖 AuthProvider - Raw role cookie value:", roleValue, "Type:", typeof roleValue);
    
    if (roleValue) {
      const trimmedRole = roleValue.trim().toLowerCase();
      setRole(trimmedRole as Role);
      console.log("✅ AuthProvider - Role set to:", trimmedRole);
    } else {
      console.log("❌ AuthProvider - No role cookie found. Will retry in 500ms");
      // Retry after a short delay
      setTimeout(() => {
        const retryRoleValue = getCookieValue("role");
        console.log("🔄 AuthProvider - Retry: Role cookie value:", retryRoleValue);
        if (retryRoleValue) {
          const trimmedRole = retryRoleValue.trim().toLowerCase();
          setRole(trimmedRole as Role);
          console.log("✅ AuthProvider - Role set on retry to:", trimmedRole);
        }
      }, 500);
    }
    
    setIsLoading(false);
  }, []);

  const getPermission = (permission: keyof typeof ROLE_PERMISSIONS[Role.Admin]): boolean => {
    if (!role) {
      console.log("⚠️ getPermission - No role set");
      return false;
    }
    const permissions = ROLE_PERMISSIONS[role as Role];
    console.log(`✅ getPermission - Checking ${permission} for role ${role}:`, permissions?.[permission]);
    const hasPermission = permissions?.[permission] ?? false;
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
    console.log("❌ useAuth - AuthContext is undefined");
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
