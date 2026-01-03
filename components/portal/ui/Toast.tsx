'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from "@/lib/motion";
import { toastSlideIn } from "@/lib/animation-variants";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, action?: Toast['action']) => string;
  error: (title: string, message?: string, action?: Toast['action']) => string;
  warning: (title: string, message?: string, action?: Toast['action']) => string;
  info: (title: string, message?: string, action?: Toast['action']) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Remove oldest if exceeding max
        if (updated.length > maxToasts) {
          return updated.slice(-maxToasts);
        }
        return updated;
      });

      // Auto-dismiss
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [maxToasts, removeToast]
  );

  const success = useCallback(
    (title: string, message?: string, action?: Toast['action']) =>
      addToast({ type: 'success', title, message, action }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, action?: Toast['action']) =>
      addToast({ type: 'error', title, message, action, duration: 8000 }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, action?: Toast['action']) =>
      addToast({ type: 'warning', title, message, action }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, action?: Toast['action']) =>
      addToast({ type: 'info', title, message, action }),
    [addToast]
  );

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <div
        className={cn(
          'fixed z-[200] flex flex-col gap-3 pointer-events-none',
          positionClasses[position]
        )}
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const t = useTranslations();

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const styles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-900/40',
      icon: 'text-emerald-500',
      title: 'text-emerald-900 dark:text-emerald-200',
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-900/40',
      icon: 'text-rose-500',
      title: 'text-rose-900 dark:text-rose-200',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-900/40',
      icon: 'text-amber-500',
      title: 'text-amber-900 dark:text-amber-200',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-900/40',
      icon: 'text-blue-500',
      title: 'text-blue-900 dark:text-blue-200',
    },
  };

  const Icon = icons[toast.type];
  const style = styles[toast.type];

  return (
    <motion.div
      layout
      variants={toastSlideIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'pointer-events-auto w-80 max-w-[calc(100vw-2rem)] p-4 rounded-2xl backdrop-blur-xl shadow-xl border',
        style.bg,
        style.border
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={cn('flex-shrink-0 mt-0.5', style.icon)} />
        <div className="flex-1 min-w-0">
          <p className={cn('font-bold text-sm', style.title)}>{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-surface-600 dark:text-surface-400 mt-1 leading-relaxed">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline underline-offset-2"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-surface-800/50 transition-colors"
          aria-label={t('portal.toast.dismiss')}
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={cn(
            'absolute bottom-0 left-0 h-1 rounded-b-2xl',
            toast.type === 'success' && 'bg-emerald-400',
            toast.type === 'error' && 'bg-rose-400',
            toast.type === 'warning' && 'bg-amber-400',
            toast.type === 'info' && 'bg-blue-400'
          )}
        />
      )}
    </motion.div>
  );
}
