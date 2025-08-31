// Fix: Use named import for 'create' from zustand
import { create } from 'zustand';
import type { User, AuthState } from '../types';

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  logout: () => set({ user: null, loading: false, error: null }),
}));