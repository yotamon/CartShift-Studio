import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';

const inputVariants = cva(
  "w-full px-4 py-2 rounded-xl border transition-all duration-200 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none h-10 text-sm font-medium",
  {
    variants: {
      state: {
        default: "border-surface-200 dark:border-surface-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
        error: "border-red-300 dark:border-red-900/50 focus:border-red-500 focus:ring-red-500/20 bg-red-50/10",
        success: "border-emerald-300 dark:border-emerald-900/50 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/10",
      },
      isDisabled: {
        true: "disabled:bg-surface-50 dark:disabled:bg-surface-800 disabled:text-surface-400 disabled:cursor-not-allowed",
        false: "",
      },
      hasLeftIcon: {
        true: "ps-10",
        false: "ps-4",
      },
      hasRightIcon: {
        true: "pe-10",
        false: "pe-4",
      },
    },
    defaultVariants: {
      state: "default",
      isDisabled: false,
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

interface PortalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'isDisabled' | 'hasLeftIcon' | 'hasRightIcon'> {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: string;
}

export const PortalInput = React.forwardRef<HTMLInputElement, PortalInputProps>(
  ({ label, error, success, className, leftIcon, rightIcon, hint, disabled, ...props }, ref) => {

    const state = error ? 'error' : success ? 'success' : 'default';
    const hasRightContent = Boolean(rightIcon || error || success);

    return (
      <div className="w-full space-y-1.5 group">
        {label && (
          <label className="text-sm font-bold text-surface-700 dark:text-surface-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute start-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none transition-colors group-focus-within:text-blue-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              inputVariants({
                state,
                isDisabled: !!disabled,
                hasLeftIcon: !!leftIcon,
                hasRightIcon: hasRightContent
              }),
              className
            )}
            {...props}
          />

          <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {rightIcon}
            {error && (
              <AlertCircle
                size={18}
                className="text-red-500 animate-in fade-in zoom-in duration-200"
              />
            )}
            {success && !error && (
              <Check
                size={18}
                className="text-emerald-500 animate-in fade-in zoom-in duration-200"
              />
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium animate-in slide-in-from-top-1 duration-200 flex items-center gap-1.5">
            {error}
          </p>
        )}

        {/* Hint Text (if no error) */}
        {!error && hint && <p className="text-xs text-surface-500 dark:text-surface-400">{hint}</p>}
      </div>
    );
  }
);

PortalInput.displayName = 'PortalInput';

export { inputVariants };
