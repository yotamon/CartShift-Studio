import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-white/10 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]",
  {
    variants: {
      padding: {
        default: "p-3 md:p-4",
        none: "",
      },
      hover: {
        true: "hover:border-surface-300 dark:hover:border-white/20 hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)]",
        false: "",
      },
    },
    defaultVariants: {
      padding: "default",
      hover: false,
    },
  }
);

interface PortalCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

export const PortalCard = ({
  children,
  className,
  noPadding = false,
  hoverEffect = false,
  padding, // Allow direct variant usage too if desired, though props override
  hover,
  ...props
}: PortalCardProps) => {
  return (
    <div
      className={cn(
        cardVariants({
          padding: noPadding ? 'none' : (padding || 'default'),
          hover: hoverEffect || hover
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { cardVariants };

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
