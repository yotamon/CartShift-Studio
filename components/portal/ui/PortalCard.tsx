import React from 'react';
import { cn } from '@/lib/utils';

interface PortalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

export const PortalCard = ({ children, className, noPadding = false, hoverEffect = false, ...props }: PortalCardProps) => {
  return (
    <div
      className={cn(
        "portal-card",
        !noPadding && "p-6 md:p-8",
        hoverEffect && "portal-card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const PortalCardHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("px-6 md:px-8 py-5 border-b border-surface-200/60 dark:border-surface-800/50", className)} {...props}>
      {children}
    </div>
  );
};

export const PortalCardTitle = ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 className={cn("text-xl font-outfit font-black text-surface-900 dark:text-white tracking-tight leading-none", className)} {...props}>
      {children}
    </h3>
  );
};

export const PortalCardContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("p-6 md:p-8", className)} {...props}>
      {children}
    </div>
  );
};

