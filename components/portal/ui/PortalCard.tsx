import React from 'react';
import { cn } from '@/lib/utils';

interface PortalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const PortalCard = ({ children, className, noPadding = false, ...props }: PortalCardProps) => {
  return (
    <div
      className={cn(
        "portal-card",
        !noPadding && "p-6",
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
    <div className={cn("px-6 py-4 border-b border-[var(--portal-border)]", className)} {...props}>
      {children}
    </div>
  );
};

export const PortalCardTitle = ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 className={cn("text-lg font-semibold text-[var(--portal-text-primary)]", className)} {...props}>
      {children}
    </h3>
  );
};

export const PortalCardContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
};
