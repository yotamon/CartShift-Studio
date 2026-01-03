import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-[0_4px_12px_rgba(2,132,199,0.2),0_0_0_1px_rgba(2,132,199,0.1)] hover:shadow-[0_6px_20px_rgba(2,132,199,0.3),0_0_0_1px_rgba(2,132,199,0.2)]",
        secondary: "bg-surface-100 dark:bg-white/10 text-surface-700 dark:text-white hover:bg-surface-200 dark:hover:bg-white/15",
        outline: "border border-surface-200 dark:border-white/10 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/5",
        ghost: "bg-transparent text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/5",
        danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_12px_rgba(244,63,94,0.2)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.3)]",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-base",
        icon: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface PortalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const PortalButton = ({
  children,
  className,
  variant,
  size,
  isLoading,
  disabled,
  ...props
}: PortalButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export { buttonVariants };
