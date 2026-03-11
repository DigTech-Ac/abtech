// src/components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Cette fonction va appeler /api/auth/me et mettre à jour isAuthenticated
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}