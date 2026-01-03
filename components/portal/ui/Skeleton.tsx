'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  "bg-surface-200 dark:bg-surface-800",
  {
    variants: {
      variant: {
        default: "rounded-lg",
        circular: "rounded-full",
        rounded: "rounded-2xl",
        text: "rounded-md h-4",
      },
      animation: {
        pulse: "animate-pulse",
        shimmer: "skeleton-shimmer",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "pulse",
    },
  }
);

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant,
  animation,
  width,
  height,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, animation }), className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
      role="presentation"
      {...props}
    />
  );
}

// Pre-built skeleton variants for common patterns
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

const avatarSizeVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export function SkeletonAvatar({ size }: { size?: VariantProps<typeof avatarSizeVariants>['size'] }) {
  return <Skeleton variant="circular" className={avatarSizeVariants({ size })} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950',
        className
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-24 rounded-xl', className)} />;
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-surface-200 dark:border-surface-800">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export { skeletonVariants, avatarSizeVariants };
