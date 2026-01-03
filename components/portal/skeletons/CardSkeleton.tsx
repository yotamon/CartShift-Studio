'use client';

import { Skeleton } from '@/components/portal/ui/Skeleton';

interface CardSkeletonProps {
  variant?: 'default' | 'compact' | 'horizontal';
  count?: number;
}

export function CardSkeleton({ variant = 'default', count = 1 }: CardSkeletonProps) {
  const cards = Array.from({ length: count });

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {cards.map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 flex items-center gap-4"
          >
            <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="space-y-4">
        {cards.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 flex items-start gap-4"
          >
            <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950"
        >
          <div className="flex items-start gap-4 mb-4">
            <Skeleton variant="circular" className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="flex-1" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
