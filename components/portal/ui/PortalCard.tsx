import React from 'react';
import { cn } from '@/lib/utils';

interface PortalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

export const PortalCard = ({
  children,
  className,
  noPadding = false,
  hoverEffect = false,
  ...props
}: PortalCardProps) => {
  return (
    <div
      className={cn(
        'portal-card',
        !noPadding && 'p-3 md:p-4',
        hoverEffect && 'portal-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const PortalCardHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'px-3 md:px-4 py-3 border-b border-surface-200/60 dark:border-surface-800/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const PortalCardTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn(
        'text-lg font-outfit font-bold text-surface-900 dark:text-white tracking-tight leading-none',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const PortalCardContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-3 md:p-4', className)} {...props}>
      {children}
    </div>
  );
};
