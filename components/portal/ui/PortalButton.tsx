import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
    "transition-all duration-200 ease-out",
    "active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500",
    "dark:focus-visible:ring-offset-surface-900",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-b from-primary-500 to-primary-600 text-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(2,132,199,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:from-primary-400 hover:to-primary-600",
          "hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_24px_rgba(2,132,199,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "active:shadow-[0_0_0_rgba(0,0,0,0),0_2px_8px_rgba(2,132,199,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]",
        ],
        secondary: [
          "bg-surface-100 dark:bg-white/[0.08] text-surface-700 dark:text-white",
          "border border-surface-200/80 dark:border-white/[0.08]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
          "hover:bg-surface-200/80 dark:hover:bg-white/[0.12]",
          "hover:border-surface-300 dark:hover:border-white/[0.12]",
          "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        ],
        outline: [
          "bg-transparent text-surface-700 dark:text-surface-200",
          "border-2 border-surface-200 dark:border-white/[0.12]",
          "hover:bg-surface-50 dark:hover:bg-white/[0.04]",
          "hover:border-surface-300 dark:hover:border-white/[0.18]",
        ],
        ghost: [
          "bg-transparent text-surface-600 dark:text-surface-300",
          "hover:bg-surface-100/80 dark:hover:bg-white/[0.06]",
          "hover:text-surface-900 dark:hover:text-white",
        ],
        danger: [
          "bg-gradient-to-b from-rose-500 to-rose-600 text-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(244,63,94,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:from-rose-400 hover:to-rose-600",
          "hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_24px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
        ],
        success: [
          "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:from-emerald-400 hover:to-emerald-600",
          "hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_24px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]",
        ],
        gradient: [
          "bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_100%] text-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_16px_rgba(192,38,211,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:bg-[position:100%_0] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_28px_rgba(192,38,211,0.3)]",
          "transition-[background-position,box-shadow,transform] duration-500",
        ],
        glass: [
          "bg-white/10 dark:bg-white/[0.06] backdrop-blur-md text-surface-900 dark:text-white",
          "border border-white/30 dark:border-white/[0.1]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.3)]",
          "hover:bg-white/20 dark:hover:bg-white/[0.1]",
          "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4)]",
        ],
      },
      size: {
        xs: "h-7 px-2.5 text-xs gap-1",
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2",
        xl: "h-14 px-8 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const PortalButton = ({
  children,
  className,
  variant,
  size,
  isLoading,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}: PortalButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      ) : null}
      <span className={cn("inline-flex items-center gap-2", isLoading && "opacity-0")}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
};

export { buttonVariants };
