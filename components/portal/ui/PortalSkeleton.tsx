import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  "animate-pulse bg-surface-200 dark:bg-white/10 rounded-xl",
  {
    variants: {
      variant: {
        default: "",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PortalSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
}

export const PortalSkeleton: React.FC<PortalSkeletonProps> = ({
  className,
  variant,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
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

export const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex gap-4 px-4 py-3 border-b border-surface-100 dark:border-surface-800">
      {Array.from({ length: columns }).map((_, i) => (
        <PortalSkeleton
          key={`header-${i}`}
          className={cn('h-4', i === 0 ? 'w-24' : i === 1 ? 'flex-1' : 'w-20')}
        />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center gap-4 px-4 py-4 border-b border-surface-50 dark:border-surface-900">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <PortalSkeleton
            key={`row-${rowIndex}-col-${colIndex}`}
            className={cn('h-5', colIndex === 0 ? 'w-20' : colIndex === 1 ? 'flex-1' : 'w-16')}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonRequestRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-surface-50 dark:border-surface-900 last:border-b-0">
    <PortalSkeleton className="w-16 h-5" />
    <div className="flex-1 space-y-2">
      <PortalSkeleton className="h-5 w-3/4" />
      <PortalSkeleton className="h-3 w-1/2" />
    </div>
    <PortalSkeleton className="w-20 h-6 rounded-full" />
    <PortalSkeleton className="w-24 h-4" />
  </div>
);

export const SkeletonMemberCard = () => (
  <div className="flex items-center gap-4 p-4 border border-surface-100 dark:border-surface-800 rounded-2xl">
    <SkeletonAvatar />
    <div className="flex-1 space-y-2">
      <PortalSkeleton className="h-5 w-32" />
      <PortalSkeleton className="h-3 w-48" />
    </div>
    <PortalSkeleton className="w-16 h-6 rounded-full" />
  </div>
);

export const SkeletonFileRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-surface-50 dark:border-surface-900 last:border-b-0">
    <PortalSkeleton className="w-10 h-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <PortalSkeleton className="h-5 w-48" />
      <PortalSkeleton className="h-3 w-24" />
    </div>
    <PortalSkeleton className="w-16 h-4" />
    <PortalSkeleton className="w-8 h-8 rounded-lg" />
  </div>
);
