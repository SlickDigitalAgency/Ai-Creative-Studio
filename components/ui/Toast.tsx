
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore, ToastMessage, ToastVariant } from '../../stores/toastStore';
import { cn } from '../../lib/utils';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';

const toastVariants: { [key in ToastVariant]: string } = {
  default: 'bg-secondary text-secondary-foreground border-border',
  destructive: 'bg-destructive text-destructive-foreground border-destructive',
};

const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  const variant = toast.variant || 'default';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "relative w-full max-w-sm p-4 pr-8 rounded-md shadow-lg pointer-events-auto flex items-start gap-3 border",
        toastVariants[variant]
      )}
      role="alert"
      aria-live="assertive"
    >
      {variant === 'destructive' ? (
         <AlertTriangleIcon className="h-5 w-5 mt-0.5" />
      ) : (
         <CheckCircleIcon className="h-5 w-5 mt-0.5 text-primary" />
      )}
      <div className="flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        <p className="text-sm opacity-90">{toast.description}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="absolute top-2 right-2 p-1 rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring transition-opacity"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </motion.div>
  );
};


const Toaster: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div 
        aria-live="assertive"
        className="fixed bottom-0 right-0 p-4 flex flex-col gap-2 z-50 w-full max-w-sm"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);
  
  const toast = ({ title, description, variant }: { title: string, description: string, variant?: ToastVariant }) => {
    addToast({ title, description, variant });
  };
  
  return { toast };
};

export { Toaster, useToast };
