import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'moderator' | 'user' | 'student' | 'employee' | 'delivery' | 'client';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            set({ error: data.error, isLoading: false });
            return false;
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ error: 'Erreur de connexion', isLoading: false });
          return false;
        }
      },

      register: async (name: string, email: string, password: string, role: UserRole = 'user') => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
          });

          const data = await res.json();

          if (!res.ok) {
            set({ error: data.error, isLoading: false });
            return false;
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({ error: 'Erreur lors de l\'inscription', isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      checkAuth: async () => {
        const state = get();
        if (state.isAuthenticated && state.user) {
          return;
        }
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
