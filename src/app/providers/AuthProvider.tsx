"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Role, ROLE_PERMISSIONS } from "@/app/types/roles";

export interface User {
  id: string;
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  canDeleteCustomer: () => boolean;
  canManageUsers: () => boolean;
  canViewMeasurements: () => boolean;
  canEditMeasurements: () => boolean;
  canAddCustomer: () => boolean;
  canEditCustomer: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRoleCheck, setLastRoleCheck] = useState<string | null>(null);

  // Helper to read role cookie (instant, <1ms)
  const getRoleFromCookie = useCallback((): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith("role=")) {
        let value = cookie.substring("role=".length);
        try {
          value = decodeURIComponent(value);
        } catch (e) {
          // If decoding fails, use as-is
        }
        return value;
      }
    }
    return null;
  }, []);

  // Fetch user from API on mount and when needed
  const fetchUser = useCallback(async () => {
    try {
      // Step 1: Try to read role from cookie (instant, <1ms)
      const roleCookie = getRoleFromCookie();
      if (roleCookie) {
        console.log("⚡ AuthProvider - Role from cookie (instant):", roleCookie);
        // Try to get full user from localStorage using role
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Only use localStorage if role matches AND username matches
            if (parsedUser.role === roleCookie) {
              console.log("✅ AuthProvider - User from localStorage + role cookie:", parsedUser);
              setUser(parsedUser);
              setIsLoading(false); // Done immediately, no flicker
              return;
            } else {
              // Role mismatch: clear old user from localStorage (user switched roles)
              console.log("⚠️ AuthProvider - Role mismatch, clearing old localStorage user");
              localStorage.removeItem("auth_user");
            }
          } catch (e) {
            // Continue to API fetch
          }
        }
      }

      // Step 2: Fetch full user from API endpoint
      console.log("🔄 AuthProvider - Fetching user from API...");
      const res = await fetch("/api/auth/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (data.success && data.user) {
        console.log("✅ AuthProvider - User fetched from API:", data.user);
        setUser(data.user);
        setIsLoading(false); // Set immediately after successful fetch
        // Store in localStorage as backup (fire and forget)
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      } else {
        console.log("❌ AuthProvider - No user data from API");
        // User logged out or no token
        setUser(null);
        localStorage.removeItem("auth_user");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ AuthProvider - Failed to fetch user:", error);
      // Fallback to localStorage only if we have a role cookie
      const roleCookie = getRoleFromCookie();
      if (roleCookie) {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Only use if role still matches
            if (parsedUser.role === roleCookie) {
              console.log("📦 AuthProvider - Fallback to localStorage user:", parsedUser);
              setUser(parsedUser);
            } else {
              setUser(null);
              localStorage.removeItem("auth_user");
            }
          } catch (e) {
            setUser(null);
            localStorage.removeItem("auth_user");
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("auth_user");
      }
      setIsLoading(false);
    }
  }, [getRoleFromCookie]);

  // Fetch user on mount
  useEffect(() => {
    const initAuth = async () => {
      const currentRole = getRoleFromCookie();
      setLastRoleCheck(currentRole);
      
      // If role exists, fetch user
      if (currentRole) {
        await fetchUser();
      } else {
        // No role cookie = not logged in
        setUser(null);
        localStorage.removeItem("auth_user");
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Detect role changes (logout/login without page refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentRole = getRoleFromCookie();
      
      // Role changed or user logged out/in
      if (currentRole !== lastRoleCheck) {
        console.log("⚠️ AuthProvider - Role changed detected:", { from: lastRoleCheck, to: currentRole });
        setLastRoleCheck(currentRole);
        
        if (currentRole) {
          // User logged in with different role
          fetchUser();
        } else {
          // User logged out
          setUser(null);
          localStorage.removeItem("auth_user");
          setIsLoading(false);
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [lastRoleCheck, getRoleFromCookie, fetchUser]);

  // Get permission for a specific action
  const getPermission = useCallback(
    (permission: keyof typeof ROLE_PERMISSIONS[Role.Admin]): boolean => {
      if (!user || !user.role) {
        return false;
      }
      const permissions = ROLE_PERMISSIONS[user.role];
      return Boolean(permissions?.[permission] ?? false);
    },
    [user]
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("auth_user");
      console.log("✅ AuthProvider - User logged out");
    } catch (error) {
      console.error("❌ AuthProvider - Logout error:", error);
    }
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      canDeleteCustomer: () => getPermission("canDeleteCustomer"),
      canManageUsers: () => getPermission("canManageUsers"),
      canViewMeasurements: () => getPermission("canViewMeasurements"),
      canEditMeasurements: () => getPermission("canEditMeasurements"),
      canAddCustomer: () => getPermission("canAddCustomer"),
      canEditCustomer: () => getPermission("canEditCustomer"),
      logout,
    }),
    [user, isLoading, getPermission, logout]
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

