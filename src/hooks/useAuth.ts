"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const { user, isAuthenticated, isLoading, checkAuth, login, logout, register } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !mounted,
    login,
    logout,
    register,
    checkAuth,
  };
}

export function useRole(requiredRoles: string[]) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return { allowed: false, loading: true };
  }

  if (!user) {
    return { allowed: false, loading: false };
  }

  return {
    allowed: requiredRoles.includes(user.role),
    loading: false,
    user,
  };
}
