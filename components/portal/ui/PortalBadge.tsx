import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        blue: "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200",
        green: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200",
        yellow: "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200",
        red: "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200",
        purple: "bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200",
        gray: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-400",
        emerald: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200",
        orange: "bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-200",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
);

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export interface PortalBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const PortalBadge = ({
  className,
  variant,
  ...props
}: PortalBadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { badgeVariants };

