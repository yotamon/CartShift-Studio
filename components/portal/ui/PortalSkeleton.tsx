import React from 'react';
import { cn } from '@/lib/utils';

interface PortalSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const PortalSkeleton: React.FC<PortalSkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-200 dark:bg-white/10 rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

export const SkeletonCard = ({ rows = 1 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <PortalSkeleton key={i} className="h-32" />
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <PortalSkeleton
        key={i}
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return <PortalSkeleton className={cn('rounded-full', sizes[size])} />;
};

