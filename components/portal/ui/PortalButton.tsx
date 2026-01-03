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
    primary: 'portal-btn-primary',
    secondary: 'portal-btn-ghost bg-surface-100/50 dark:bg-surface-800/50',
    outline: 'portal-btn-outline',
    ghost: 'portal-btn-ghost',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[9px]',
    md: 'px-4 py-2 text-[10px]',
    lg: 'px-6 py-3 text-xs',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'portal-btn transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
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
