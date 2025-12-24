import React from 'react';
import { cn } from '@/lib/utils';

interface PortalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const PortalButton = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}: PortalButtonProps) => {
  const variants = {
    primary: "portal-button-primary",
    secondary: "bg-surface-100 hover:bg-surface-200 text-surface-900 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-100",
    outline: "bg-transparent border border-[var(--portal-border)] hover:bg-surface-50 dark:hover:bg-surface-800 text-[var(--portal-text-primary)]",
    ghost: "bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-[var(--portal-text-secondary)]",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "rounded-md font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
