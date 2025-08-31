
import { create } from 'zustand';

export type ToastVariant = 'default' | 'destructive';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  variant?: ToastVariant;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `${new Date().getTime()}-${Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
