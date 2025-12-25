import React from 'react';
import { cn } from '@/lib/utils';

interface PortalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

export const PortalBadge = ({
  children,
  className,
  variant = 'gray',
  ...props
}: PortalBadgeProps) => {
  const variants = {
    blue: 'portal-badge-blue',
    green: 'portal-badge-green',
    yellow: 'portal-badge-yellow',
    red: 'portal-badge-red',
    gray: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-400',
  };

  return (
    <span className={cn('portal-badge', variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
